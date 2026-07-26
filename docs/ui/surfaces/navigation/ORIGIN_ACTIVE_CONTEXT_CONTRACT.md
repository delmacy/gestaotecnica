# Origin and Active Context Model Contract

This document serves as the master contract for the Origin and Active Context Model within the System Builder platform's navigation architecture, fulfilling task UX-NAV-02-001. It defines the route contract, data contract, role/scope rules, states, and acceptance gates prior to implementation.

## Overview

The Origin and Active Context Model tracks the user's journey through the System Builder application. It governs how the application determines the user's operational context, where they initiated an action, how deep they are into a workflow, and safely returns them to their appropriate origin point upon completion, cancellation, or error.

- **Objective:** Ensure the application always maintains context of "where the user is" and "where they came from" to avoid broken back-navigation, lost state during multi-step processes, and dead-ends.
- **Language:** User-facing terminology is strictly commercial and product-oriented (e.g., "Return to Operations", "Back to Intake", "Resume Analysis").

## User Flow Clarification

This contract explicitly maps the origin and context decision points in the user journey:

1. **Where the user came from:**
   - The "origin" is the referring route or contextual state before a user initiates an action or enters a deep view. It must be reliably captured (e.g., via URL state `?origin=/builder/operations`, session storage, or breadcrumb traversal logic) so the system knows where to return the user.
   - External deep links have a `null` origin but rely on the root `WorkspaceContext` to resolve their location.

2. **What they do here:**
   - The user executes tasks within the "active context". This context dictates the available tools, the scoped data (e.g., within a specific Capability), and the active navigation items (Sidebar highlighting, Breadcrumb construction).
   - The active context must be resilient to page reloads.

3. **Where they go next:**
   - Forward navigation preserves the current active context as the new origin. Multi-step workflows (like wizards) maintain a continuous internal context, ensuring the entire flow is treated as a single contextual journey until resolution.

4. **How they return:**
   - "Return Paths" are explicitly derived from the tracked origin, not blindly relying on the browser's `history.back()` which is brittle. Completing an action routes the user cleanly to their logical origin. Canceling an action aborts the active context and restores the origin.

## Route & Data Contract

- **Context Preservation:** The `WorkspaceContext` (and optionally URL search params like `?returnTo=`) form the backbone of the active context.
- **Origin Contract:**
  - When transitioning from a list view to a detail/edit view, the referring path must be accessible to the detail view to render a contextual "Back" or "Cancel" action.

## State Handling

The active context model adapts dynamically to the system's operational state to ensure a clear user-facing outcome:

### 1. Empty State
- **Condition:** Navigating to a module with no existing records.
- **Outcome:** The active context is established, but the "Return Path" from a creation flow inside an empty state should land the user on the newly populated list view or the created entity's detail view, replacing the empty context.

### 2. Blocked State
- **Condition:** The user lacks the required role or license to access the requested context.
- **Outcome:** The system intercepts the transition before establishing the active context. It renders a polite access-denied view within the *origin* context or redirects to a safe fallback (e.g., `/builder/dashboard`) with a contextual error toast.

### 3. Demo State
- **Condition:** Operating in a pre-configured showcase environment (`environmentMode: 'demo'`).
- **Outcome:** The active context visually reflects the demo environment (e.g., a "Demo Mode" badge). Return paths for destructive actions (which are intercepted) keep the user safely in their current context.

### 4. Synthetic Data State
- **Condition:** Environment utilizes mocked data (`data_source_mode: 'synthetic'`).
- **Outcome:** The active context operates identically to the Real-Data state, but visual indicators (amber "Synthetic Mode" badge) persist across all origin and return navigations.

### 5. Real-Data State
- **Condition:** Connected to a live, persistent backend.
- **Outcome:** Origin tracking and active context resolution utilize real database IDs and workspace configurations. Return paths trigger fresh data fetches to ensure the destination reflects the latest state.

## Role/Scope Rules

- **Platform vs. Workspace Context:** The active context strictly enforces the boundary between `/builder` (Workspace) and `/admin` (Platform). An action originating in a workspace must return to that workspace; cross-scope return paths are strictly prohibited to prevent data leakage or authorization bypass.
- **Contextual Integrity:** If a user's role changes during an active session, transitioning to a new active context validates the new permissions. If they lose access, the system forces a return to a safe origin.

## Acceptance Gates and Test Expectations

Before implementation is considered complete, the following validation evidence must be presented:

- **Origin Preservation Verification:** Tests or evidence showing that navigating deep into a workflow and executing a "Return" or "Cancel" action routes the user to the correct, predictable origin path, not just a blind `history.back()`.
- **Active Context Resilience:** Verification that refreshing the page mid-workflow within the active context preserves the context and allows the user to continue or back out correctly.
- **State-Aware Outcomes:** Validation that the context behaves correctly under Empty, Blocked, Demo, and Synthetic states (as defined above).
- **Responsive Validation:** Ensure that context-aware UI elements (like breadcrumbs or "Return" buttons) adapt correctly on mobile viewports.
