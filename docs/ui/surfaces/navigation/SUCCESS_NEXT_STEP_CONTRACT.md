# Success Next-Step Destinations Contract

This document serves as the master contract for the Success Next-Step Destinations within the System Builder platform's navigation architecture, fulfilling task UX-NAV-02-011. It defines the route contract, data contract, role/scope rules, states, and acceptance gates prior to implementation.

## Overview

The Success Next-Step Destinations model orchestrates what happens immediately after a user successfully completes a primary action or workflow (e.g., submitting a form, generating an analysis, updating a record). It ensures the user is guided to the most logical subsequent operational context, maximizing flow and minimizing friction.

- **Objective:** Define a consistent framework for determining where a user lands after a successful operation, eliminating ambiguous "success but now what?" dead ends.
- **Language:** User-facing terminology is strictly commercial and product-oriented (e.g., "Proceeding to Capability Dashboard", "Analysis Ready - View Results"), avoiding internal implementation jargon like "Redirecting to /list".

## User Flow Clarification

This contract explicitly maps the core decision points in the success transition journey:

1. **Where the user came from:**
   - The user has just successfully completed a transactional workflow (Create, Update, or a specialized process like "Start Analysis") via a Primary Action.

2. **What they do here:**
   - The system intercepts the successful backend response. The user momentarily experiences a transition state (e.g., a success toast or a brief loading overlay).

3. **Where they go next (Next-Step Destinations):**
   - The system dynamically resolves the optimal destination based on the action performed:
     - **Creation:** Routes directly to the newly created entity's detail view to allow immediate refinement or utilization.
     - **Update/Edit:** Retains the user on the current detail view, surfacing a success confirmation.
     - **Specialized Workflow (e.g., Process Mirroring):** Routes to the generated output or next logical phase (e.g., from intake form to the generated process map).
     - **Terminal Action (e.g., Delete):** Routes to the aggregate list or origin context.

4. **How they return:**
   - The new destination context inherently supports standard Return Paths (as defined in the List, Detail, Create, and Edit Return Paths Contract). The user can utilize breadcrumbs or contextual "Back" actions to return to their original starting point or higher-level aggregates.

## Route & Data Contract

- **Next-Step Resolution:** Destinations are determined by examining the `ActionOutcome`, the newly generated `entityId` (if applicable), and the current `WorkspaceContext`.
- **Core Next-Step Outcomes:**
  - `CREATE_ENTITY_SUCCESS` -> Transition to `/builder/[module]/detail/[entityId]`
  - `PROCESS_ANALYSIS_SUCCESS` -> Transition to `/builder/[module]/results/[jobId]`
  - `UPDATE_ENTITY_SUCCESS` -> Remain at `/builder/[module]/detail/[entityId]`, refresh data
  - `DELETE_ENTITY_SUCCESS` -> Transition to `/builder/[module]`

## State Handling

The next-step model must adapt dynamically to the system's operational state to ensure a clear user-facing outcome:

### 1. Empty State
- **Condition:** A user completes an action that populates an empty module.
- **Outcome:** The success transition replaces the empty state illustration with the populated detail view or list view, confirming the system is no longer empty.

### 2. Blocked State
- **Condition:** A user successfully completes an action, but lacks permissions to view the resulting destination (e.g., they can submit a request but not approve it).
- **Outcome:** The system detects the destination permission mismatch. Instead of routing to a forbidden detail view, it routes to a safe fallback (e.g., the user's Dashboard or "My Submissions" list) with a clear commercial toast: "Submission successful. Pending administrator review."

### 3. Demo State
- **Condition:** Operating in a pre-configured showcase environment (`environmentMode: 'demo'`).
- **Outcome:** Simulated successful actions route to pre-canned "success" destination views to demonstrate the workflow without persisting data. For destructive or blocked actions, the system intercepts the transition and displays a "Workflow completed (Demo Simulation)" notification without changing context.

### 4. Synthetic Data State
- **Condition:** Environment utilizes mocked data (`environmentMode: 'synthetic'`).
- **Outcome:** Success routing functions identically to the Real-Data State, utilizing generated mock IDs to transition to synthetic detail views. The amber "Synthetic Mode" indicator remains.

### 5. Real-Data State
- **Condition:** Connected to a live, persistent backend.
- **Outcome:** The system waits for strict database confirmation (e.g., a 200/201 response with the new ID) before initiating the route transition, preventing premature navigation to non-existent resources.

## Role/Scope Rules

- **Platform vs. Workspace Alignment:** Success destinations strictly obey the active scope. A successful action within a specific tenant workspace (`/builder`) must route to a destination within that exact same workspace.
- **Cross-Scope Prevention:** The resolution logic prevents a success action from accidentally routing a user to a global `/admin` scope or a different tenant's context, maintaining strict data isolation.

## Acceptance Gates and Test Expectations

Before implementation is considered complete, the following validation evidence must be presented:

- **Destination Verification:** Automated tests must confirm that successful creation yields a transition to the correct detail view using the returned ID.
- **Blocked Destination Handling:** Tests must assert that if a user lacks access to the next logical step, they are routed to a safe fallback with appropriate commercial messaging, not a 403 error page.
- **Demo/Synthetic Consistency:** Tests must validate that simulated successes in demo mode route cleanly without attempting genuine database mutations.
