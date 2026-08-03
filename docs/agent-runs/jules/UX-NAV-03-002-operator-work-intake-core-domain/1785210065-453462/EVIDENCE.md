# Evidence for UX-NAV-03-002: Operator work intake creates persisted work - Core domain model

## Node Version Verification
Verified by checking `node --version`: v24.18.0.

## Route / Screen Affected
- **Route:** `/work-intake` and `/work-intake/[id]`
- **Component:** The components relying on backend state and domain queries/mutations to transition an intake.

## Database / Persistence / Domain Touched
- **Domain Contracts:** `src/modules/work-intake/contracts/intake.schema.ts` establishes strict typed boundaries using `zod` for priorities, sources, request state, and transitions.
- **Kernel/Module Registration:** The core domain module was explicitly registered in `src/platform/kernel.ts`. This wired up the manifest (`workIntakeManifest`) and the two primary actions (`work_intake.capture` and `work_intake.transition`).
- **Domain Persistence Layer (Queries/Actions):** Modified `src/modules/work-intake/queries.ts` and `src/modules/work-intake/kernel-actions.ts` to strictly type the extraction of domain state from the `builder.process_candidates` table without using TypeScript `any`. The implementation correctly masks the raw relational model into the domain interface.
- **State Machine / Invariants:** The `work_intake.transition` action explicitly validates valid enum states (`new`, `triage`, `qualified`, `converted`, `closed`) and enforces workspace isolation by asserting `current.workspaceId === context.workspaceId` during transitions.

## Execution Flow & User Journey
- **Flow:** The user navigates to `/work-intake` to view the intake list or submit a new request.
- **Actions:** When capturing an intake (via `captureIntakeAction`), the frontend pushes payload to `work_intake.capture` action in the domain. A new candidate is written to persistence with the state "new".
- **Next Steps:** A manager or operator transitions the request to "qualified" or "converted" via `transitionIntakeAction` utilizing the `work_intake.transition` domain action. The state machine validates the request exists, ensures it belongs to the current workspace, updates the database, and emits the `work_intake.transitioned` event.
- **Return / Transitions:** Users are redirected back to the `/work-intake/[id]` details page upon completion to view the updated domain state.

## Real Data Proof & Blockers
- Real typing prevents mock injections. The domain strictly parses incoming state with Zod `CreateIntakeInputSchema.parse()`.
- The system properly isolates requests per workspace in `transitionIntakeKernelAction` and `getIntakeRequests`, ensuring cross-tenant queries do not leak data.
- E2E tests were skipped, but unit and integration tests for the module (`work-intake.test.ts` and `work-intake-integration.test.ts`) pass confirming module wiring and contract integrity.
