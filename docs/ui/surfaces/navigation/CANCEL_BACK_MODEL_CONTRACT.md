# Cancel/Back/Discard Behavior Contract

This document serves as the master contract for Cancel, Back, and Discard Behaviors within the System Builder platform's navigation architecture, fulfilling task UX-NAV-02-016. It defines the route contract, data contract, role/scope rules, states, and acceptance gates prior to implementation.

## Overview

The Cancel/Back/Discard behavior model orchestrates what happens when a user intentionally aborts a workflow, dismisses a transient state, or navigates backward from a detailed view. It ensures safe exit paths, prevents accidental data loss, and returns the user to the most logical prior context.

- **Objective:** Define a consistent framework for handling user cancellations, backward navigation, and discarding of unsaved work.
- **Language:** User-facing terminology is commercial and clear (e.g., "Discard unsaved changes?", "Return to Dashboard"), avoiding technical jargon.

## User Flow Clarification

This contract maps the core decision points in the cancellation/backward journey:

1. **Where the user came from:**
   - The user is currently in a transactional workflow (Create, Edit), a deep detail view, or a transient state (modal, drawer) with unsaved changes or active context.

2. **What they do here:**
   - The user triggers a "Cancel", "Back", or "Close" action (via UI button, browser back, or breadcrumb).
   - If unsaved changes exist (dirty state), the system intercepts the action to present a confirmation dialogue (Discard changes?).

3. **Where they go next (Return Destinations):**
   - The system resolves the destination based on the active context and origin:
     - **Cancel Creation:** Routes back to the aggregate list or the origin context.
     - **Cancel Edit:** Reverts to the clean detail view of the current entity.
     - **Back from Detail:** Routes up the hierarchy to the parent list or previous search results.
     - **Close Modal/Drawer:** Dismisses the transient overlay, returning focus to the underlying active page.

4. **How they return:**
   - The transition leverages the standard Return Paths contract, utilizing historical context or structural hierarchy to resolve the target destination.

## Route & Data Contract

- **Resolution:** Cancel/Back destinations are determined by evaluating the `OriginContext`, the `dirtyState` of the current view, and the structural `hierarchy` of the module.
- **Core Cancel/Back Outcomes:**
  - `CANCEL_CREATE` -> Transition to `/builder/[module]` (or specific origin).
  - `CANCEL_EDIT` -> Transition to `/builder/[module]/detail/[entityId]`.
  - `BACK_FROM_DETAIL` -> Transition to `/builder/[module]` (or preserved list state).
  - `DISCARD_CONFIRMED` -> Proceed with the requested backward navigation.
  - `DISCARD_ABORTED` -> Remain in the current dirty view.

## State Handling

The Cancel/Back model adapts dynamically to the system's state:

### 1. Empty State
- **Condition:** User cancels creation in an empty module.
- **Outcome:** Returns to the module's empty state view.

### 2. Blocked State
- **Condition:** User attempts to return to a view they no longer have permission to access (e.g., permissions revoked during session).
- **Outcome:** Routes to a safe fallback (e.g., Dashboard) with a commercial notification: "Access to previous view restricted."

### 3. Demo State
- **Condition:** Operating in `environmentMode: 'demo'`.
- **Outcome:** Cancel/Back behaviors function smoothly. Since demo data is not persisted, "discard" prompts may be bypassed or simulated to maintain flow.

### 4. Synthetic Data State
- **Condition:** Environment uses `environmentMode: 'synthetic'`.
- **Outcome:** Behaviors are identical to the Real-Data State, including dirty state tracking on mock forms.

### 5. Real-Data State
- **Condition:** Connected to live backend.
- **Outcome:** Strict enforcement of dirty state tracking. Unsaved changes always trigger a discard confirmation before allowing the transition.

## Role/Scope Rules

- **Scope Adherence:** Cancel/Back navigation must not cross tenant boundaries or unexpectedly elevate scope. Canceling an action in `/builder` must return to a `/builder` context.

## Acceptance Gates and Test Expectations

- **Dirty State Interception:** Tests must confirm that attempting to navigate away from a modified form triggers a discard confirmation.
- **Correct Routing:** Tests must validate that `CANCEL_EDIT` returns to the detail view and `CANCEL_CREATE` returns to the list view.
- **Hierarchy Preservation:** Tests must assert that "Back" navigation correctly utilizes the origin context or hierarchy.
