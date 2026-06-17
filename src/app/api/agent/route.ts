import { NextResponse } from "next/server";
import { processAgentSubmissionWithMetadata } from "@/features/platform/gateway/agent-gateway-metadata.service";
import {
  toNextPlatformErrorResponse,
  toNextUnknownErrorResponse,
  createPlatformErrorContextFromRequest,
} from "@/platform/errors";
import { createPlatformError } from "@/platform/errors/factory";

export async function POST(request: Request) {
  const context = createPlatformErrorContextFromRequest(request);

  try {
    const agentKey = request.headers.get("x-agent-key");
    const idempotencyKey = request.headers.get("x-idempotency-key");
    const validKey = process.env.AGENT_GATEWAY_KEY;

    if (!validKey) {
      console.warn("AGENT_GATEWAY_KEY is not configured in the environment.");
      const envelope = createPlatformError(
        {
          code: "AGENT.CONFIG.MISSING_KEY",
          category: "unexpected",
          severity: "error",
          message: "Agent Gateway is not properly configured.",
        },
        context,
      );
      return toNextPlatformErrorResponse(envelope);
    }

    if (!agentKey || agentKey !== validKey) {
      const envelope = createPlatformError(
        {
          code: "AGENT.AUTH.INVALID_KEY",
          category: "authentication",
          severity: "error",
          message: "Invalid or missing x-agent-key.",
        },
        context,
      );
      return toNextPlatformErrorResponse(envelope);
    }

    const payload = await request.json();

    const result = await processAgentSubmissionWithMetadata(payload, {
      correlationId: context.correlationId,
      idempotencyKey,
    });

    if (!result.ok) {
      // Compatibility Decision: Removal of 'receipt' from public error body.
      // To maintain strict core logic, only canonical details are exposed.
      // Integration tests will verify this breaking change.
      const envelope = createPlatformError(
        {
          code: result.error?.code === "INVALID_PAYLOAD" ? "VALIDATION.PAYLOAD.INVALID" : (result.error?.code || "VALIDATION.PAYLOAD.UNKNOWN"),
          category: "validation",
          severity: "warning",
          message: result.error?.message || "Payload validation failed.",
          details: {
            ...result.error?.details,
            receipt: result.receipt, // Kept in internal details (redacted in public)
          },
        },
        {
          ...context,
          correlationId: result.receipt.correlationId,
        },
      );
      return toNextPlatformErrorResponse(envelope);
    }

    return NextResponse.json(
      { ok: true, data: result.data, receipt: result.receipt },
      { status: 200 },
    );
  } catch (error) {
    return toNextUnknownErrorResponse(error, context);
  }
}
