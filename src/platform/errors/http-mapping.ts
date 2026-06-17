import { PlatformErrorEnvelope, PlatformErrorCategory } from "./schema";

/**
 * PlatformErrorHttpBody - public representation of a platform error for HTTP responses.
 */
export interface PlatformErrorHttpBody {
  error: {
    code: string;
    message: string;
    category: string;
    correlationId?: string;
    retryable?: boolean;
  };
}

/**
 * Mapeia categorias canônicas para status HTTP.
 */
const CATEGORY_TO_STATUS: Record<PlatformErrorCategory, number> = {
  validation: 400,
  domain: 400,
  authentication: 401,
  authorization: 403,
  not_found: 404,
  conflict: 409,
  rate_limit: 429,
  integration: 502,
  infrastructure: 503,
  timeout: 504,
  unexpected: 500,
};

/**
 * mapPlatformErrorToHttpStatus - returns the HTTP status code for a given PlatformErrorEnvelope.
 * PURE function.
 */
export function mapPlatformErrorToHttpStatus(error: PlatformErrorEnvelope): number {
  return CATEGORY_TO_STATUS[error.category] || 500;
}

/**
 * toPlatformErrorHttpBody - converts a PlatformErrorEnvelope to a safe HTTP body.
 * PURE function.
 *
 * Security Policy:
 * - validation/domain: can expose canonical message (userMessage or message).
 * - authentication/authorization: uses generic safe message.
 * - internal/unexpected/infrastructure: uses generic safe message.
 * - integration: uses generic safe message (avoid exposing external provider details).
 */
export function toPlatformErrorHttpBody(error: PlatformErrorEnvelope): PlatformErrorHttpBody {
  let publicMessage = "An unexpected error occurred.";

  if (error.category === "validation" || error.category === "domain" || error.category === "not_found" || error.category === "conflict") {
    publicMessage = error.userMessage || error.message;
  } else if (error.category === "authentication") {
    publicMessage = "Authentication failed.";
  } else if (error.category === "authorization") {
    publicMessage = "You do not have permission to perform this action.";
  } else if (error.category === "rate_limit") {
    publicMessage = "Too many requests. Please try again later.";
  } else if (error.category === "timeout") {
    publicMessage = "The request timed out.";
  } else if (error.category === "integration" || error.category === "infrastructure") {
    publicMessage = "An error occurred while communicating with an external service.";
  }

  return {
    error: {
      code: error.code,
      message: publicMessage,
      category: error.category,
      correlationId: error.correlationId,
      retryable: error.retry?.retryable,
    },
  };
}

/**
 * toPlatformErrorHttpResponse - combines status and body for an HTTP response.
 * PURE function.
 */
export function toPlatformErrorHttpResponse(error: PlatformErrorEnvelope): {
  status: number;
  body: PlatformErrorHttpBody;
} {
  return {
    status: mapPlatformErrorToHttpStatus(error),
    body: toPlatformErrorHttpBody(error),
  };
}
