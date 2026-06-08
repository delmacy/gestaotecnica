import crypto from "crypto";
import { randomUUID } from "crypto";
import {
  GatewayReceipt,
  AgentSource,
  PayloadFormat,
  SubmissionStatus,
} from "./agent-gateway.types";
import {
  createSubmission,
  findSubmissionByIdempotencyKey,
  updateSubmissionStatus,
} from "./agent-gateway.repository";
import { submitCandidateFromAgent } from "./agent-gateway.service";
import {
  agentProcessCandidatePayloadSchema,
  legacyAgentSubmissionSchema,
  mapAgentPayloadToCandidateInput,
  mapLegacyPayloadToCandidateInput,
} from "./contracts";

export function resolveCorrelationId(headerValue?: string | null): string {
  if (headerValue && headerValue.trim().length > 0) {
    return headerValue.trim();
  }
  return randomUUID();
}

export function sanitizePayload(payload: unknown): Record<string, unknown> {
  if (typeof payload !== "object" || payload === null) {
    return {};
  }

  const payloadStr = JSON.stringify(payload);
  const parsed = JSON.parse(payloadStr);

  const sensitiveKeys = [
    "x-agent-key",
    "authorization",
    "password",
    "token",
    "secret",
  ];

  function removeSensitive(obj: Record<string, unknown> | unknown[]) {
    if (typeof obj !== "object" || obj === null) return;

    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (typeof item === "object" && item !== null) {
          removeSensitive(item as Record<string, unknown> | unknown[]);
        }
      }
      return;
    }

    const recordObj = obj as Record<string, unknown>;
    for (const key in recordObj) {
      if (sensitiveKeys.includes(key.toLowerCase())) {
        recordObj[key] = "[REDACTED]";
      } else if (typeof recordObj[key] === "object" && recordObj[key] !== null) {
        removeSensitive(recordObj[key] as Record<string, unknown> | unknown[]);
      }
    }
  }

  removeSensitive(parsed);
  return parsed;
}

export function generateDeterministicIdempotencyKey(
  sanitizedPayload: Record<string, unknown>,
): string {
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(sanitizedPayload))
    .digest("hex");
  return `auto_${hash}`;
}

export function resolveIdempotencyKey(
  headerValue: string | null | undefined,
  sanitizedPayload: Record<string, unknown>,
): string {
  if (headerValue && headerValue.trim().length > 0) {
    return headerValue.trim();
  }
  return generateDeterministicIdempotencyKey(sanitizedPayload);
}

export async function processAgentSubmissionWithMetadata(
  payload: unknown,
  headers: { correlationId?: string | null; idempotencyKey?: string | null },
): Promise<{
  ok: boolean;
  data?: any;
  error?: any;
  receipt: GatewayReceipt;
}> {
  const sanitizedPayload = sanitizePayload(payload);
  const correlationId = resolveCorrelationId(headers.correlationId);
  const idempotencyKey = resolveIdempotencyKey(
    headers.idempotencyKey,
    sanitizedPayload,
  );

  // Check idempotency early
  const existingSubmission =
    await findSubmissionByIdempotencyKey(idempotencyKey);
  if (existingSubmission) {
    // Determine the duplicate status. If it was already successful, we consider it a duplicate.
    return {
      ok: true,
      data: existingSubmission.candidateId
        ? { id: existingSubmission.candidateId }
        : undefined,
      receipt: {
        correlationId: existingSubmission.correlationId,
        idempotencyKey: existingSubmission.idempotencyKey,
        status: "duplicate",
      },
    };
  }

  // Parse payloads
  const canonicalResult = agentProcessCandidatePayloadSchema.safeParse(payload);
  const legacyResult = legacyAgentSubmissionSchema.safeParse(payload);

  let format: PayloadFormat = "invalid";
  let source: AgentSource = "unknown";
  let workspaceId: string | null = null;
  let validationError: Record<string, unknown> | null = null;

  if (canonicalResult.success) {
    format = "canonical";
    source = canonicalResult.data.agent.source as AgentSource;
    workspaceId = canonicalResult.data.workspaceId;
  } else if (legacyResult.success) {
    format = "legacy";
    source = "legacy";
    workspaceId = legacyResult.data.workspaceId;
  } else {
    validationError = {
      code: "INVALID_PAYLOAD",
      message:
        "Payload validation failed for both canonical and legacy formats.",
      details: {
        canonicalErrors: canonicalResult.error.format(),
        legacyErrors: legacyResult.error.format(),
      },
    };
  }

  // Create submission record (Pending)
  const submission = await createSubmission({
    workspaceId,
    correlationId,
    idempotencyKey,
    requestStatus: "pending",
    candidateId: null,
    source,
    payloadFormat: format,
    sanitizedPayload,
    errorCode: null,
    errorMessage: null,
    processedAt: null,
  });

  if (validationError) {
    await updateSubmissionStatus(submission.id, {
      requestStatus: "failed",
      errorCode: typeof validationError.code === "string" ? validationError.code : "INVALID_PAYLOAD",
      errorMessage: typeof validationError.message === "string" ? validationError.message : "Validation failed",
      processedAt: new Date(),
    });
    return {
      ok: false,
      error: validationError,
      receipt: {
        correlationId,
        idempotencyKey,
        status: "failed",
      },
    };
  }

  try {
    let candidate;
    if (format === "canonical" && canonicalResult.success) {
      const candidateInput = mapAgentPayloadToCandidateInput(
        canonicalResult.data,
      );
      candidate = await submitCandidateFromAgent(candidateInput);
    } else if (format === "legacy" && legacyResult.success) {
      const candidateInput = mapLegacyPayloadToCandidateInput(
        legacyResult.data,
      );
      candidate = await submitCandidateFromAgent(candidateInput);
    } else {
      throw new Error("Invalid state during candidate creation");
    }

    await updateSubmissionStatus(submission.id, {
      requestStatus: "success",
      candidateId: candidate.id,
      processedAt: new Date(),
    });

    return {
      ok: true,
      data: candidate,
      receipt: {
        correlationId,
        idempotencyKey,
        status: "success",
      },
    };
  } catch (error) {
    console.error("Candidate creation failed:", error);
    await updateSubmissionStatus(submission.id, {
      requestStatus: "failed",
      errorCode: "INTERNAL_ERROR",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      processedAt: new Date(),
    });
    return {
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to process agent submission.",
      },
      receipt: {
        correlationId,
        idempotencyKey,
        status: "failed",
      },
    };
  }
}
