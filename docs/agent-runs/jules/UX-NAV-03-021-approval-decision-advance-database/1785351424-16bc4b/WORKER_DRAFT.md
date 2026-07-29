# OpenCode Worker Draft

        Draft branch: `opencode-worker/ux-nav-03-021-approval-decision-advance-database-1785351170-a8677c`
        Worker model: `opencode/deepseek-v4-flash-free`
        Worker raw output: `/opt/delmacy/system-builder-orchestrator/runs/opencode-worker/UX-NAV-03-021-approval-decision-advance-database/opencode-deepseek-v4-flash-free-raw.jsonl`

        Jules role:
        - Treat the worker patch as a draft implementation.
        - Inspect the diff before changing anything.
        - Run focused validation and add only minimal corrections/evidence.
        - Open the PR only after validation is coherent.
        - If the draft is unsafe, out of scope, empty, or impossible to validate, stop with a concise blocker.

        Worker changed files:
        - `drizzle/meta/_journal.json`
- `src/db/index.ts`
- `drizzle/0027_governance_approval_tables.sql`
- `src/db/runtime/schema/governance.ts`
