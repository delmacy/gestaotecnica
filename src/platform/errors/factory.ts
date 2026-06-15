import {
  PlatformErrorEnvelope,
  PlatformErrorEnvelopeSchema,
  PlatformErrorCategory,
  PlatformErrorSeverity
} from "./schema";
import { WorkspaceId, CorrelationId, CausationId } from "../contracts";

/**
 * createPlatformError - creates a validated PlatformErrorEnvelope from partial input.
 */
export function createPlatformError(input: Partial<PlatformErrorEnvelope> & {
  code: string;
  category: PlatformErrorCategory;
  severity: PlatformErrorSeverity;
  message: string;
}): PlatformErrorEnvelope {
  const envelope: PlatformErrorEnvelope = {
    id: input.id ?? crypto.randomUUID(),
    code: input.code,
    category: input.category,
    severity: input.severity,
    message: input.message,
    userMessage: input.userMessage,
    timestamp: input.timestamp ?? new Date().toISOString(),
    workspaceId: input.workspaceId,
    correlationId: input.correlationId,
    causationId: input.causationId,
    source: input.source,
    details: input.details,
    validationIssues: input.validationIssues,
    retry: input.retry,
    metadata: input.metadata,
  };

  return PlatformErrorEnvelopeSchema.parse(envelope);
}

/**
 * isPlatformError - type guard to check if a value is a valid PlatformErrorEnvelope.
 */
export function isPlatformError(value: unknown): value is PlatformErrorEnvelope {
  return PlatformErrorEnvelopeSchema.safeParse(value).success;
}

/**
 * serializePlatformError - ensures the error is serializable (plain object).
 */
export function serializePlatformError(error: PlatformErrorEnvelope): string {
  return JSON.stringify(error);
}

/**
 * sanitizeUnknownError - converts an unknown error into a safe PlatformErrorEnvelope.
 */
export function sanitizeUnknownError(
  error: unknown,
  context?: {
    workspaceId?: WorkspaceId;
    correlationId?: CorrelationId;
    causationId?: CausationId;
  }
): PlatformErrorEnvelope {
  if (isPlatformError(error)) {
    return {
      ...error,
      workspaceId: error.workspaceId ?? context?.workspaceId,
      correlationId: error.correlationId ?? context?.correlationId,
      causationId: error.causationId ?? context?.causationId,
    };
  }

  let message = "An unexpected error occurred";
  let details: Record<string, unknown> | undefined = undefined;

  if (error instanceof Error) {
    message = error.message;
    // We intentionally do not expose the stack trace
  } else if (typeof error === "string") {
    message = error;
  } else if (typeof error === "object" && error !== null) {
    // If it's a plain object but not a PlatformError, we can pick up message if it exists
    const maybeError = error as Record<string, unknown>;
    if (typeof maybeError.message === "string") {
      message = maybeError.message;
    }
    // We could potentially include other safe fields in details,
    // but the requirement is to produce a safe envelope.
    details = { raw: JSON.parse(JSON.stringify(error)) };
  }

  return createPlatformError({
    code: "UNEXPECTED.SYSTEM.UNKNOWN_ERROR",
    category: "unexpected",
    severity: "error",
    message,
    userMessage: "Ocorreu um erro inesperado. Por favor, tente novamente ou entre em contato com o suporte.",
    workspaceId: context?.workspaceId,
    correlationId: context?.correlationId,
    causationId: context?.causationId,
    details,
  });
}
