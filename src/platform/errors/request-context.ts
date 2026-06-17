import { randomUUID } from "crypto";
import { PlatformErrorContext } from "./factory";
import { CorrelationIdSchema, EntityIdSchema, ISODateTimeSchema } from "../contracts";

/**
 * PlatformErrorRequestContextDependencies - injectable dependencies for PlatformErrorContext creation.
 */
export interface PlatformErrorRequestContextDependencies {
  createId?: () => string;
  now?: () => string;
}

/**
 * createPlatformErrorContextFromRequest - centralizes the creation of PlatformErrorContext from an HTTP request.
 *
 * Rules:
 * 1. id: Generated via createId() dependency. Validated against EntityIdSchema. Throws on failure.
 * 2. timestamp: Generated via now() dependency. Validated against ISODateTimeSchema. Throws on failure.
 * 3. correlationId: Preserved ONLY if present in 'x-correlation-id' header and valid.
 * 4. Safety: No sensitive headers (authorization, cookies, etc.) are copied.
 * 5. Validation: Validates correlationId against canonical schema and CRLF policy.
 *
 * @param request - The incoming HTTP Request.
 * @param dependencies - Optional dependency overrides for deterministic testing.
 * @returns PlatformErrorContext
 * @throws {ZodError} If generated id or timestamp are invalid.
 */
export function createPlatformErrorContextFromRequest(
  request: Request,
  dependencies: PlatformErrorRequestContextDependencies = {}
): PlatformErrorContext {
  const {
    createId = () => randomUUID(),
    now = () => new Date().toISOString(),
  } = dependencies;

  // 1. Generate and Validate ID
  const id = EntityIdSchema.parse(createId());

  // 2. Generate and Validate Timestamp
  const timestamp = ISODateTimeSchema.parse(now());

  const context: PlatformErrorContext = {
    id,
    timestamp,
  };

  const correlationHeader = request.headers.get("x-correlation-id");

  if (correlationHeader) {
    // 1. Trim
    const trimmed = correlationHeader.trim();

    // 2. Reject CRLF
    const hasCRLF = /[\r\n]/.test(trimmed);

    // 3. Length limit
    const isTooLong = trimmed.length > 255;

    if (!hasCRLF && !isTooLong && trimmed.length > 0) {
      try {
        // Validate against canonical schema
        context.correlationId = CorrelationIdSchema.parse(trimmed);
      } catch {
        // If invalid, we don't set it (Policy: preserve ONLY valid existing header)
      }
    }
  }

  return Object.freeze(context);
}
