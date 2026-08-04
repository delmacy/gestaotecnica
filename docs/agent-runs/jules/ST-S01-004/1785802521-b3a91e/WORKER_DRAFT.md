# OpenCode Worker Draft

        Draft branch: `opencode-worker/st-s01-004-1785801438-6feb01-jules-fallback`
        Preserved patch: `docs/agent-runs/jules/ST-S01-004/1785802521-b3a91e/WORKER_PARTIAL.patch` if present
        Worker model: `unknown`
        Worker raw output: `not recorded`

        Jules role:
        - Treat the worker patch as a draft implementation.
        - Inspect the diff before changing anything.
        - Run focused validation and add only minimal corrections/evidence.
        - Open the PR only after validation is coherent.
        - If the draft is unsafe, out of scope, empty, or impossible to validate, stop with a concise blocker.

        Worker changed files:
        - `src/app/admin/organizations/page.tsx`
- `src/platform/workspaces/system-trading/constants.ts`
- `src/platform/workspaces/system-trading/queries.ts`
- `src/platform/workspaces/system-trading/registration.ts`
- `tests/unit/system-trading-queries.test.ts`
- `tests/unit/system-trading-registration.test.ts`
