# Empty and Unavailable State Taxonomy Contract

This document defines the taxonomy, route contract, data contract, role/scope rules, and behavioral states for "Empty" and "Unavailable" scenarios within the System Builder platform. It fulfills task UX-NAV-01-036.

## Taxonomy and State Definitions

The platform recognizes distinct states when content cannot be fully presented, each demanding specific user-facing outcomes:

### 1. Empty State
- **Definition:** The user has access to the module/view, the system is operational, but no data instances have been created or assigned yet.
- **Where the user came from:** Global navigation (Sidebar, Breadcrumbs) or direct link to a valid, accessible module.
- **What they do here:** Understand the value proposition of the module and take the primary action to populate it.
- **Where they go next:** To a creation wizard, a form, or an integration setup to create the first instance.
- **How they return:** After completing the creation step, they are routed back to the now-populated view.
- **User-Facing Outcome:** A prominent commercial call-to-action (CTA). Example: "Streamline your operations. Define your first business capability." (Not "Error: Array length 0").

### 2. Blocked / Unauthorized State (Unavailable)
- **Definition:** The user is authenticated but lacks the necessary role or scope (e.g., trying to access Platform Admin from a Workspace context, or lacking specific RBAC permissions).
- **Where the user came from:** Direct link, bookmark, or an expired link to a previously accessible resource.
- **What they do here:** Learn why access is restricted without leaking sensitive system details.
- **Where they go next:** Request access, switch workspaces, or return to a known safe state (Dashboard).
- **How they return:** Via Breadcrumb "Back to Dashboard" or Sidebar navigation.
- **User-Facing Outcome:** A clear explanation based on scope. Example: "This configuration requires Workspace Admin privileges. Contact your administrator to request access."

### 3. Demo / Synthetic State
- **Definition:** The environment is running in a controlled 'demo' or 'synthetic' mode (`WorkspaceContext.environmentMode === 'demo' | 'synthetic'`).
- **Where the user came from:** Guided tour, sandbox sign-up, or demo environment entry point.
- **What they do here:** Explore pre-populated synthetic data to evaluate platform capabilities safely. Actions may be simulated or restricted.
- **Where they go next:** Upgrade to a real workspace or continue exploring other demo modules.
- **How they return:** Standard platform navigation remains intact.
- **User-Facing Outcome:** Clear visual indicators (e.g., banners or badges) denoting the environment mode. Interactions explicitly state when data is simulated. Example: "You are exploring the Demo environment. Changes made here will not affect your production workspace."

### 4. Real-Data State (The Baseline)
- **Definition:** Standard operational mode (`environmentMode === 'real'`) with populated data.
- **User-Facing Outcome:** Displays real business data. No demo banners or empty state CTAs.

## Route and Data Contracts

### Data Contract: Determining State
The frontend relies entirely on backend contracts and the `WorkspaceContext` to determine the current state, preventing hardcoded mock data.

1.  **Environment Mode:**
    - Read from `WorkspaceContext.environmentMode` ('real' | 'demo' | 'synthetic').
    - Defines if the view should apply demo/synthetic styling or restrictions.

2.  **Navigation and Access (Blocked State):**
    - The `resolveNavigationInventory` contract dictates which modules are enabled based on `WorkspaceContext.enabledModules`.
    - If a user navigates to a route not returned by the inventory for their current scope, they are in a Blocked/Unavailable state.

3.  **Data Availability (Empty State):**
    - Specific backend data fetchers (e.g., `getCapabilities`, `getWorkflows`) determine if data exists.
    - If the fetch returns a successful but empty result (e.g., `[]`), the UI must render the Empty State CTA.

### Route Contract: State Transitions

-   `/builder/[module]`: The standard route pattern.
-   **Empty Transition:** If `/builder/capabilities` is empty, the primary action (e.g., "Create Capability") routes the user to `/builder/capabilities/new` or opens a creation modal. Upon success, the user returns to `/builder/capabilities`, which now displays the Real-Data State.
-   **Blocked Transition:** If a user accesses a blocked route, they are presented with a "Not Found / Unauthorized" view that provides a safe exit path (e.g., a link back to `/builder`).

## Role and Scope Rules

-   **Platform vs. Workspace Context:** As defined in `PLATFORM_VS_WORKSPACE_SCOPE_CONTRACT.md`, the scope dictates the context. Empty states must reflect the scope (e.g., a Platform empty state prompts global setup; a Workspace empty state prompts tenant-specific data entry).
-   **Permissions:** Empty State CTAs should only be visible if the user has the permission to perform the action. If a module is empty and the user has read-only access, the message should explain the module's purpose without a creation CTA (e.g., "No capabilities have been defined for this workspace yet.").

## Responsive and Accessible Design

-   Empty and Unavailable state views must be responsive, ensuring illustrations, text, and CTAs are centered and legible on mobile and desktop viewports.
-   CTAs must use semantically correct HTML (e.g., `<button>` or `<a>`) and include appropriate `aria-labels`.

## Acceptance Gates

To consider an implementation of this contract complete, the following gates must be met:

1.  **Journey Validation:** Tests confirm the distinct user-facing outcomes for Empty, Blocked, Demo, and Real-data states.
2.  **Language Gate:** Reviews confirm that all messaging is commercial and product-oriented. No generic technical errors (e.g., "404 Not Found" or "Array length 0") are exposed to the user.
3.  **Contract Dependency:** Implementations must strictly consume the backend contracts (`WorkspaceContext`, `resolveNavigationInventory`) to derive states, avoiding frontend mock state generation.
