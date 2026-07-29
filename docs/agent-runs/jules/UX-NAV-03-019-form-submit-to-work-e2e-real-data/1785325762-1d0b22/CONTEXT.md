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
    Worker raw output: `/opt/delmacy/system-builder-orchestrator/runs/opencode-worker/UX-NAV-03-019-form-submit-to-work-e2e-real-data/opencode-deepseek-v4-flash-free-raw.jsonl`

    Worker changed files:
    - `tests/contracts/resolve-work-status.test.ts`

    Worker summary:
    Draft ready. One file changed:

**`tests/contracts/resolve-work-status.test.ts`** (new) — Real-data journey validation for `resolveWorkStatus`

- 11 tests covering all 5 states (real, demo, synthetic, blocked, empty) plus precedence rules (blocked > demo, blocked > empty)
- Imports the pure function directly (no mocks) with real `WorkspaceContext` / `OriginContext` objects
- Documents the through-line in a header comment: route (`POST /api/builder/work-status` → `/work-intake/<id>`), persistence path (`workId` from `processCandidates`/`work_items`), user journey (fill form → submit → API → navigate → return via `returnPath`)

**Test results:** all 11 pass. No explicit `any` in new code (verified via grep).

**Blocker for full validation:** `npm run check:no-explicit-any` requires `typescript` module not installed in this environment — Jules will need to resolve that or run in a proper build env. The actual file is clean of `any`.

    Original task context:
    UX-NAV-03 UX/Full Stack Flow. Stack-based vertical product-slice task generated after governor review showed too little frontend/persistence impact.
