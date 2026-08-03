# UX-NAV-02-020 Cancel/Back/Discard Model Frontend Closeout Evidence

## Setup & Base SHA
- **Base SHA:** 46bc264a9f86577f6aac0edd5622c32c182f2384
- **Node Version:**
```
$ node --version
v24.18.0
```

## Journey Validation (Commercial/Product Questions)

- **Where the user came from:**
The user navigates from the main Builder dashboard or another list view into a targeted action context, such as a creation form or an edit modal.

- **What they do here:**
The user is presented with a context where they can input information, review existing data, or modify parameters. They may choose to cancel out of the form cleanly, hit a block (e.g., lack of permissions or missing dependencies), or attempt to abandon an action where they have unsaved changes (dirty state).

- **Where they go next:**
Based on their action:
  - Clean cancel or back action routes them to their intended exit destination (e.g., returning to `/builder/portfolio` or the previous origin context).
  - A discard action with unsaved changes prompts a mandatory intervention gate. They must explicitly confirm the discard to proceed to the exit destination, or cancel the discard to remain in the current context and preserve their work.
  - If they are in a blocked state, the navigation resolves the blocked outcome, preventing progression until conditions are met.

- **How they return:**
They return seamlessly via the resolved destination routes defined by the `resolveCancelBack` contract. If an intervention gate is triggered and accepted, the routing engine executes the navigation to the appropriate fallback or origin URL automatically.

## User-Facing Outcomes by State Taxonomy

- **Clean State (Real Data / Synthetic):**
When no unsaved edits have been made, triggering `CANCEL` results in an immediate route to the exit destination (e.g., returning to `/builder/portfolio`) without prompting the user.
- **Dirty State:**
When the user has unsaved edits, triggering `DISCARD` brings up a clear intervention prompt ("Discard Intervention Gate"). The user is forced to choose "Yes" (confirm discard and route away) or "No" (cancel discard and remain on the page).
- **Blocked State:**
When a user attempts to navigate backward or cancel within a flow that is programmatically restricted (e.g., permissions check failed), the response explicitly states the `blocked` status, halting the action and preventing accidental data loss or unauthorized flow progression.

## E2E Test Evidence

```bash
$ npx playwright test tests/e2e/ux-nav-02/ux-nav-02-019-cancel-back-model.spec.ts

Running 4 tests using 2 workers

  ✓  1 [chromium] › tests/e2e/ux-nav-02/ux-nav-02-019-cancel-back-model.spec.ts:10:7 › UX-NAV-02-019 Cancel/Back/Discard Model Frontend Contract › CANCEL action resolves gracefully without intervention and allows routing execution (4.6s)
  ✓  2 [chromium] › tests/e2e/ux-nav-02/ux-nav-02-019-cancel-back-model.spec.ts:24:7 › UX-NAV-02-019 Cancel/Back/Discard Model Frontend Contract › DISCARD action with dirty state triggers intervention gate and processes confirmation properly (4.9s)
  ✓  3 [chromium] › tests/e2e/ux-nav-02/ux-nav-02-019-cancel-back-model.spec.ts:37:7 › UX-NAV-02-019 Cancel/Back/Discard Model Frontend Contract › DISCARD action cancellation leaves user on same page (4.1s)
  ✓  4 [chromium] › tests/e2e/ux-nav-02/ux-nav-02-019-cancel-back-model.spec.ts:50:7 › UX-NAV-02-019 Cancel/Back/Discard Model Frontend Contract › BACK action in blocked state handles resolution properly (3.8s)

  4 passed (18.3s)
```

## Readiness
The frontend journey and backend contract for Cancel/Back/Discard behaviors have been thoroughly validated via E2E testing.
The system accurately handles clean cancellations, dirty state intervention gates, and blocked routing resolutions.
The feature is **terminal clean** and ready for the next serial slice.
