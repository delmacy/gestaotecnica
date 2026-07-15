# Vertical Implementation Sprint Plan

## Context
This plan translates the gap audits into actionable, Jules-ready microtasks for the vertical System Builder implementation.

## Rules & Constraints
- Target Branch: `main`
- Prohibited Scope: Application UI code, Database schema, and Migrations (unless specifically allowed/documented).
- Review Gates: Each task requires standard project checks to pass without weakening tests.
- Shared contracts must be strictly handled sequentially to avoid merge conflicts.

---

## Task Map (Execution Order & Dependencies)

### Task 1: Resolve Event Schema Duplication
- **ID:** `V-01-EVENT-SCHEMA`
- **Dependency:** None
- **Scope:** `src/platform/events/canonical-contract.ts`, `src/platform/events/types/canonical-event.ts`, `src/platform/contracts/`
- **Action:** Consolidate `CanonicalEventSchema` into a single source of truth within `src/platform/events/` and remove the duplicated file. (Ref: [RUNTIME_GAPS_AUDIT.md](RUNTIME_GAPS_AUDIT.md))

### Task 2: Centralize Event & Runtime Contracts
- **ID:** `V-02-CONTRACT-CENTRALIZATION`
- **Dependency:** `V-01-EVENT-SCHEMA`
- **Scope:** `src/platform/workflows/runtime/types/action-execution.ts`, `src/platform/workflows/runtime/types/process-instance.ts`, `src/platform/contracts/`, `src/platform/workflows/contracts/`
- **Action:** Re-export or move `CanonicalEventSchema`, `ActionExecutionSchema`, and `ProcessInstanceSchema` to a centralized contract boundary (e.g., `src/platform/contracts/` or `src/platform/workflows/contracts/`). (Ref: [RUNTIME_GAPS_AUDIT.md](RUNTIME_GAPS_AUDIT.md))

### Task 3: Formalize Timeline Contract
- **ID:** `V-03-TIMELINE-CONTRACT`
- **Dependency:** `V-02-CONTRACT-CENTRALIZATION`
- **Scope:** `src/platform/observability/application/timeline.service.ts`, `src/platform/contracts/`, `src/platform/observability/contracts/`
- **Action:** Convert the `TimelineItem` interface into a formal Zod schema (`TimelineItemSchema`) and expose it through `src/platform/contracts/` or `src/platform/observability/contracts/`. (Ref: [RUNTIME_GAPS_AUDIT.md](RUNTIME_GAPS_AUDIT.md), [VERTICAL_MAP.md](VERTICAL_MAP.md))

### Task 4: Formalize Client & Capability Contracts
- **ID:** `V-04-CLIENT-CAPABILITY-CONTRACTS`
- **Dependency:** `V-03-TIMELINE-CONTRACT`
- **Scope:** `src/platform/contracts/`, `src/components/builder/capabilities/capability-types.ts`, `src/features/builder/persistence/builder-publish.client.ts`, `src/features/builder/persistence/builder-save.client.ts`, `src/features/builder/persistence/builder-load.client.ts`
- **Action:** Create formal contract schema definitions for standard client/frontend builder interactions and a canonical Zod schema for `CapabilityItem` in `src/platform/contracts/`. (Ref: [VERTICAL_MAP.md](VERTICAL_MAP.md))

### Task 5: Formalize Entity Contract
- **ID:** `V-05-ENTITY-CONTRACT`
- **Dependency:** `V-04-CLIENT-CAPABILITY-CONTRACTS`
- **Scope:** `src/platform/contracts/`, `src/db/runtime/schema/identity.ts`
- **Action:** Create a unified canonical Zod schema for a generic "Entity" or "Identity" context independent of the direct Drizzle DB schema in `src/platform/contracts/`. (Ref: [VERTICAL_MAP.md](VERTICAL_MAP.md))

### Task 6: Wire End-to-End Execution Engine
- **ID:** `V-06-FLOW-RUNNER-WIRING`
- **Dependency:** `V-01-EVENT-SCHEMA`, `V-02-CONTRACT-CENTRALIZATION`, `V-03-TIMELINE-CONTRACT`
- **Scope:** `src/platform/workflows/infra/flow-runner-service.ts`
- **Action:** Connect `flow-runner-service.ts` with the publication output to ensure a `ProcessInstance` can be instantiated and mapped to a `TimelineItem`. (Ref: [RUNTIME_GAPS_AUDIT.md](RUNTIME_GAPS_AUDIT.md))

### Task 7: DB Persistence Gaps & Frontend Tracking
- **ID:** `V-07-GAP-TRACKING`
- **Dependency:** None
- **Scope:** Future external streams (Documentation only)
- **Action:** Track the need to fix Platform Schema Leakage (`workspaceId` in `src/db/platform/schema/candidates.ts`, `src/db/platform/schema/workflow.ts`), add immutability to `process_versions` in `src/db/runtime/schema/workflow.ts`, add RLS for Data Bleed prevention, map `workspace_capabilities` for `src/db/platform/schema/registry.ts`, and track frontend UI for persistence configuration. No code or schema changes executed in this task. (Ref: [PERSISTENCE_MULTITENANCY_GAP_AUDIT.md](PERSISTENCE_MULTITENANCY_GAP_AUDIT.md), [PHASE_2_FRONTEND_PARITY_AUDIT_001.md](PHASE_2_FRONTEND_PARITY_AUDIT_001.md))
