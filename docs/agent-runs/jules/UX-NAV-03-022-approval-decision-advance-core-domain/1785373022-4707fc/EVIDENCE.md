# Evidence for UX-NAV-03-022: Approval decision advances real workflow - Core domain model

## Stage objective fulfilled
Extracted the type-safe state machine invariants and lifecycle semantics for the "approval decision" product slice into `src/modules/approvals/approval-workflow-domain.ts`. Wired this domain model into the existing `approvals.decide` kernel action so that database mutations now pass through typed domain logic rather than being inferred manually.

As per Governor direction, we explicitly chose to keep the domain object within the `src/modules/approvals/` directory to avoid disjointed architecture mid-slice, as kernel actions and legacy database mappings are co-located there.

## Product Proof

- **Affected Route/Screen:** The approval workflow screens interacting with the `approveServiceOrder` and `returnServiceOrderForExecution` Server Actions (which route to `/approvals` or `/service-orders/:id`). Note: the specific UI rendering will be addressed in future UI stages, but the underlying use-case handler logic (`.decide`) is now governed by the domain file. When initiated by a platform Builder, evidence starts at `/builder`, identifies the organization/workspace, preserves context, executes the workflow decision on the target OS, and redirects appropriately.
- **Persistence Path:** Service Order mutations for the `approvals.decide` flow now parse state through the domain entity (`resolveApprovalDecision`) which issues a typed mutation instruction mapping directly to the legacy schema updates.
- **Workspace Scoping:** The `WorkspaceContext` is passed entirely into the `resolveApprovalDecision` domain invariant check.
- **Real-Data State Distinctness:** No mock values, no `any`, no synthetic fallback data. Decisions are only allowed on Service Orders in the correct real status (`waiting_review`), and all timestamps and `approvedById` data resolve truthfully from the execution context.
- **Base SHA:** Recorded on origin/main prior to changes. Node version: v24.18.1.
- **Blocker / Follow-up Task Needed:** Only the `.decide` path was migrated. The `.request` path in the approval module needs to be refactored to use a similar invariant-based typed approach in a subsequent task.
