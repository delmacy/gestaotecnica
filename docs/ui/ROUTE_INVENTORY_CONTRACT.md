# Route and Menu Inventory Contract

This document serves as the master contract for the navigation information architecture (IA) and global menu foundation of the System Builder platform. It explicitly defines the route contract, data contract, role/scope rules, states, and acceptance gates before implementation.

## Overview

The System Builder's global navigation acts as the central orchestrator for all operational modules. It is designed to be highly predictable, context-aware, and scalable across different capabilities.

- **Objective:** Provide a seamless, state-aware navigation experience for users managing workspaces, designing workflows, and monitoring operational data.
- **Language:** The user-facing terminology in the navigation is commercial and product-oriented (e.g., "Workspace Settings", "Capabilities Catalog"), completely abstracted from the internal implementation details.

## User Flow

This contract explicitly answers the core navigation questions for the global shell:

1. **Where the user came from:**
   - Users land in the Builder Shell typically after a successful authentication flow (`/auth/login`) or by accepting an invitation to a workspace.
   - They may also arrive via deep links directly into a specific module (e.g., a specific task in the Tasker Board).

2. **What they do here:**
   - Gain a high-level overview of their workspace.
   - Navigate between functional modules (Tasker, Capabilities, Registry, Process Mirroring, etc.) using the primary Sidebar and Topbar.
   - Switch active workspace contexts.
   - Identify the current system state (e.g., Demo, Synthetic, or Real Data).

3. **Where they go next:**
   - From the global menu, users branch out into specific operational surfaces (e.g., `/builder/tasker` to manage tasks, or `/builder/capabilities` to explore capabilities).
   - They can dive deep into granular entity views within a module (e.g., viewing a specific process definition).

4. **How they return:**
   - A persistent, ubiquitous Sidebar allows users to jump back to any root module instantly.
   - A global Breadcrumb component (`Builder / [Module] / [Context]`) provides quick hierarchical backward navigation.
   - The platform logo acts as an emergency exit returning the user to the main Dashboard (`/builder`).

## Route & Menu Inventory (Group A)

The active routes available in the navigation menu and their basic structural mapping:

- **Dashboard / Home**
  - **Route:** `/builder`
  - **Purpose:** Aggregate overview of workspace activity.

- **Tasker**
  - **Route:** `/builder/tasker`
  - **Purpose:** Centralized work item and task execution surface.

- **Capabilities**
  - **Route:** `/builder/capabilities`
  - **Purpose:** Visual exploration of the capabilities catalog.

- **Registry**
  - **Route:** `/builder/registry`
  - **Purpose:** Technical, read-only view of capability boundaries.

- **Process Mirroring**
  - **Route:** `/builder/process-mirroring`
  - **Purpose:** As-Is process intake and analysis.

- **Docs**
  - **Route:** `/builder/docs`
  - **Purpose:** Integrated platform documentation and capability specifications.

- **UI Contracts**
  - **Route:** `/builder/ui-contracts`
  - **Purpose:** Read-only indexing of UI surfaces and implementation status.

- **Settings / Workspace**
  - **Route:** `/builder/settings`
  - **Purpose:** Tenant configuration and access management.

## State Handling

The global navigation must react distinctively to various application states. These states provide clear, user-facing outcomes that ensure the user always understands their environment.

### 1. Empty State
- **Condition:** The user has access to a module, but no entities exist yet.
- **Outcome:** The navigation structure remains fully visible. The main content area of the specific module displays a commercial call-to-action (e.g., "Ready to build your first workflow? Click here to start.") rather than a generic "No data" message.

### 2. Blocked State
- **Condition:** The user lacks permission, or a module is flagged as `future`/`coming_soon`.
- **Outcome:** In the menu, blocked modules appear visually subdued. Clicking them does not navigate away, but either reveals a tooltip indicating "Coming Soon" or navigates to a polite upgrade/waitlist screen explaining the value of the upcoming feature.

### 3. Demo State
- **Condition:** The user is exploring a pre-configured showcase environment without write permissions.
- **Outcome:** A persistent, unmistakable global badge (e.g., "Demo Mode") is rendered in the Topbar. Actions that would cause destructive mutations are gracefully disabled with tooltips explaining that they are restricted in the demo environment.

### 4. Synthetic Data State
- **Condition:** The environment is using mocked data for design or conceptual validation (e.g., `data_source_mode: 'synthetic'`).
- **Outcome:** An amber "Synthetic Mode" indicator is locked to the global shell. The UI makes it clear that the data presented is illustrative and not actively persisted. Attempting to alter global configuration shows a warning that changes are transient.

### 5. Real-Data State
- **Condition:** Connected to a live, persistent database backend.
- **Outcome:** The shell operates silently without warning badges. Data interactions trigger real loading indicators (skeletons, spinners) that fetch from the active backend. Breadcrumbs and active states perfectly sync with the URL and backend data hierarchy.

## Responsive Design

- **Desktop:** The Sidebar is fully expanded on the left. The Topbar spans the remaining width. Breadcrumbs are fully visible.
- **Mobile/Tablet:** The Sidebar collapses into a hamburger menu or off-canvas drawer to maximize horizontal space. The Topbar remains fixed. The UI remains fully touch-friendly with appropriate tap targets.

## Data Contract & Role/Scope Rules

- **Workspace Context:** The navigation strictly respects the `WorkspaceContext`. Routes and available modules are dynamically filtered based on `enabledModules`.
- **Role Permissions:** The Shell relies on the backend to provide a sanitized list of accessible routes. If a user forces a URL they don't have access to, the Shell intercepts and redirects to a "Not Authorized" gracefully designed page, never exposing raw 403 HTTP errors or stack traces.
- **Data Fetching:** The navigation wrapper must cleanly separate its own data requirements (e.g., fetching user profile, tenant logo) from the child route's data requirements to prevent cascading rendering waterfalls.

## Acceptance Gates and Test Expectations

Before the implementation of this contract is considered complete, the following validation evidence must be presented:

- **E2E Validation:** The navigation must undergo automated end-to-end tests ensuring a user can log in, see the correct subset of menu items based on their workspace context, navigate to a module, and observe the URL and breadcrumbs updating correctly.
- **State Validation:** Tests must assert that the "Synthetic Mode" or "Demo Mode" badges render when their respective environment variables or context flags are active.
- **Responsive Validation:** The contract requires verification (via Playwright or visual regression) that the sidebar collapses appropriately at mobile breakpoints.
- **No Mock Fallback for Live Routes:** If a route is supposed to be live but the backend contract is missing, the frontend must fail gracefully and document a blocker, strictly prohibiting the hardcoding of fallback static data within the component.
