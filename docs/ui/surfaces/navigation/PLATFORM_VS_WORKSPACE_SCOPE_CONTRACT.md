# Platform versus Workspace Scope Clarity Contract

This document acts as the master contract clarifying the distinction between Platform-level boundaries and Workspace-level scopes within the navigation and execution areas of the System Builder platform, fulfilling task UX-NAV-01-021.

## Overview
The System Builder operates with dual planes: Platform vs Workspace. This document details how this is surfaced via navigation, state transitions, constraints, and data exposure in the UI. User-facing language is commercial and product-oriented.

## Definitions
- **Platform Scope**: The foundational layer, agnostic to business context. Defines available capabilities, global integrations, user directories, and underlying metamodels.
- **Workspace Scope**: The runtime tenant where business rules, operational modules, configurations, and instances exist. Usually bound by `workspaceId`.

## Navigation Experience
1. **Where the user came from**:
    - Platform Admins and Users log in (`/auth/login`). Upon login, the system evaluates their access scope. Users automatically land in a Workspace (e.g. `/builder`).
    - Admins who navigate into Platform configurations (e.g. `/admin`) operate completely independently from Workspace modules (`/builder`).
2. **What they do here**:
    - *Platform Scope*: Admins manage global metadata, user directories, capabilities registries, database setups.
    - *Workspace Scope*: Users execute processes, manage tasks, observe operational dashboards within a specific domain boundary.
3. **Where they go next**:
    - Users operate solely inside their workspace scope unless switching workspaces.
    - Admins transition out of workspaces to `/admin` to modify global definitions that apply universally.
4. **How they return**:
    - Clearly defined cross-scope navigation paths. A workspace switcher explicitly alters the state to return users to a specific workspace.
    - Breadcrumbs clearly indicate the active scope context: `Platform / Global Capabilities` vs `[Workspace Name] / Tasker / ...`. The platform logo acts as a reset point to the root of the current scope.

## UI/UX Distinctions and Responsive Design
- **Platform Scope UI**: Reserved for `/admin` or platform-scoped paths. It implies higher-level governance. The UI styling might omit tenant-specific branding.
- **Workspace Scope UI**: Operates under `/builder/*`. It includes the global Sidebar populated by `WorkspaceContext`. UI adopts the specific Workspace's environment (e.g., demo states or badges).
- **Responsive Design:**
  - **Desktop:** The Sidebar is fully expanded on the left. The Topbar spans the remaining width. Breadcrumbs are fully visible. Platform vs Workspace distinction is clear through differentiated sidebars.
  - **Mobile/Tablet:** The Sidebar collapses into a hamburger menu or off-canvas drawer to maximize horizontal space. The Topbar remains fixed and persistently displays the active scope context to prevent disorientation.

## Roles & Restrictions (Role/Scope rules)
- Users with only `workspace_member` cannot see Platform-scoped routes in their Sidebar. Trying to force URL navigation leads to an elegant `Not Authorized` boundary page, never exposing raw 403 HTTP errors or stack traces.
- Actions within a Workspace (like changing settings or modules) only impact that tenant, never the global Platform. Platform changes (creating a new core module) affect all Workspaces.
- The `WorkspaceContext` is the absolute source of truth in `/builder`. `PlatformContext` rules in `/admin`.

## State Handling
- **Empty State**:
  - *Workspace*: If a module is empty, a commercial call-to-action is displayed (e.g., "Ready to build your first workflow? Click here to start").
  - *Platform*: Emphasizes global configuration (e.g., "Register your first tenant workspace").
- **Blocked State**:
  - *Workspace*: Modules outside the user's current license/role are rendered with reduced opacity and restricted interaction (e.g., tooltip: "Requires Pro License").
  - *Platform*: Restricted access to `/admin` safely routes to a user-friendly page.
- **Demo State**:
  - *Workspace*: A clear "Demo Mode" badge is visible in the Topbar. Destructive workspace mutations are gracefully disabled.
  - *Platform*: Modifying global platform definitions in Demo mode is disabled.
- **Synthetic Data State**:
  - *Workspace*: An amber "Synthetic Mode" indicator is locked to the shell. The UI clarifies that data is illustrative.
  - *Platform*: Synthetic states are restricted. If applied globally, a "Platform Design Mode" warning ensures administrators know changes aren't affecting real tenants.
- **Real-Data State**: Both scopes operate silently without warning badges. Data interactions trigger real loading indicators.

## Acceptance Gates and Test Expectations
Before the implementation of this contract is considered complete, the following validation evidence must be presented:
1. **E2E Path Verification**: The navigation must undergo automated end-to-end tests ensuring a user can log in, and authorized users can successfully switch between a `/builder` route and an `/admin` route, verifying the UI distinctly updates its contextual navigation.
2. **Access Control Verification**: Tests must assert that a standard workspace user cannot render the `/admin` shell, receiving the correct blocked state.
3. **State Badge Verification**: Tests must assert that if `environmentMode` is set to "synthetic" or demo in a workspace context, the indicator is visible and distinct from the platform view.
4. **Responsive Validation**: The contract requires verification that the sidebar collapses appropriately at mobile breakpoints.
