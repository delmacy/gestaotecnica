# Global Capabilities Entry Experience Contract

This document explicitly defines the route, data, and behavioral contract for the Global Capabilities Entry surface within the System Builder. It governs how users access the capabilities catalog, what states exist, and how they navigate into and out of this area.

## 1. Route Contract

- **Primary Entry Route:** `/builder/capabilities`
- **Surface Identifier:** `UI-SURF-CAPABILITY-EXPLORER`
- **Purpose:** Serve as the entry point and primary exploration catalog for all available and installed business capabilities across the platform.

## 2. User Flow Rules

This contract answers the core navigation questions for the global capabilities entry:

- **Where the user came from:**
  - Navigated from the global Sidebar (Workspace Core/Architecture section).
  - Transitioned from the Dashboard overview (via capability summaries).
  - Deep-linked from a specific workspace URL (`/builder/capabilities`).
- **What they do here:**
  - View the unified catalog of platform capabilities.
  - Understand the value proposition, domain ownership, and cross-dependencies of each capability module.
  - Assess which capabilities are currently active, available, or planned.
  - Filter and search for specific commercial capabilities by business need.
- **Where they go next:**
  - Selecting a capability opens the Capability Explorer Detail Panel to view deeper architecture.
  - Requesting an installation (simulated for now) updates the visual state.
  - Navigating out via the global sidebar to module-specific execution areas (e.g., Tasker).
- **How they return:**
  - The persistent global Sidebar provides instant access back to any core workspace surface.
  - Global Breadcrumbs (`Builder / Capabilities`) enable fast upward navigation.
  - The platform logo acts as an emergency return to the Dashboard.

## 3. Data Contract

The entry experience consumes mock/static data during the development phase (adhering to `CAPABILITY_EXPLORER_MOCK_DATA_CONTRACT.md`), avoiding real database fetches.

- **Primary Entities:** `CapabilityItem`
- **Source:** Frontend memory or structured JSON based on `CAPABILITY_REGISTRY.md`.
- **Enforced Rule:** The entry page must **not** attempt real Drizzle queries, DB mutations, or ORM relationships in this phase.

## 4. Role & Scope Rules

- **Visibility:** Open to Workspace Admins and Platform Admins.
- **Scope Restriction:** The entry view only displays capabilities related to the `WorkspaceContext.enabledModules`. Future or blocked capabilities are shown for discoverability but cannot be activated.
- **Security:** Standard authentication and workspace-level authorization are required. Unauthorized access directly to the route must yield a graceful redirect or restricted access view, not an exposed error trace.

## 5. UI State Handling

The Global Capabilities entry must reflect discrete system states with commercial, user-facing language.

- **Real-Data State:**
  - **Outcome:** Renders the catalog based on actual backend contracts (when connected). Skeletons load instantly, and interactions resolve smoothly. No warning badges.
- **Synthetic Data State:**
  - **Outcome:** Displays an amber "Synthetic Mode" indicator in the global shell. The UI makes it clear the catalog is illustrative and changes are transient.
- **Demo State:**
  - **Outcome:** A persistent "Demo Mode" badge is present. Actions simulating configuration (e.g., Request Install) are allowed visually but explicitly noted as non-persistent demo functions via tooltips.
- **Empty State:**
  - **Condition:** No capabilities match the applied search/filters.
  - **Outcome:** Displays a commercial, actionable state: "No capabilities found for the current criteria. Clear filters to explore the full catalog." (Never just "No Data").
- **Blocked State:**
  - **Condition:** Module is locked behind a higher license tier, or the capability is marked as `future`.
  - **Outcome:** The capability card appears visually subdued. Interaction triggers an upgrade intent or informative "Coming Soon" dialogue, not an error.

## 6. Responsiveness and Accessibility

- **Desktop:** Features a grid layout for high scannability of capability cards with persistent sidebars.
- **Mobile/Tablet:** Cards adapt to a single column list. Search and filters collapse into a touch-friendly accordion or modal. The sidebar collapses into an off-canvas menu.

## 7. Acceptance Gates for Implementation

Before the implementation PR is merged, the following must be validated:

1. **State Tests:** E2E or Unit tests must confirm the discrete rendering of Empty, Blocked, and Synthetic/Demo states based on mock data inputs.
2. **Flow Validation:** Breadcrumb and Sidebar sync must be tested to ensure the URL `/builder/capabilities` correctly highlights the matching sidebar item.
3. **No Mock Mutations:** Validation that clicking "Request Install" only updates client-side state and does not trigger backend API calls or mutations.
4. **Copy Review:** All user-facing strings must use product-oriented terminology (e.g., "Explore Capabilities", "Ready to Build").
