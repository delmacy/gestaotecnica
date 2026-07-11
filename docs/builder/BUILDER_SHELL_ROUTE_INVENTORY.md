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
