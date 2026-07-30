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
    Worker raw output: `/opt/delmacy/system-builder-orchestrator/runs/opencode-worker/UX-NAV-03-027-approval-decision-advance-audit-permissions/opencode-deepseek-v4-flash-free-raw.jsonl`

    Worker changed files:
    - `src/modules/approvals/actions.ts`
- `src/modules/approvals/components/ApprovalForms.tsx`

    Worker summary:
    ## Micro-draft complete — 2 files changed

### Changes

**1. `src/modules/approvals/actions.ts`**
- Added `getCurrentUser()` check before each action (`submitServiceOrderForReview`, `approveServiceOrder`, `returnServiceOrderForExecution`) — returns user-facing error if session is missing.
- Returns a typed `ActionReceipt` (`correlationId`, `action`, `serviceOrderId`, `recordedAt`) on success so the UI can display audit evidence.

**2. `src/modules/approvals/components/ApprovalForms.tsx`**
- Defines `FormState` type with optional `receipt` object — no `any` used.
- After success, shows a receipt banner (green for approve, amber for reject) with the first 8 chars of `correlationId` as protocol reference.
- After receipt is shown, the form inputs/button are hidden (one-shot action).
- Error state remains as red banner. Empty/initial state unchanged.

### Through-line

| Layer | Path |
|-------|------|
| **Database** | `workflow.events` (audit trail via kernel action event emission) + `service_orders` (status, `approvedById`, `approvedAt`) |
| **Domain** | `resolveApprovalDecision()` in `approval-workflow-domain.ts` |
| **Contract** | `ActionReceipt` type returned from server actions |
| **API** | Server actions with `getCurrentUser()` authorization gate |
| **UI** | `ApprovalForms.tsx` on `/approvals` route — shows error or receipt after action |
| **Evidence** | `correlationId` truncated as protocol → user can cross-reference in `workflow.events` |

### Route/screen affected
- **Route:** `/approvals` — approval queue page
- **User flow:** User arrives at `/approvals` → sees queue of OS waiting_review → clicks "Aprovar OS" or "Retornar para execucao" → form submits to server action → on success shows green/amber receipt with protocol reference → on error shows red banner
- **Return path:** "Voltar ao painel" link at top of page

### Validation
- `npm run check:no-explicit-any` — blocked (missing `typescript` dependency; Jules handles env repair)
- `npm run build` — blocked (missing node_modules; Jules handles env repair)
- No explicit `any` introduced in either file
- All files in allowed scope (`src/modules/approvals/`)

    Original task context:
    UX-NAV-03 UX/Full Stack Flow. Stack-based vertical product-slice task generated after governor review showed too little frontend/persistence impact.
