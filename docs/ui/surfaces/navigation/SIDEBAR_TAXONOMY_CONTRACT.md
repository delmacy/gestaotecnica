# Sidebar Taxonomy and Grouping Contract

This document specifies the taxonomy, hierarchical grouping, and behavioral states of the global Sidebar in the System Builder platform, fulfilling task UX-NAV-01-011.

## Taxonomy and Grouping

The Sidebar items are organized into distinct logical groups to clarify the commercial and operational context of each module.

### 1. Workspace Core
These modules represent the foundational workspace oversight and execution surfaces.
- **Dashboard (`/builder`)**: Aggregate workspace overview.
- **Tasker (`/builder/tasker`)**: Operational execution and work item management.

### 2. Architecture & Definition
These modules are used for designing, documenting, and defining the system.
- **Capabilities (`/builder/capabilities`)**: High-level visual catalog of business capabilities.
- **Process Mirroring (`/builder/process-mirroring`)**: Intake and analysis of As-Is processes.
- **Registry (`/builder/registry`)**: Technical dictionary and capability boundaries.

### 3. Developer & Reference
Support modules for platform development and extension.
- **Docs (`/builder/docs`)**: Integrated platform documentation.
- **UI Contracts (`/builder/ui-contracts`)**: Indexing of UI surfaces and implementation status.

### 4. Configuration
Tenant-level management.
- **Settings (`/builder/settings`)**: Workspace configuration, access management, and billing.

## User Flow Clarification

- **Where the user came from**: The user arrives in this context from login (`/auth/login`), an invite acceptance, or a deep link. The Sidebar is immediately visible to provide spatial orientation.
- **What they do here**: The user scans the grouping (Core, Architecture, Config) to locate their desired operational module and assesses the system state via visual indicators (e.g., Demo mode).
- **Where they go next**: Clicking a group item transitions the main content area to that specific module (e.g., entering the Tasker).
- **How they return**: The Sidebar remains persistently anchored on the left (desktop) or accessible via off-canvas drawer (mobile), allowing instant return to any top-level module. The top-left platform logo explicitly returns to the Dashboard.

## States and Outcomes

- **Empty State**: Groupings remain visible, but selecting a module without data presents a commercial call-to-action (e.g., "Define your first capability") in the main view, never a generic "No data" message.
- **Blocked State**: Modules outside the user's current license/role are rendered with reduced opacity and restricted interaction (e.g., tooltip: "Requires Pro License"). Clicking does not navigate away but may open an upgrade intent modal.
- **Demo State**: Destructive actions within the sidebar (e.g., leaving a workspace) are disabled. The topbar explicitly shows a "Demo Mode" badge.
- **Synthetic State**: A global visual indicator clarifies that navigating these modules interacts with mocked data.
- **Real-Data State**: Sidebar cleanly synchronizes with backend state, resolving active routes without intrusive badges.

## Role and Scope Rules

- Sidebar items are dynamically populated based on `WorkspaceContext.enabledModules`.
- The taxonomy strictly relies on the `resolveNavigationInventory` backend contract to determine visibility, preventing hardcoded mock data on the frontend.
