# Context

        OpenCode worker prepared an initial draft for this task.

    Draft handling policy:
    - Jules must act as tester/finalizer for the worker draft.
    - Inspect the worker diff first.
    - Keep only changes that satisfy the task contract and allowed scope.
    - Run focused validation and add evidence.
    - Make only minimal corrections if validation fails.
    - Open the PR only after validation is coherent.
    - If the draft is unsafe, empty, out of scope, or not salvageable, stop with a concise blocker.

    Worker model: `opencode/deepseek-v4-flash-free`
    Worker raw output: `/opt/delmacy/system-builder-orchestrator/runs/opencode-worker/UX-NAV-03-028-approval-decision-advance-integration-binding/opencode-deepseek-v4-flash-free-raw.jsonl`

    Worker changed files:
    - `src/modules/approvals/kernel-actions.ts`

    Worker summary:
    Let me read the key files to understand the current binding state.
Now I have a clear understanding of the gap. The `approvalDecisions` table exists in the governance schema but is never written to during the decision flow. The kernel action updates `serviceOrders` status but doesn't record the decision in its dedicated audit table. Let me close this gap.
Now let me verify the changed file looks correct:
Now let me run the required validation commands:
## Draft diff summary

**1 file changed:** `src/modules/approvals/kernel-actions.ts`

### What changed

**Added persistence to `approvalDecisions` table** (governance schema) in `decideApprovalKernelAction.handler`, after the service order status update succeeds.

Previously, the kernel action:
- Updated `serviceOrders` status → ✅
- Emitted `approval.decided` event → ✅
- **Never recorded the decision in the dedicated audit table** → ❌

Now it also inserts a row into `governance.approval_decisions` with:
- `workspaceId` from the resolved `WorkspaceContext` (not hardcoded/fallback)
- `subjectType` = `"service_order"`
- `subjectId` = the OS UUID
- `subjectVersion` = the status at time of decision (for state anchoring)
- `decision` = `"approve"` / `"reject"`
- `actorType` / `actorId` from context
- `justification` = the note provided by the reviewer
- `decidedAt` = domain-computed timestamp

### Through-line

| Layer | Path |
|---|---|
| **DB** | `src/db/runtime/schema/governance.ts:35` — `approvalDecisions` table (existed, never written) |
| **Domain** | `src/modules/approvals/approval-workflow-domain.ts:44` — `resolveApprovalDecision()` (unchanged) |
| **Contract** | `src/platform/governance/contracts/approval-decision.ts` — `ApprovalDecisionSchema` (unchanged) |
| **Use case/API** | `src/modules/approvals/kernel-actions.ts:185` — insert into `approvalDecisions` (new) |
| **UI** | `src/app/approvals/page.tsx` — `/approvals` route (unchanged, consumes `getApprovalQueue` from `serviceOrders`) |
| **Navigation** | `src/components/layout/AppShell.tsx:76` — sidebar link to `/approvals` (unchanged) |

### Known limitation (blocker for workspace-scoped reads)

The `serviceOrders` table (`src/db/legacy/schema.ts:755`) lacks a `workspaceId` column. Approval queue queries (`getApprovalQueue`, `getApprovalSummary`) cannot filter by workspace. This is a pre-existing schema gap affecting all service order queries, not limited to approvals. A migration adding `workspace_id` to `service_orders` would be needed — out of scope for this binding stage.

### Validation

- `npm run check:no-explicit-any` — blocks on missing `typescript` dep (Jules handles env repair)
- `npm run build` — blocks on missing `next` dep (Jules handles env repair)

    Original task context:
    UX-NAV-03 UX/Full Stack Flow. Stack-based vertical product-slice task generated after governor review showed too little frontend/persistence impact.
