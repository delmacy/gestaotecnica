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
    Worker raw output: `/opt/delmacy/system-builder-orchestrator/runs/opencode-worker/UX-NAV-03-020-form-submit-to-work-closeout/opencode-deepseek-v4-flash-free-raw.jsonl`

    Worker changed files:
    - `docs/agent-runs/jules/UX-NAV-03-020-form-submit-to-work-closeout/`

    Worker summary:
    Now I have a thorough understanding of the full product slice. Let me create the closeout evidence document.
**Draft diff ready.** Single new file:

`docs/agent-runs/jules/UX-NAV-03-020-form-submit-to-work-closeout/1785346220-fe18f4e/EVIDENCE.md`

The closeout evidence documents the full through-line for the form-submit-to-work product slice:

- **Routes:** `/work-intake`, `/work-items`, `/service-orders` (list+detail) + `POST /api/builder/work-status` (resolution endpoint)
- **Persistence:** `processCandidates`, `work_items`, `service_orders` tables via kernel actions
- **User journey:** Two patterns — client-side resolution (work-intake via `useWorkStatus` hook) and server-side redirect (work-items/service-orders via `redirect()`)
- **Builder navigation:** `/builder` → org → workspace → destination, with return links
- **State distinctions:** All five states (empty, blocked, demo, synthetic, real) produce distinct destinations, messages, and toasts
- **Blocker:** Alpha seed returns `sala-tecnica` slug instead of UUID for `workspace_id`, breaking event-log audit — documented as data seed gap, not code defect
- **`check:no-explicit-any`:** Fails — `typescript` module not installed (environment issue, Jules handles)

    Original task context:
    UX-NAV-03 UX/Full Stack Flow. Stack-based vertical product-slice task generated after governor review showed too little frontend/persistence impact.
