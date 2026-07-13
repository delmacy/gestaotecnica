# Runtime Observability Inventory

This document catalogs the current observability surfaces (errors, logs, events) in the runtime engine and defines the chosen canonical contract.

## 1. Error Surface
- **Location**: `src/features/workflow/runtime/runtime.errors.ts`
- **Surface Type**: Static dictionary of error codes and mapped responses.
- **Canonical Status**: Described in `docs/runtime/RUNTIME_ERROR_CONTRACT.md`. Contains mapped error codes like `INVALID_INPUT`, `WORKSPACE_REQUIRED`, `INSTANCE_NOT_FOUND`, etc.
- **Integration point**: `RuntimeResult` and `RuntimeError` types wrap operations like `startProcessInstance` and `advanceStep`.

## 2. Event Log Surface
- **Location**: `src/features/workflow/runtime/events/` (validation, types, repository, actions).
- **Surface Type**: Domain events emitted during runtime state transitions.
- **Database Entity**: `events` table in `src/db/runtime/schema/workflow.ts` (persists `eventType`, `entityType`, `entityId`, `payload`, etc.).
- **Integration point**: `logEvent` is currently called imperatively inside `runtime.service.ts` and `runtime-step.service.ts` to log `step.started`, `step.completed`, and `process.started`.
- **Known Risks**: Emitted without transactional guarantees alongside business state changes (as documented in `RUNTIME_TRANSACTION_IDEMPOTENCY_CONTRACT.md`).

## 3. Observability Timeline API
- **Location**: `src/platform/observability/application/timeline.service.ts`
- **Surface Type**: Server-side service that aggregates workflow events.
- **Integration point**: `src/platform/observability/actions/remote-actions.ts` provides `getLiveTimelineEntries` for frontend consumption.

## Canonical Contract Selection
The chosen canonical observability contract is defined by the intersection of:
1. **Error Contract**: `docs/runtime/RUNTIME_ERROR_CONTRACT.md` (for operational failures).
2. **Event Contract**: The `EventRecord` schema in `src/features/workflow/runtime/events/events.types.ts` acting as the structural contract, integrated with the Responsibility Map (`docs/runtime/RUNTIME_RESPONSIBILITY_MAP.md`).
