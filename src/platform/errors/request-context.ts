import { randomUUID } from "crypto";
import { PlatformErrorContext } from "./factory";
import { CorrelationIdSchema } from "../contracts";

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
 * 1. id: Generated via createId() dependency (defaults to randomUUID).
 * 2. timestamp: Generated via now() dependency (defaults to new Date().toISOString()).
 * 3. correlationId: Preserved ONLY if present in 'x-correlation-id' header and valid.
 * 4. Safety: No sensitive headers (authorization, cookies, etc.) are copied.
 * 5. Validation: Validates correlationId against canonical schema and CRLF policy.
 *
 * @param request - The incoming HTTP Request.
 * @param dependencies - Optional dependency overrides for deterministic testing.
 * @returns PlatformErrorContext
 */
export function createPlatformErrorContextFromRequest(
  request: Request,
  dependencies: PlatformErrorRequestContextDependencies = {}
): PlatformErrorContext {
  const {
    createId = () => randomUUID(),
    now = () => new Date().toISOString(),
  } = dependencies;

  const context: PlatformErrorContext = {
    id: createId(),
    timestamp: now(),
  };

  const correlationHeader = request.headers.get("x-correlation-id");

  if (correlationHeader) {
    // 1. Trim
    const trimmed = correlationHeader.trim();

    // 2. Reject CRLF
    const hasCRLF = /[\r\n]/.test(trimmed);

    // 3. Length limit (standard CorrelationIdSchema usually handles min(1), we add reasonable max)
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

  // Idempotency key is not yet part of PlatformErrorContext contract
  // CausationId is not typically sourced directly from simple HTTP headers without specific protocols
  // WorkspaceId is usually resolved by a dedicated service/middleware, not directly from raw request in this factory

  return Object.freeze(context);
}
