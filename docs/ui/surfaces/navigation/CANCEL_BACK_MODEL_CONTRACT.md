# Cancel, Back, and Discard Behavior Contract

This document serves as the master contract for the Cancel, Back, and Discard behaviors within the System Builder platform's navigation architecture, fulfilling task UX-NAV-02-016. It defines the route contract, data contract, role/scope rules, states, and acceptance gates prior to implementation.

## Overview

The Cancel, Back, and Discard behaviors are crucial secondary actions that provide users with safe, predictable escape hatches when navigating workflows. This contract defines how the system handles user initiated cancellations or backward navigation, preventing data loss without intention, avoiding disorienting navigation jumps, and ensuring the user is returned to the correct, logical origin.

- **Objective:** Establish standard routing and data-handling logic for when a user aborts an action (Cancel), navigates to a previous view (Back), or abandons unsaved changes (Discard).
- **Language:** User-facing terminology is strictly commercial and product-oriented. References are to "Discard Configuration", "Return to Portfolio", or "Cancel Update", avoiding internal jargon like "Go to previous route" or "Clear form state".

## User Flow Clarification

This contract maps the critical decision points for secondary navigation behaviors:

1. **Where the user came from:**
   - The user's origin must be tracked securely (e.g., referer context, application state breadcrumbs) to ensure a "Back" or "Cancel" action returns them to their actual starting point, not just a hardcoded default (unless accessed via a deep link).

2. **What they do here:**
   - **Cancel:** The user explicitly aborts a localized action (e.g., a modal or form) before final submission.
   - **Back:** The user navigates up the structural hierarchy or to the previous sequential step in a linear flow.
   - **Discard:** The user attempts to leave a view containing unsaved, dirty state. The system intervenes to confirm intent.

3. **Where they go next:**
   - **Cancel / Back:** Routes back to the immediate parent context or the specific origin view (e.g., canceling a "Create Capability" form returns to the "Capability Portfolio" list).
   - **Discard:** If confirmed, routes back to the origin; if declined, retains the user in the current context with state intact.

4. **How they return:**
   - These actions *are* the mechanism of returning. The system relies on the Origin and Active Context Model to ensure the destination of these actions is historically and hierarchically accurate.

## Route & Data Contract

- **Dirty State Detection:** Any view allowing data mutation (Create/Edit) must track internal "dirty" state.
- **Intervention (The Discard Gate):** If dirty state is `true`, any attempt to route away (via Back, Cancel, Breadcrumbs, or Sidebar) must trigger a system-level intervention (e.g., a modal: "Unsaved Changes: Discard or Continue Editing?").
- **Resolution:**
  - `Discard Confirmed`: State is cleared. Routing proceeds to the origin.
  - `Cancel Discard`: Routing is aborted. State is preserved.

## Role & Scope Rules

Cancel, Back, and Discard behaviors operate strictly within the bounds of the Origin and Active Context Model:
- **Platform Scope:** Returning from a platform-level administration view (e.g., Global Configurations) via Back/Cancel will return the user to the platform aggregate, preventing cross-scope bleed into a workspace context.
- **Workspace Scope:** Within a tenant workspace, all escape hatches resolve strictly to workspace-specific aggregations or dashboards.
- **Role Permissions:** These secondary navigation mechanisms are universally accessible (they do not require specialized roles to invoke), as they represent non-destructive escape paths. However, if a user's role is demoted while a form is "dirty", they are still safely returned to their origin view.

## State Taxonomy Outcomes

Secondary navigation must respond predictably across the various platform context modes:

- **Real-Data State:** Standard behavior. Interacts with true origin state and live unsaved modifications.
- **Empty State:** If a user navigates "Back" into a list that currently has no data, they are presented with the commercially framed Empty State (e.g., "Ready to build your first capability?").
- **Blocked State:** In states where primary actions are blocked due to missing permissions, the Cancel and Back actions remain strictly active, ensuring the user can escape the locked view and return to an aggregate context.
- **Demo State:** Navigation operates normally, allowing users to move fluidly between demo read-only flows and forms without destructive consequence. Intervening "Discard" gates still appear, providing a realistic product experience, though no data is genuinely saved.
- **Synthetic State:** Back and Cancel actions correctly route back to the synthetically populated origin. The Discard intervention triggers properly on mock forms, verifying the state machine.

## Acceptance Gates

- [ ] Implementation explicitly defines the user journey (origin, action, destination, return mechanism).
- [ ] Dirty state intervention (Discard) functions correctly across empty, blocked, demo, synthetic, and real-data contexts.
- [ ] Distinct user-facing outcomes for demo/synthetic states and explicit role/scope rules are implemented and validated.
- [ ] User-facing language uses commercial/product-oriented terms.
- [ ] Interactions remain responsive and accessible on desktop and mobile.
- [ ] Validation evidence (tests or documented flows) confirms behavior.
