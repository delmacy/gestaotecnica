# Runtime Diagnostic Contract

This document formalizes the runtime diagnostic contracts (`RuntimeDiagnosticEnvelopeSchema` and `RuntimeSupportLookupQuerySchema`) and outlines the operational non-goals for this surface.

## 1. Context and Gate Alignment

This documentation is part of the **RT-03** (Runtime Observability) lane.

- **Gate A (Architecture) Readiness**: This contract defines the semantic boundary between internal runtime faults and public diagnostic envelopes. It maps raw operational failures into structurally safe payloads without exposing sensitive business data.
- **Gate E (Readiness)**: By defining these strict semantic boundaries (`RuntimeDiagnosticEnvelopeSchema` and `RuntimeSupportLookupQuerySchema`), we achieve Gate E readiness for operational traceability without requiring immediate database support or Drizzle schema migrations.

## 2. Canonical Contracts

### 2.1 RuntimeDiagnosticEnvelope
The `RuntimeDiagnosticEnvelope` is the safe, redactable error boundary for the runtime engine. It strictly requires:
- `correlationId`: For cross-system tracing.
- `processId` & `actionId`: For localized debugging.
- `redactionClass`: Must be strictly typed (e.g., `'PUBLIC'`, `'INTERNAL'`, `'RESTRICTED'`).
- **Strict Exclusion**: Raw sensitive payloads are structurally excluded. The public envelope extends this to include `code`, `message`, and `retryable` properties as defined in `docs/runtime/RUNTIME_ERROR_CONTRACT.md`.

### 2.2 RuntimeSupportLookupQuery
The support lookup query strictly mandates:
- `workspaceId`: To enforce the tenant boundary.
- `correlationId`: To lookup specific execution traces.

## 3. Support Non-Goals

To maintain strict boundaries and prevent feature creep, the following are explicitly **out of scope** (Non-Goals) for the RT-03 runtime diagnostic scope:
- **No Database Persistence**: Diagnostics and errors are not persisted to the database as part of this contract. There are no Drizzle migrations or tables for diagnostics.
- **No Raw Payload Tracing**: Sensitive business payloads are strictly excluded from diagnostics. We do not support dumping raw payload state into error logs.
- **No UI Dashboards**: We are not building frontend interfaces, tables, or admin dashboards for viewing these diagnostic logs.
- **No Automated Remediation**: The contract is purely observational. It does not provide self-healing or automatic replay mechanisms.
