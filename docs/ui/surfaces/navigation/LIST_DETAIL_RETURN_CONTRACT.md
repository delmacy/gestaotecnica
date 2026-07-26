# List, Detail, Create, and Edit Return Paths Contract

This document serves as the master contract for the Return Paths of List, Detail, Create, and Edit views within the System Builder platform's navigation architecture, fulfilling task UX-NAV-02-006. It defines the route contract, data contract, role/scope rules, states, and acceptance gates prior to implementation.

## Overview

The System Builder platform requires a predictable navigation model for standard CRUD (Create, Read, Update, Delete) flows. This contract defines how the system explicitly routes users back to their logical origin upon completing, cancelling, or erroring out of List, Detail, Create, or Edit views.

- **Objective:** Establish standard routing logic for entity manipulation views to prevent "dead-ends", ensure users always return to a logical context, and present clear, commercially-oriented user feedback (e.g., "Return to Portfolio" instead of "Back to /list").
- **Language:** User-facing terminology is strictly commercial and product-oriented. References are to "Initiate Intake", "Save Configuration", or "Return to Registry", avoiding internal jargon like "Submit Form" or "Go to Table".

## User Flow Clarification

This contract maps the critical decision points for navigation return paths:

1. **Where the user came from:**
   - The user's origin must be determinable. They may enter a "Create" flow from an empty state list, a populated list, or a related detail view. They may enter an "Edit" flow exclusively from a detail view.
   - Deep links without an active session origin default to their respective top-level module lists.

2. **What they do here:**
   - **Create:** The user inputs new entity data. The active context shifts to an isolated creation state.
   - **Edit:** The user modifies existing entity data. The active context is bound to the specific entity's ID.
   - **Detail:** The user views the read-only or operational summary of an entity.
   - **List:** The user views an aggregate of entities (or an empty state).

3. **Where they go next:**
   - Successful actions dictate forward navigation. Successful creation transitions the user to the newly created entity's *Detail* view. Successful editing keeps the user on the *Detail* view.

4. **How they return:**
   - "Return Paths" (explicit Back/Cancel buttons or automatic post-action routing) rely on the tracked origin and active context:
     - **Cancel Create:** Returns to the origin (the List view or the Empty State view).
     - **Cancel Edit:** Returns to the Detail view of the specific entity.
     - **Delete Entity:** Returns to the List view, with a success toast.
     - **Back from Detail:** Returns to the List view, maintaining any previous list filters if possible via the `WorkspaceContext`.

## Route & Data Contract

- **Return Path Resolution:** The return path logic relies on the existing `WorkspaceContext` and `OriginContext` to dictate safe routing.
- **Action Outcomes:**
  - `CREATE_SUCCESS` -> `/builder/[module]/detail/[new-id]`
  - `CREATE_CANCEL` -> `OriginPath` (fallback to `/builder/[module]`)
  - `EDIT_SUCCESS` -> `/builder/[module]/detail/[id]` (Remains on detail view, refreshes data)
  - `EDIT_CANCEL` -> `/builder/[module]/detail/[id]`
  - `DELETE_SUCCESS` -> `/builder/[module]` (List view)
  - `DETAIL_BACK` -> `OriginPath` (fallback to `/builder/[module]`)

## State Handling

The return path model adapts dynamically to the system's operational state to ensure a clear user-facing outcome:

### 1. Empty State
- **Condition:** Returning to a list that has no records (e.g., cancelling creation on an empty module).
- **Outcome:** The user returns cleanly to the Empty State view. The active context accurately reflects the lack of data, offering the "Primary Action" to create a new entity.

### 2. Blocked State
- **Condition:** The user lacks the required role or license to access the return destination, or the return path points to a disabled module.
- **Outcome:** The system intercepts the transition. It renders a polite access-denied view within the *origin* context or redirects to a safe fallback (e.g., `/builder/dashboard`) with a contextual error toast.

### 3. Demo State
- **Condition:** Operating in a pre-configured showcase environment (`environmentMode: 'demo'`).
- **Outcome:** Non-destructive actions (cancelling) return normally. Destructive actions (deleting) or mutations (creating) are intercepted and prevented. The user is kept safely in their current context with a "Restricted in Demo Mode" notification.

### 4. Synthetic Data State
- **Condition:** Environment utilizes mocked data (`environmentMode: 'synthetic'`).
- **Outcome:** The active context operates identically to the Real-Data state. The "Synthetic Mode" badge persists. Return navigations behave normally against the synthetic data store.

### 5. Real-Data State
- **Condition:** Connected to a live, persistent backend.
- **Outcome:** Return paths trigger fresh data fetches to ensure the destination (List or Detail view) reflects the latest state. Success or failure is confirmed against the database.

## Role/Scope Rules

- **Platform vs. Workspace Context:** The active context strictly enforces the boundary between `/builder` (Workspace) and `/admin` (Platform). An action originating in a workspace must return to that workspace; cross-scope return paths (e.g., returning from a workspace edit to a platform list) are strictly prohibited to prevent data leakage or authorization bypass.
- **Contextual Integrity:** If a user loses access permissions to an entity while editing it, the subsequent return path (or forced navigation) must direct them to a safe origin (the List view or Dashboard) and clear the unauthorized active context.

## Acceptance Gates and Test Expectations

Before implementation is considered complete, the following validation evidence must be presented:

- **CRUD Return Verification:** Tests or evidence showing that Create, Edit, Delete, and Cancel actions consistently route the user to the correct, predictable destinations as defined in the Action Outcomes.
- **State-Aware Outcomes:** Validation that the return logic behaves correctly under Empty, Blocked, Demo, and Synthetic states (as defined above).
- **Scope Boundary Enforcement:** Verification that return paths do not violate the Platform vs. Workspace scope boundaries.
- **Language Alignment:** Verification that UI elements and toast notifications utilize commercial, product-oriented language.
