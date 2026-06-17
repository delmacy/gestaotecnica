# Migration Report: PKG-PLATFORM-ERROR-ROUTE-MIGRATION-PILOT-001

## Pilot Route Migration Status

| Route | Method | Type | Status |
|-------|--------|------|--------|
| `/api/gateway/modules` | GET | Simple Read | Pending |
| `/api/agent` | POST | Creation/Alteration | Pending |
| `/api/gateway/webhooks` | POST | Integration/Workflow | Pending |

## Detailed Changes

### 1. `/api/gateway/modules`
- **Previous Behavior:** Returns `NextResponse` directly. Auth errors return a simple JSON object. Unexpected errors are not explicitly caught (handled by Next.js defaults).
- **New Behavior:** Uses `try-catch`. Auth errors use `createPlatformError` (category: `authentication`). Unexpected errors use `toNextUnknownErrorResponse`.
- **Status Preserved:** 200 OK, 401 Unauthorized.

### 2. `/api/agent`
- **Previous Behavior:** Manual `try-catch` with custom JSON error bodies for 401, 400, and 500. `console.error` for internal errors.
- **New Behavior:** Integrated with `PlatformError` factory and `NextResponse` adapter. Redacts internal error details. Preserves `correlationId` and `idempotencyKey` in the response envelope/headers where applicable.
- **Status Preserved:** 200, 401, 400, 500.

### 3. `/api/gateway/webhooks`
- **Previous Behavior:** Returns `NextResponse`. Minimal error handling for missing `eventType`.
- **New Behavior:** Uses `try-catch`. Auth and validation errors (missing `eventType`) are mapped to canonical `PlatformError`.
- **Status Preserved:** 200, 401, 400.

## Verification Results
- [ ] Success cases preserved for all 3 routes.
- [ ] Validation errors (400) return canonical envelope.
- [ ] Unauthorized (401) return canonical envelope.
- [ ] Unexpected (500) redacted.
- [ ] Correlation ID preserved in headers/envelope.
- [ ] `npm run build` passing.
- [ ] PlatformError unit tests passing.
