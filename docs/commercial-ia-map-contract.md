# Commercial Information Architecture Map Contract

This document acts as the master contract for the **Commercial Information Architecture Map**, defining how users discover, navigate, and transition between commercial operational surfaces within the System Builder. This contract precedes all frontend implementation and backend API creation, ensuring the product experience focuses on value delivery rather than internal technical constructs.

## Route Contract

This section defines the user journey across the commercial module boundaries.

*   **Where the user came from:** Users arrive at the Commercial IA Map typically via the primary Workspace Dashboard (`/builder`), by accepting an organization invitation, or after successfully navigating from an authentication entry point. They may also enter via direct notifications about commercial metrics or task assignments.
*   **What they do here:** Users gain a clear, categorized view of all commercial capabilities available to their workspace (e.g., Workforce Configuration, Inventory Management, Approval Workflows). They can discover new commercial modules, check their current configuration status, and monitor high-level health or usage metrics across active capabilities.
*   **Where they go next:** From the IA map, users select a specific commercial module (e.g., navigating to `/builder/workforce` or `/builder/inventory`) to dive into granular operational management, launch an approval flow, or configure tenant-specific rules.
*   **How they return:** Users return via persistent global breadcrumbs (e.g., `Workspace / Commercial Capabilities`), via the ubiquitous main Builder Sidebar, or by using a distinct "Return to Commercial Overview" action when inside a specific module's settings.

## Data Contract

The Commercial Information Architecture relies on specific data shapes to render accurately and securely without leaking tenant boundaries.

*   **Shape:**
    *   `CommercialCapability`: Represents a module (id, name, description, category, status).
    *   `CapabilityStatus`: An enumeration indicating readiness (`active`, `pending_setup`, `blocked`, `coming_soon`).
    *   `TenantCommercialContext`: Aggregation of a workspace's active capabilities, quotas, and utilization metrics.
*   **Source:** Data originates from the `workspace` and `registry` backend schemas. The frontend must consume a strictly typed API endpoint (e.g., `/api/workspaces/:id/commercial-ia`) that aggregates this information.
*   **Ownership:** The System Builder Platform owns the capability definitions. The specific Workspace (Tenant) owns its active state, configuration data, and operational usage metrics within those capabilities.

## Role/Scope Rules

Access to the Commercial Information Architecture is tightly governed by workspace membership and roles.

*   **Workspace Admin / Organization Owner:** Full visibility into the commercial map, including the ability to discover, activate, and configure new commercial modules.
*   **Process Analyst / Capability Architect:** Can view the active commercial map and monitor capability statuses, but may be restricted from activating new billing-impacting capabilities.
*   **Reviewer / Client Viewer:** Can only view the subset of the commercial map explicitly shared with them. They cannot alter capability statuses or see unauthorized domains.

## States Table

The UI must react distinctly to different states of the Commercial IA Map, presenting clear, non-technical outcomes to the user.

| State | Condition | Distinct Outcome |
| :--- | :--- | :--- |
| **Empty** | The workspace has access to commercial modules, but none have been configured or activated yet. | The map structure remains visible. The interface highlights a commercial call-to-action (e.g., "Unlock your first commercial capability to start tracking value") with a curated list of recommended modules. No generic "No data found" errors are shown. |
| **Blocked** | The user lacks the necessary role permissions, or the entire commercial tier is locked for the workspace. | Blocked modules appear visually subdued but discoverable. Clicking them presents a polite upgrade or authorization screen (e.g., "Contact your Workspace Admin to enable Inventory Management") instead of a hard 403 error page. |
| **Demo** | The user is exploring a pre-configured showcase environment without write permissions. | A global "Demo Environment" badge is persistently visible. Destructive or mutative actions (like activating a new capability) are gracefully disabled, with tooltips explaining the restriction in the demo environment. |
| **Synthetic** | The environment is using mocked data for design, conceptual validation, or training (e.g., `data_source_mode: 'synthetic'`). | An amber "Synthetic Data Mode" indicator is locked to the view. The UI clearly communicates that the commercial metrics and capabilities shown are illustrative and not actively persisted. |
| **Real-Data** | Connected to a live, persistent database backend representing an actual tenant. | The map operates silently without warning badges. Real loading states (skeletons) are used during data fetch. All commercial metrics reflect actual, live usage. |

## Acceptance Gates

Before implementation of the Commercial IA Map is considered complete, the following criteria must be satisfied:

*   [ ] The route contract explicitly answers origin, actions, destination, and return paths.
*   [ ] Empty, blocked, demo, synthetic, and real-data states are defined with distinct, user-facing outcomes.
*   [ ] User-facing language strictly uses commercial/product terminology (e.g., "Commercial Capabilities", "Workspace Context"), avoiding internal implementation jargon.
*   [ ] The design is mandated to remain responsive and accessible on both desktop and mobile viewports.
*   [ ] Validation evidence or automated tests are documented as requirements.
*   [ ] Pipeline discipline is respected: this task completes only the contract definition stage.