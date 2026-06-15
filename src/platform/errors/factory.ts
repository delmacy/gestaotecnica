import {
  PlatformErrorEnvelope,
  PlatformErrorEnvelopeSchema,
  PlatformErrorCategory,
  PlatformErrorSeverity
} from "./schema";
import { WorkspaceId, CorrelationId, CausationId, EntityId, ISODateTime } from "../contracts";

/**
 * PlatformErrorContext - context required for creating or sanitizing errors.
 */
export interface PlatformErrorContext {
  id: EntityId;
  timestamp: ISODateTime;
  workspaceId?: WorkspaceId;
  correlationId?: CorrelationId;
  causationId?: CausationId;
}

/**
 * safelyReadProperty - safely reads a property from an object using Reflect.
 */
function safelyReadProperty(
  value: object,
  key: PropertyKey
): unknown {
  try {
    return Reflect.get(value, key);
  } catch {
    return undefined;
  }
}

/**
 * createPlatformError - creates a validated PlatformErrorEnvelope from partial input.
 * All identifiers and timestamps must be provided explicitly.
 */
export function createPlatformError(
  input: Omit<PlatformErrorEnvelope, "id" | "timestamp" | "workspaceId" | "correlationId" | "causationId"> & {
    userMessage?: string;
  },
  context: PlatformErrorContext
): PlatformErrorEnvelope {
  const envelope: PlatformErrorEnvelope = {
    ...input,
    id: context.id,
    timestamp: context.timestamp,
    workspaceId: context.workspaceId,
    correlationId: context.correlationId,
    causationId: context.causationId,
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
 * Validates the envelope before serialization.
 */
export function serializePlatformError(error: PlatformErrorEnvelope): string {
  PlatformErrorEnvelopeSchema.parse(error);
  return JSON.stringify(error);
}

/**
 * sanitizeUnknownError - converts an unknown error into a safe PlatformErrorEnvelope.
 * Uses an allowlist for details to avoid leaking sensitive data or failing on non-serializable values.
 */
export function sanitizeUnknownError(
  error: unknown,
  context: PlatformErrorContext
): PlatformErrorEnvelope {
  if (isPlatformError(error)) {
    // Preserve existing identity and fill missing context
    const enriched: PlatformErrorEnvelope = {
      ...error,
      workspaceId: error.workspaceId ?? context.workspaceId,
      correlationId: error.correlationId ?? context.correlationId,
      causationId: error.causationId ?? context.causationId,
    };
    return PlatformErrorEnvelopeSchema.parse(enriched);
  }

  let message = "An unexpected error occurred";
  const details: Record<string, unknown> = {};

  const SAFE_FIELDS = ["name", "message", "code", "status", "statusCode", "type"];
  const SENSITIVE_KEYWORDS = ["password", "token", "auth", "key", "secret", "cookie"];

  const isSafeKey = (key: string) => {
    const lowerKey = key.toLowerCase();
    return SAFE_FIELDS.includes(key) && !SENSITIVE_KEYWORDS.some(k => lowerKey.includes(k));
  };

  const isSerializableScalar = (val: unknown): val is string | number | boolean | null => {
    const type = typeof val;
    return type === "string" || type === "number" || type === "boolean" || val === null;
  };

  if (error instanceof Error) {
    message = error.message;
    // Pick safe fields from Error
    for (const key of SAFE_FIELDS) {
      const val = safelyReadProperty(error, key);
      if (isSerializableScalar(val)) {
        details[key] = val;
      }
    }
  } else if (typeof error === "string") {
    message = error;
  } else if (typeof error === "object" && error !== null) {
    const maybeError = error as object;
    const msg = safelyReadProperty(maybeError, "message");
    if (typeof msg === "string") {
      message = msg;
    }

    try {
      // Allowlist-based shallow copy of safe fields
      for (const key of Object.keys(maybeError)) {
        if (isSafeKey(key)) {
          const val = safelyReadProperty(maybeError, key);
          if (isSerializableScalar(val)) {
            details[key] = val;
          }
        }
      }
    } catch {
      // Handle cases where Object.keys might throw (though rare for objects)
    }
  }

  // Ensure no stack leakage in message or details
  const sanitizeString = (s: string) => s.replace(/at\s+.*\s+\(.*\)/g, "[STACK_REMOVED]");

  const finalMessage = sanitizeString(message);
  for (const key of Object.keys(details)) {
    const val = details[key];
    if (typeof val === "string") {
      details[key] = sanitizeString(val);
    }
  }

  return createPlatformError({
    code: "UNEXPECTED.SYSTEM.UNKNOWN_ERROR",
    category: "unexpected",
    severity: "error",
    message: finalMessage,
    userMessage: "Ocorreu um erro inesperado. Por favor, tente novamente ou entre em contato com o suporte.",
    details: Object.keys(details).length > 0 ? details : undefined,
  }, context);
}
