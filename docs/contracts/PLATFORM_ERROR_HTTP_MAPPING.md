# Platform Error HTTP Mapping (PKG-PLATFORM-ERROR-HTTP-MAPPING-001)

This contract defines how canonical `PlatformErrorEnvelope` objects are mapped to HTTP responses.

## HTTP Status Mapping

Mapping is based strictly on the error `category`.

| Category | HTTP Status | Description |
| :--- | :---: | :--- |
| `validation` | 400 | Client-side validation failure. |
| `domain` | 400 | Business logic constraint violation. |
| `authentication` | 401 | Missing or invalid credentials. |
| `authorization` | 403 | Insufficient permissions. |
| `not_found` | 404 | Resource does not exist. |
| `conflict` | 409 | State conflict (e.g., optimistic lock). |
| `rate_limit` | 429 | Too many requests. |
| `integration` | 502 | Bad gateway / External service error. |
| `infrastructure` | 503 | Service unavailable / Infrastructure failure. |
| `timeout` | 504 | Gateway timeout / External timeout. |
| `unexpected` | 500 | Internal server error. |

## Public Message Policy

To prevent information leakage, the `message` field in the public HTTP body is controlled by the following policy:

1.  **Exposable Categories (`validation`, `domain`, `not_found`, `conflict`)**:
    *   Uses `userMessage` if available.
    *   Falls back to the canonical `message`.
    *   *Rationale*: These errors are usually safe and helpful for the user to fix their request.

2.  **Sensitive Categories (`authentication`, `authorization`)**:
    *   Uses fixed generic messages.
    *   *Rationale*: Prevents leaking details about auth schemes or existence of specific permissions.

3.  **Internal/External Errors (`unexpected`, `infrastructure`, `integration`, `timeout`, `rate_limit`)**:
    *   Uses fixed generic messages.
    *   *Rationale*: Prevents leaking stack traces, internal system names, SQL, or raw external provider error messages.

## Public Body Schema

The HTTP response body is a simplified, safe version of the envelope:

```ts
{
  error: {
    code: string;           // Machine-readable code (e.g. "AUTH.USER.LOCKED")
    message: string;        // Safe public message
    category: string;       // Canonical category
    correlationId?: string; // Preserved for support traceability
    retryable?: boolean;    // Preserved if defined in the envelope
  }
}
```

**Explicitly Excluded Fields**:
*   `stack`
*   `details` (raw technical data)
*   `causationId`
*   `source` (pointers/headers)
*   `metadata`
*   `validationIssues` (detailed Zod paths/raw errors)
