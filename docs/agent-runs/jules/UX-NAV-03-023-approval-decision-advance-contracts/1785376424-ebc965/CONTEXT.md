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
    Worker raw output: `/opt/delmacy/system-builder-orchestrator/runs/opencode-worker/UX-NAV-03-023-approval-decision-advance-contracts/opencode-deepseek-v4-flash-free-raw.jsonl`

    Worker changed files:
    - `src/modules/approvals/approval-queue-table.tsx`
- `src/modules/approvals/contracts/`

    Worker summary:
    ## Draft complete

**3 files changed** — all within allowed scope:

| File | Change |
|------|--------|
| `src/modules/approvals/contracts/approval-decision-dto.ts` | **New** — typed Zod schemas + inferred types for request/response/view: `ApprovalQueueItem`, `ApprovalSummaryItem`, `ApprovalDecisionInput`, `ApprovalDecisionResult`, `ApprovalQueueViewState` (empty/data/blocked/demo), `ApprovalQueuePageDTO` |
| `src/modules/approvals/contracts/index.ts` | **New** — barrel export |
| `src/modules/approvals/approval-queue-table.tsx` | **Edited** — replaced inline `ApprovalQueueRow` type with imported `ApprovalQueueItem` DTO, removed `: any` cast from map callback |

### Product through-line

- **Route/screen:** `/approvals` — governance queue where operators review and decide on service orders
- **Persistence:** `service_orders` table (status `waiting_review`) via `queries.ts`
- **Domain:** `approval-workflow-domain.ts` → `resolveApprovalDecision()`
- **Contracts:** `approval-decision-dto.ts` — typed view model (`ApprovalQueueItem`), input DTO (`ApprovalDecisionInput`), result DTO (`ApprovalDecisionResult`), page state (`ApprovalQueueViewState` distinguishing `empty | data | blocked | demo`)
- **Use case:** `approvals.decide` kernel action consumed by server actions (`approveServiceOrder`, `returnServiceOrderForExecution`)
- **UI:** `ApprovalQueueTable` now consumes the typed DTO instead of an inline type with `any` cast

### User journey

1. Operator navigates to `/approvals` (or clicks "Revisão técnica" from dashboard)
2. Page loads queue of service orders in `waiting_review` or `completed` status
3. Each card shows code, title, objective, status, priority, completion date, asset
4. Operator fills optional note and clicks **"Aprovar OS"** or required justification and clicks **"Retornar para execução"**
5. Server action calls `runAction("approvals.decide")` → DB update
6. Page revalidates, operator is redirected to `/approvals`
7. Return to dashboard via **"Voltar ao painel"**

### Environment note

`npm run build` and `npm run check:no-explicit-any` fail due to missing `next` and `typescript` dependencies (expected — Jules handles environment repair). No `any` was introduced in new/changed code.

    Original task context:
    UX-NAV-03 UX/Full Stack Flow. Stack-based vertical product-slice task generated after governor review showed too little frontend/persistence impact.
