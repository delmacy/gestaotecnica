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
    Worker raw output: `/opt/delmacy/system-builder-orchestrator/runs/opencode-worker/UX-NAV-03-029-approval-decision-advance-e2e-real-data/opencode-deepseek-v4-flash-free-raw.jsonl`

    Worker changed files:
    - `tests/integration/ux-nav-03-029-approval-decision-real-data.test.ts`

    Worker summary:
    ## Draft diff summary

**File created:** `tests/integration/ux-nav-03-029-approval-decision-real-data.test.ts` (196 lines)

**What it validates — the through-line (DB → domain → contract → mutation → query → route):**

| Layer | Evidence |
|---|---|
| **Database** | Inserts a `service_orders` row with `status = 'waiting_review'`, verifies it persists |
| **Read path** | `getApprovalQueue()` (consumed by `GET /approvals`) returns the inserted record; `getApprovalSummary()` reflects it in the "Em revisao" card |
| **Contract** | `ApprovalQueueItemSchema` / `ApprovalSummaryItemSchema` validate query output shape |
| **Domain** | `resolveApprovalDecision()` produces correct `approved` status, actor tracking (`approvedById`), and `open` on rejection |
| **Mutation** | DB update persists the domain result; `getApprovalQueue()` no longer returns the approved OS |
| **Route/screen** | `/approvals` — page title "Revisao tecnica", queue table, summary cards |
| **State distinction** | Empty (`getApprovalQueue` length 0) vs data (`waiting_review` items) vs approved (removed from queue) are all tested with real persisted data |

**Validation commands:** `npm run check:no-explicit-any` and `npm run build` — both block on `typescript` not being installed in this environment; Jules will handle environment validation.

**No blockers found** — the contracts, queries, domain logic, and schema all support this integration test without code changes.

    Original task context:
    UX-NAV-03 UX/Full Stack Flow. Stack-based vertical product-slice task generated after governor review showed too little frontend/persistence impact.
