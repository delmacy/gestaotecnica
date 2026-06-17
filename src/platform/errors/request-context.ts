import { randomUUID } from "crypto";
import { PlatformErrorContext } from "./factory";

/**
 * createPlatformErrorContextFromRequest - extracts canonical context from a request.
 *
 * Rules:
 * - correlationId: preserved from x-correlation-id header, NOT generated if absent.
 * - id: generated per error instance.
 * - timestamp: generated at creation time.
 */
export function createPlatformErrorContextFromRequest(request: Request): PlatformErrorContext {
  const correlationId = request.headers.get("x-correlation-id") || undefined;

  return {
    id: `err-${randomUUID()}`,
    timestamp: new Date().toISOString(),
    correlationId,
  };
}
