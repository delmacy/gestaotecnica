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
    - `src/app/approvals/page.tsx`
- `src/modules/approvals/contracts/approval-decision-dto.ts`

    Worker summary:
    Let me examine the key files to understand the current binding state and identify any leftover mock/demo paths.
Now let me check what's imported from the contracts barrel:
Now I have a complete picture. Let me plan the changes.

**Key findings:**
1. The approval flow uses real DB data — no mock fallback in the query/server-action/UI path ✓
2. `page.tsx:42` uses `any` type for summary mapping — violates constraint
3. `approval-decision-dto.ts` defines orphaned DTOs (`ApprovalQueueViewStateSchema` with `"demo"`, `ApprovalQueuePageDTO`, `ApprovalDecisionResultSchema`) — these are unused synthetic/demo fallback concepts that pollute the contract layer

The task objective is to remove any hidden mock/synthetic fallback path and tighten the through-line. Let me clean these up.
No remaining references to the removed types. Let me check the full diff:
Draft complete. Here's the summary:

## Changes Made

### 1. `src/modules/approvals/contracts/approval-decision-dto.ts` — removed orphaned synthetic/demo DTOs

Removed three unused export blocks:
- **`ApprovalDecisionResultSchema` / `ApprovalDecisionResult`** — Zod schema `{ id, status }` never imported anywhere. The domain already has its own `ApprovalDecisionResult` interface in `approval-workflow-domain.ts:21` with the correct shape.
- **`ApprovalQueueViewStateSchema` / `ApprovalQueueViewState`** — contained `"demo"` as a view state. Zero references in `src/`. This represented an unbundled synthetic data path concept.
- **`ApprovalQueuePageDTOSchema` / `ApprovalQueuePageDTO`** — attempted to wrap the page in a `state` envelope. Zero references in `src/`. Never consumed by the actual page or table.

**Why**: These were dead contracts suggesting a synthetic/simulated data path alongside the real DB-driven path. Removing them eliminates the architectural suggestion of a fallback to demo data — the UI can now only consume real persisted data through `getApprovalQueue()` / `getApprovalSummary()`.

### 2. `src/app/approvals/page.tsx:42` — removed `any` type annotation

Changed `summary.map((item: any)` to `summary.map((item)` — the type is inferred from `getApprovalSummary()`'s return type (`{ label: string; value: number }[]`), no explicit annotation needed.

## Through‑line (after change)

**Route**: `/approvals` — Dashboard → "Revisão Técnica" → queue with approve/reject actions → return to dashboard via "Voltar ao painel"

**Persistence**: `service_orders` table (`getApprovalQueue`, `getApprovalSummary` in `queries.ts`)

**Domain**: `resolveApprovalDecision()` in `approval-workflow-domain.ts` validates state invariants

**Contract**: `ApprovalQueueItemSchema`, `ApprovalSummaryItemSchema`, `ApprovalDecisionInputSchema` (live DTOs)

**Use case / API**: Server actions (`approveServiceOrder`, `returnServiceOrderForExecution`) → kernel action `approvals.decide` → DB update + event emission

**UI**: Server-rendered page → `ApprovalQueueTable` component → `ApproveServiceOrderForm` / `ReturnServiceOrderForm` clien

    Original task context:
    UX-NAV-03 UX/Full Stack Flow. Stack-based vertical product-slice task generated after governor review showed too little frontend/persistence impact.
