# Platform Error Request Context Factory

Canonical factory for creating `PlatformErrorContext` from HTTP requests.

## Objective

Centralize the extraction and validation of platform identifiers and timing from HTTP requests to ensure consistency and eliminate duplication across API routes.

## Signature

```typescript
export function createPlatformErrorContextFromRequest(
  request: Request,
  dependencies?: {
    createId?: () => string;
    now?: () => string;
  }
): PlatformErrorContext
```

## Field Policies

### ID (`id`)
- Generated for every context.
- Default: `crypto.randomUUID()`.
- Injectable via `createId` for deterministic testing.

### Timestamp (`timestamp`)
- Generated for every context.
- Default: `new Date().toISOString()`.
- Injectable via `now` for deterministic testing.

### Correlation ID (`correlationId`)
- Sourced from the `x-correlation-id` header.
- **Preserve ONLY** if it exists and is valid.
- **Never generate** a new correlation ID if missing.
- **Reject** values containing CRLF characters.
- **Reject** values exceeding 255 characters.
- **Trim** surrounding whitespace.

## Security

- **Strict Allowlist**: Only specific headers (currently just `x-correlation-id`) are examined.
- **No Sensitive Data**: Headers like `Authorization`, `Cookie`, or `Set-Cookie` are never copied to the context.
- **No Body Access**: The request body is not read, preserving it for the main route logic.
- **No hostnames/URLs**: Internal URLs or sensitive query parameters are not stored in this context.

## Determinism

When `createId` and `now` are provided in the `dependencies` argument, the factory becomes fully deterministic. Given the same request headers and same dependencies, it will always produce the same `PlatformErrorContext`.

## Usage Example

```typescript
import { createPlatformErrorContextFromRequest, toNextUnknownErrorResponse } from "@/platform/errors";

export async function POST(request: Request) {
  const context = createPlatformErrorContextFromRequest(request);

  try {
    // ... logic ...
  } catch (error) {
    return toNextUnknownErrorResponse(error, context);
  }
}
```
