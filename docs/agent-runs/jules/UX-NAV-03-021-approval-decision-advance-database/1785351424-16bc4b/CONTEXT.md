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
    Worker raw output: `/opt/delmacy/system-builder-orchestrator/runs/opencode-worker/UX-NAV-03-021-approval-decision-advance-database/opencode-deepseek-v4-flash-free-raw.jsonl`

    Worker changed files:
    - `drizzle/meta/_journal.json`
- `src/db/index.ts`
- `drizzle/0027_governance_approval_tables.sql`
- `src/db/runtime/schema/governance.ts`

    Worker summary:
    Micro-draft complete. Here is the diff summary for Jules:

**4 files changed:**

| File | Change | Purpose |
|---|---|---|
| `src/db/runtime/schema/governance.ts` | **NEW** (58 lines) | Drizzle schema for `governance` schema with `approval_policies` and `approval_decisions` tables |
| `src/db/index.ts` | +2 lines | Import and register `governanceSchema` in the unified `fullSchema` |
| `drizzle/0027_governance_approval_tables.sql` | **NEW** (42 lines) | PostgreSQL migration: CREATE SCHEMA `governance`, both tables, FK constraints, and indexes |
| `drizzle/meta/_journal.json` | +7 lines | Register migration idx 24 → tag `0027_governance_approval_tables` |

**Product through-line:**
- **Screen:** `/approvals` — operator submits OS for review (`approvals.request`), manager approves/rejects (`approvals.decide`)
- **Persistence path:** `approval_decisions` table now captures the canonical `ApprovalDecision` contract as queryable rows, workspace-scoped, with FK back to `approval_policies`
- **Empty vs real-data:** `getApprovalQueue` and `getApprovalSummary` queries remain unchanged (read from `service_orders`); a follow-up stage will rewire them to read from `approval_decisions` and consume persisted data
- **No `any` types** in new code

**Blocker note:** `npm run check:no-explicit-any` fails because `typescript` module is not installed in the environment. `npm run build` also requires `node_modules` (`next build`). Jules should run `npm install` before validation.

    Original task context:
    UX-NAV-03 UX/Full Stack Flow. Stack-based vertical product-slice task generated after governor review showed too little frontend/persistence impact.
