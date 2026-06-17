# Pilot Migration: PlatformError and NextResponse Adapter

- **Package ID:** PKG-PLATFORM-ERROR-ROUTE-MIGRATION-PILOT-001
- **Status:** Completed
- **Target Branch:** feature/pkg-platform-error-route-migration-pilot-001

## Selected Routes

The following 3 routes were selected for the pilot migration based on their representative nature and risk profile.

### 1. Simple Read Route
- **Path:** `src/app/api/gateway/modules/route.ts`
- **Type:** GET
- **Reason:** It's a simple metadata route that uses `validateGatewayRequest`. It provides a clean baseline for migrating authentication errors and unexpected failures without complex business logic.

### 2. Creation/Alteration Route
- **Path:** `src/app/api/agent/route.ts`
- **Type:** POST
- **Reason:** It involves payload parsing, metadata resolution, and integration with the `AgentGatewayMetadataService`. It handles multiple error conditions (unauthorized, configuration error, validation error, internal error) that need to be mapped to the canonical pipeline.

### 3. Integration/Workflow Route
- **Path:** `src/app/api/gateway/webhooks/route.ts`
- **Type:** POST
- **Reason:** It represents an integration entry point that records inbound events and triggers side effects (logging to `eventLogs`). It demonstrates how to handle errors in an asynchronous-leaning integration flow and uses shared auth utilities.

## Migration Principles

- Use `toNextPlatformErrorResponse` for expected errors.
- Use `toNextUnknownErrorResponse` for unexpected errors (the "catch-all").
- Preserve public status codes when they are semantically correct.
- Ensure no stack traces or internal details are leaked in production.
- **Correlation ID Policy:** Existing `correlationId` is preserved from `x-correlation-id` header. If absent, none is generated at the context level to avoid non-deterministic behavior.
- **Generated Values:** Error `id` (deterministic UUID prefix) and `timestamp` are generated per error instance via the central `createPlatformErrorContext` helper.
- **Compatibility:** Public error responses for `/api/agent` include the `receipt` in the `metadata` field to maintain compatibility with existing consumers.
