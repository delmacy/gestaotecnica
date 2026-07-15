# Runtime Implementation Gaps Audit

This audit evaluates the minimum vertical System Builder flow (Client -> Workspace -> Capability -> Entity -> Form -> Process -> Publication -> Execution -> Timeline) to identify implementation gaps in runtime contracts.

## 1. Publication Gaps
- **Contracts:** `PublishProcessVersionInput` and `PublishProcessVersionResult` are defined in `src/features/workflow/definitions/process-definition-publication.types.ts`. `PublicationResultEnvelopeSchema` is in `src/platform/workflows/contracts/process-definition.ts`.
- **Status:** Preflight and publication actions exist.
- **Gaps:** No immediate implementation gaps found in publication contract boundaries. The boundary from process definition to a published version is covered.

## 2. Execution (Runtime) Gaps
- **Contracts:** `ActionExecutionSchema` is defined in `src/platform/workflows/runtime/types/action-execution.ts`. `ProcessInstanceSchema` exists in `src/platform/workflows/runtime/types/process-instance.ts`.
- **Status:** Foundational types and some mapping logic are present.
- **Gaps:**
  - Execution Engine Integration: The flow runner service (`src/platform/workflows/infra/flow-runner-service.ts`) requires complete wiring to execute processes end-to-end.
  - Contract Centralization: Runtime schemas (`ActionExecutionSchema`, `ProcessInstanceSchema`) are currently localized inside `src/platform/workflows/runtime/types/` rather than a centralized `src/platform/contracts/` or `src/platform/workflows/contracts/` index for external module consumption.

## 3. Event Receipt Gaps
- **Contracts:** `CanonicalEventSchema` exists in both `src/platform/events/canonical-contract.ts` and `src/platform/events/types/canonical-event.ts`.
- **Status:** Event registry, writer, and mappers exist.
- **Gaps:**
  - Schema Duplication: `CanonicalEventSchema` is defined twice within `src/platform/events/`.
  - Canonical Boundary: Neither definition is exposed via `src/platform/contracts/` to serve as a domain-wide standard boundary.

## 4. Timeline Gaps
- **Contracts:** `TimelineItem` is defined as a TypeScript interface in `src/platform/observability/application/timeline.service.ts`.
- **Status:** `TimelineService` reads from database tables (`events`, `flowRuns`) to construct timeline entries.
- **Gaps:**
  - Missing Canonical Schema: There is no Zod validation schema (e.g., `TimelineItemSchema`) for `TimelineItem`.
  - Type Localization: The type is isolated in the application service layer and not exported centrally, meaning UI or other consumers lack a strict contract to build against.

---

## Follow-up Candidates (Ordered by Dependency)

These candidates represent the smallest, actionable steps to bridge the identified gaps without introducing large architectural shifts:

1. **Resolve Event Schema Duplication**
   - *Dependency Level:* Base
   - *Action:* Consolidate `CanonicalEventSchema` into a single source of truth within `src/platform/events/` and remove the duplicated file.
2. **Centralize Event and Runtime Contracts**
   - *Dependency Level:* Low (Depends on 1)
   - *Action:* Re-export or move `CanonicalEventSchema`, `ActionExecutionSchema`, and `ProcessInstanceSchema` to a centralized contract boundary (e.g., `src/platform/contracts/` or `src/platform/workflows/contracts/`) to ensure UI/Client modules can consume them reliably.
3. **Formalize Timeline Contract**
   - *Dependency Level:* Medium (Depends on 2)
   - *Action:* Convert the `TimelineItem` interface into a formal Zod schema (`TimelineItemSchema`) and expose it through `src/platform/contracts/`.
4. **Wire End-to-End Execution Engine**
   - *Dependency Level:* High (Depends on 1, 2, 3)
   - *Action:* Connect `flow-runner-service.ts` with the publication output to ensure a `ProcessInstance` can be instantiated and mapped to a `TimelineItem`.
