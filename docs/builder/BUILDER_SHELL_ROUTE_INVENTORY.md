# Builder Shell Route Inventory

This document maps the current active routes, navigation components, and known missing states of the Builder Shell module (`src/components/builder/shell`).

> **Notice:** This inventory represents the current structural and visual state of the client application. It does not claim persistence readiness for any of the active modules listed below.

## Navigation Components

The Builder Shell is composed of the following core components, located in `src/components/builder/shell/`:

- **BuilderShell.tsx**: The main layout wrapper that handles the global layout structure, integrating the `Topbar`, `Sidebar`, breadcrumbs, and rendering child routes.
- **Topbar.tsx**: The top navigation bar, displaying the application logo, global search (currently a placeholder), and user profile/workspace context controls.
- **Sidebar.tsx**: The side navigation menu containing links to platform modules. It visually distinguishes between active, mock, and future/blocked routes based on configurations in `shell-data.ts`.
- **shell-data.ts**: The centralized static data configuration for the shell. It defines the mock user session, mock workspaces, active modules (`ACTIVE_MODULES`), and future/planned modules (`FUTURE_MODULES`).

## Route Inventory

The current routes configured for the Builder Shell, derived from `ACTIVE_MODULES` in `shell-data.ts`:

### Active Routes (Grupo A)
These routes are marked as "active" in the configuration, meaning their basic layout and static content are implemented.

- `/builder` - Dashboard / Home
- `/builder/tasker` - Tasker
- `/builder/capabilities` - Capabilities
- `/builder/registry` - Registry
- `/builder/process-mirroring` - Process Mirroring
- `/builder/docs` - Docs
- `/builder/ui-contracts` - UI Contracts
- `/builder/settings` - Settings / Workspace

### Mock Routes
These routes are marked as "mock" in the configuration. They are accessible in the UI but their functionality is completely stubbed or synthetic.

- `/builder/governance-matrix` - Governance Matrix
- `/builder/operator-guide` - Operator Guide
- `/builder/enterprise-map` - Enterprise Map

## Known Missing States and Future Modules

The following modules are planned in the roadmap but are currently omitted or blocked in the Builder Shell (derived from `FUTURE_MODULES`).

### Coming Soon
These modules are marked as "coming_soon" and appear visually disabled in the interface:

- **Workflow Builder**
- **Form Builder**
- **View Builder**
- **Integrations**
- **Governance**

### Blocked
These modules are actively blocked from access:

- **Runtime** (Status: `blocked`)

### Missing Shell States
According to the Builder Shell contract (`docs/ui/surfaces/BUILDER_SHELL.md`), the following UI states are required but are not yet fully managed or lack complete backing data mechanisms:

- `no_workspace_selected`: Currently, a default mock workspace is always assumed (`CURRENT_WORKSPACE`).
- `loading_state`: While basic layouts render quickly, comprehensive transition or backend loading indicators are missing since there is no real data layer.
- `error_state`: Application-wide error boundaries handling HTTP 500s or network failures are not integrated within the shell wrapper.
- `synthetic_data_mode`: The UI implies synthetic data operations but lacks dynamic assertions to ensure the indicator is foolproof when mixing environments.
- `real_data_required`: Unimplemented.

## Shell Readiness vs. Persisted Builder Readiness

**Shell Readiness** refers to the current state of the `BuilderShell` and its immediate child navigational structures. It means the application can successfully mount the structural layout, render the sidebar and topbar, display active/mock/future module states, and route between the defined URLs without crashing. The client-side routing and visual contracts are satisfied.

**Persisted Builder Readiness**, on the other hand, implies that the modules loaded within the shell are fully wired to a backend persistence layer (e.g., PostgreSQL via Drizzle), actively saving drafts, loading real configurations, and triggering domain events.

*Crucially*, the current state of the application is **Shell Ready but NOT Persisted Builder Ready**. The shell provides a synthetic, stateless container for modules that are largely operating on mocked or transient in-memory data structures. The visual shell is "complete" for the current UI iteration, while the underlying data mechanics are pending.

## Non-Goals

For the current phase of the Builder Shell, the following are explicitly non-goals:
- **Dynamic Module Loading:** The shell relies on static configurations in `shell-data.ts`. It does not attempt to dynamically load or discover modules from a database or remote manifest.
- **Backend Persistence Integration:** The shell itself does not manage fetching or saving workspace data, user profiles, or module states to a real backend.
- **Granular RBAC:** While mock personas exist, true role-based access control (RBAC) and authorization checks before rendering a route are not implemented at the shell level yet.
- **Real-time State Syncing:** No WebSockets or real-time polling mechanisms are implemented to synchronize shell state with backend changes.

## Next Persistence Handoff

To transition the Builder Shell from a purely synthetic UI wrapper to a fully persisted, stateful container, the following handoff steps are required:
1. **Dynamic Workspace Resolution:** Replace `CURRENT_WORKSPACE` in `shell-data.ts` with a real state management solution (e.g., React Context) that fetches the user's active workspace from the backend upon login.
2. **Database-Driven Routing:** Transition `ACTIVE_MODULES` and `FUTURE_MODULES` from static arrays to a dynamic structure fetched from a module registry in the database, allowing per-workspace feature flags.
3. **Persisted User Session:** Integrate real authentication data to populate the `Topbar` and drive access control decisions.
4. **Error & Loading Boundaries:** Implement Suspense boundaries and error catchers that integrate with the data fetching layer to replace the currently static layouts with true data-driven loading states.
5. **Stateful Breadcrumbs:** Connect the breadcrumb system to the actual hierarchical data models (e.g., loading the specific Task ID name rather than just the generic route path).
