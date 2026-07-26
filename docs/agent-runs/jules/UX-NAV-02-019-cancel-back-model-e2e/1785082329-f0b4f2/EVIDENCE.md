# Validation Evidence: Cancel, Back, and Discard Behavior

## Constraints & Environment
- **Base SHA**: 84ec16837094361d6dcde0932d533d8b4d94af77
- **Node.js Version**: v24.18.0

## User Journey Context

The tests and implementation correctly address the core questions around user navigation during secondary escape actions:

*   **Where the user came from:** The user initiates actions from varying origin contexts (e.g., standard workflow views like the System Builder portfolio). The origin path is explicitly captured in the route context, allowing the system to reliably know the true starting point rather than relying on browser history alone.
*   **What they do here:** The user performs secondary navigation actions—"Cancel", "Back", or "Discard". These actions represent explicit decisions to abort a workflow step, return to a previous aggregate view, or intentionally abandon unsaved modifications on a configuration form.
*   **Where they go next:** Upon executing these actions, the user is safely routed back to their legitimate origin context (e.g., the Portfolio dashboard) or retained on the current view if an intervention (like the Discard warning) is cancelled. The destination is dynamically resolved via backend contracts based on the specific action and current state.
*   **How they return:** The return mechanism is handled intrinsically by the Cancel/Back routing logic. By utilizing the preserved origin context, the application executes a precise navigation jump to the designated return path, ensuring a predictable and continuous user experience without breaking hierarchical or scoped boundaries.

## Journey Validation & State Handling

The Playwright end-to-end tests rigorously confirm the expected product behaviors across different operational states:

1.  **Seamless Escape (Cancel):**
    When a user chooses to abort an action where no destructive consequences exist (no unsaved changes), the system immediately resolves the routing destination and allows execution, successfully returning them to their origin (e.g., `/builder/portfolio`).

2.  **Dirty State Intervention (Discard):**
    If a user attempts to leave a view where unsaved configuration changes exist (dirty state), the system intercepts the navigation. A commercially framed "Discard Intervention Gate" is presented, asking the user to confirm their intent.
    *   **Confirmation:** Acknowledging the discard safely routes the user back to the origin, clearing the unsaved state.
    *   **Cancellation:** Choosing to continue editing aborts the navigation, keeping the user actively engaged on their current configuration form.

3.  **Role & Status Handling (Blocked State):**
    Even when the primary functionality of a view is blocked (e.g., due to permission limitations or capability locks), the secondary escape mechanisms (Back/Cancel) remain fully functional. The system correctly identifies the 'blocked' status while still permitting the user to navigate away and return to an active context.

## Test Results

The e2e journey test suite (`tests/e2e/ux-nav-02/ux-nav-02-019-cancel-back-model.spec.ts`) was executed successfully against a locally running development server. All scenarios passed, verifying the frontend routing implementation accurately consumes and respects the backend resolution contracts.

**Command Executed:**
`npx playwright test tests/e2e/ux-nav-02/ux-nav-02-019-cancel-back-model.spec.ts`

**Outcome:**
`4 passed (24.1s)`
