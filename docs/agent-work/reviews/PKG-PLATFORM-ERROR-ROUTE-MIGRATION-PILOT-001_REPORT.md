# Migration Report: PKG-PLATFORM-ERROR-ROUTE-MIGRATION-PILOT-001

## Pilot Route Migration Status

| Route | Method | Type | Status |
|-------|--------|------|--------|
| `/api/gateway/modules` | GET | Simple Read | Completed |
| `/api/agent` | POST | Creation/Alteration | Completed |
| `/api/gateway/webhooks` | POST | Integration/Workflow | Completed |

## Detailed Changes

### 1. `/api/gateway/modules`
- **Previous Behavior:** Returns `NextResponse` directly. Auth errors return a simple JSON object. Unexpected errors are not explicitly caught (handled by Next.js defaults).
- **New Behavior:** Uses `try-catch`. Auth errors use `createPlatformError` (category: `authentication`). Unexpected errors use `toNextUnknownErrorResponse`. Uses central `createPlatformErrorContextFromRequest` helper.
- **Status Preserved:** 200 OK, 401 Unauthorized.
- **Breaking Change:** Auth error body now follows canonical envelope.

### 2. `/api/agent`
- **Previous Behavior:** Manual `try-catch` with custom JSON error bodies for 401, 400, and 500. `console.error` for internal errors.
- **New Behavior:** Integrated with `PlatformError` factory and `NextResponse` adapter. Redacts internal error details. Preserves `correlationId` and `idempotencyKey` in the response envelope/headers.
- **Status Preserved:** 200, 401, 400, 500.
- **Breaking Change:** The `receipt` field is no longer returned in the public 400 error body.

### 3. `/api/gateway/webhooks`
- **Previous Behavior:** Returns `NextResponse`. Minimal error handling for missing `eventType`.
- **New Behavior:** Uses `try-catch`. Auth and validation errors (missing `eventType`) are mapped to canonical `PlatformError`. Uses central context helper.
- **Status Preserved:** 200, 401, 400.

## Verification Results
- [x] Success cases preserved for all 3 routes.
- [x] Validation errors (400) return canonical envelope.
- [x] Unauthorized (401) return canonical envelope.
- [x] Unexpected (500) redacted.
- [x] Correlation ID preserved in headers/envelope.
- [x] No new correlation ID generated when absent.
- [x] `npm run build` passing.
- [x] Integration tests passing.
