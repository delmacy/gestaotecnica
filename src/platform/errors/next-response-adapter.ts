import { NextResponse } from "next/server";
import { PlatformErrorEnvelope } from "./schema";
import { toPlatformErrorHttpResponse } from "./http-mapping";
import { sanitizeUnknownError } from "./sanitizer";
import { createPlatformError, PlatformErrorContext } from "./factory";
import { randomUUID } from "crypto";

/**
 * createPlatformErrorContext - extracts canonical context from a request.
 *
 * Rules:
 * - correlationId: preserved from x-correlation-id header, NOT generated if absent.
 * - id: generated per error instance.
 * - timestamp: generated at creation time.
 */
export function createPlatformErrorContext(request: Request): PlatformErrorContext {
  const correlationId = request.headers.get("x-correlation-id") || undefined;

  return {
    id: `err-${randomUUID()}`,
    timestamp: new Date().toISOString(),
    correlationId,
  };
}

/**
 * PKG-PLATFORM-ERROR-NEXT-RESPONSE-ADAPTER-001
 * Adapter to transform a PlatformErrorEnvelope into a Next.js NextResponse.
 */

/**
 * toNextPlatformErrorResponse - transforms a validated PlatformErrorEnvelope into a NextResponse.
 *
 * @param error - Validated PlatformErrorEnvelope.
 * @returns NextResponse with mapped status and safe body.
 */
export function toNextPlatformErrorResponse(error: PlatformErrorEnvelope): NextResponse {
  const { status, body } = toPlatformErrorHttpResponse(error);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Correlation ID policy:
  // - preserve exactly the correlationId validated
  // - do not generate new ID
  // - do not accept CRLF (extra safety)
  if (error.correlationId) {
    const safeCorrelationId = error.correlationId.replace(/[\r\n]/g, "");
    if (safeCorrelationId === error.correlationId) {
      headers["X-Correlation-Id"] = error.correlationId;
    }
  }

  return NextResponse.json(body, {
    status,
    headers,
  });
}

/**
 * toNextUnknownErrorResponse - sanitizes an unknown error and returns a NextResponse.
 *
 * @param error - The unknown error to handle.
 * @param context - Platform context for error creation.
 * @returns NextResponse with sanitized error.
 */
export function toNextUnknownErrorResponse(
  error: unknown,
  context: PlatformErrorContext
): NextResponse {
  const details = sanitizeUnknownError(error);

  const envelope = createPlatformError(
    {
      code: "UNEXPECTED.SERVER.ERROR",
      category: "unexpected",
      severity: "error",
      message: "An unexpected error occurred",
      details,
    },
    context
  );

  return toNextPlatformErrorResponse(envelope);
}
