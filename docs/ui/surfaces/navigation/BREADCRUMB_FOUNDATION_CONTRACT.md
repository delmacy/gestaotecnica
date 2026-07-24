# Breadcrumb and Hierarchy Foundation Contract

This document serves as the master contract for the Breadcrumb and Hierarchy Foundation of the System Builder platform, fulfilling task UX-NAV-01-026. It explicitly defines the route contract, data contract, role/scope rules, states, and acceptance gates before implementation.

## Overview

The System Builder's breadcrumb navigation acts as the hierarchical anchor, providing continuous context to users as they traverse deep within operational modules. It works in tandem with the primary global Sidebar to create a robust, predictable navigation experience.

- **Objective:** Define a consistent, state-aware breadcrumb pattern that grounds the user, clarifies their current depth, and provides immediate backward navigation paths.
- **Language:** The user-facing terminology in the breadcrumbs is commercial and product-oriented (e.g., "Workspace", "Process Mirroring", "Capability Analysis"), abstracted from internal database or route mapping variables.

## User Flow Clarification

This contract explicitly answers the core hierarchical navigation questions:

1. **Where the user came from:**
   - The user arrives at a specific node (e.g., a specific Task view) either via top-down navigation (Sidebar -> Tasker -> Specific Task) or via direct link. The breadcrumb trail must reconstruct the logical hierarchy (`Workspace Name / Tasker / Task Name`), regardless of the entry method.

2. **What they do here:**
   - The breadcrumb informs the user of their exact location within the system's spatial hierarchy. It clarifies whether they are viewing a top-level module (e.g., `Builder / Capabilities`) or a deeply nested entity (e.g., `Builder / Capabilities / Financial Operations / Invoice Processing`).

3. **Where they go next:**
   - The user proceeds to interact with the content at their current hierarchical level. The breadcrumb itself is a static map of the current position, while active elements (tables, forms) drive forward navigation.

4. **How they return:**
   - The breadcrumb provides clickable intermediate nodes, allowing instant, single-click traversal back up the hierarchy. Selecting "Tasker" from `Workspace / Tasker / Active Sprints / Sprint 4` instantly returns the user to the root Tasker module view.

## Route & Data Contract

The Breadcrumb component relies on a strict data contract mapping the URL structure to semantic hierarchical nodes.

- **Structure:** `[Scope Root] / [Module] / [Entity Type/Group] / [Specific Entity]`
- **Data Source:**
  - The first node is statically bound to the `WorkspaceContext.workspaceName` (or `PlatformContext` if operating in `/admin`).
  - The second node maps directly to the active module defined in `resolveNavigationInventory` based on `WorkspaceContext.enabledModules`.
  - Subsequent nodes are resolved dynamically by querying entity metadata (e.g., fetching a task's title based on its ID in the URL) or matching nested route segments to UI dictionaries.

## State Handling

The Breadcrumb navigation must react distinctively to various application states, ensuring users always understand the context of the data they are viewing.

### 1. Empty State
- **Condition:** Navigating to an entity that does not exist or has been deleted.
- **Outcome:** The breadcrumb maintains its structure up to the last valid node. The final (invalid) node is rendered as "Entity Not Found". The main view presents a commercial fallback (e.g., "This capability definition could not be located. Return to the Capabilities Catalog.") instead of a raw 404 page.

### 2. Blocked State
- **Condition:** The user navigates to a nested route they lack permissions to view.
- **Outcome:** The breadcrumb resolves the nodes they *do* have access to. The blocked node appears as "Restricted Area" or "Access Denied" depending on context, and the main view renders the polite "Not Authorized" boundary page as per the Platform vs Workspace contract.

### 3. Demo State
- **Condition:** Operating in a pre-configured showcase environment.
- **Outcome:** The breadcrumb functions normally. The separate global "Demo Mode" badge in the Topbar provides the state context. Breadcrumb text remains professional and unaltered (e.g., it does not say "Demo Tasker").

### 4. Synthetic Data State
- **Condition:** The environment uses mocked data (`data_source_mode: 'synthetic'`).
- **Outcome:** Breadcrumbs will display the synthetic names provided by the mock engine (e.g., `Synthetic Workspace / Tasker / Mock Task Alpha`). The amber global "Synthetic Mode" indicator remains the primary warning mechanism.

### 5. Real-Data State
- **Condition:** Connected to a live, persistent backend.
- **Outcome:** Breadcrumbs instantly reflect the live titles and names of entities fetched from the database, remaining perfectly synchronized with the active record being viewed.

## Role/Scope Rules

- **Context Awareness:** The breadcrumb strictly adheres to the Platform vs Workspace scope contract.
  - Workspace routes always start with the Workspace Name.
  - Platform routes (`/admin`) always start with a designated platform identifier (e.g., "Platform Admin").
- **Permission Filtering:** If a user accesses an entity via direct link but lacks permission to view the intermediate parent module in the Sidebar (e.g., they have a link to a specific capability but shouldn't browse the whole catalog), the breadcrumb should still construct the correct hierarchy but intermediate links they cannot access should be unclickable (text only) or gracefully redirect to the authorized nested view.

## Responsive Design

- **Desktop:** The full breadcrumb trail is displayed in the Topbar or immediately below it.
- **Mobile/Tablet:** If the trail is too long, intermediate nodes are collapsed into an ellipsis (`...`) dropdown menu, keeping the root node and the immediate parent visible to preserve context and tap targets.

## Acceptance Gates and Test Expectations

Before the implementation of this contract is considered complete, the following validation evidence must be presented:

- **E2E Path Verification:** Playwright tests must verify that navigating three levels deep into a module (e.g., Workspace -> Tasker -> Specific Task) generates a correct, three-node breadcrumb trail, and clicking the middle node successfully navigates up one level.
- **Deep Link Reconstruction Verification:** Tests must prove that loading a deep URL directly successfully reconstructs the full breadcrumb hierarchy based on context, rather than only showing the final node.
- **Invalid Node Validation:** Ensure that attempting to access a non-existent entity ID in the URL gracefully renders the "Entity Not Found" state in the breadcrumbs and main view without crashing the app.
- **Responsive Validation:** Automated visual tests must assert that long breadcrumb trails collapse correctly using ellipses on mobile viewports.
