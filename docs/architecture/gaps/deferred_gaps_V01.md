# Deferred Gaps: V-01

This document tracks deferred gaps identified during the V-01 (and related P0) audit cycles. These gaps represent pending foundational or parity work required for production readiness, specifically around data isolation, persistence, and frontend configurations.

## 1. Deferred Persistence
*   **Description:** Persistence of data and states has been deferred in several contexts. This includes process instances, process instance steps, and gap tracker data (currently synthetic/mock).
*   **Owner:** Data / Persistence Team
*   **Risks:** Data loss, lack of continuity for user sessions, inability to execute real (non-synthetic) workflows.
*   **Dependencies:** `process_instances` and `process_instance_steps` persistence logic (Phase 17B expansion), finalization of frontend persistence strategies.
*   **References:** [Context Pack: Persistence](../archive/context-packs/persistence.md)

## 2. Row-Level Security (RLS) & Workspace Capability (Data Isolation)
*   **Description:** Several legacy tables lack the `workspace_id` column, which is crucial for multitenancy and cross-tenant data isolation. Queries currently block data retrieval to prevent leaks until isolation is implemented. Furthermore, RBAC (Role-Based Access Control) implementation is blocked.
*   **Owner:** Security & Architecture Team
*   **Risks:** Cross-tenant data leaks, non-functional reporting (returns 0/empty due to safety blocks), delayed RBAC implementation.
*   **Dependencies:** Database schema migrations to add `workspace_id` to tables like `reports`, `work_items`, `assets`, `service_orders`, etc.
*   **References:** [Reporting Gaps](../modules/reports-gaps.md)

## 3. Frontend Persistence-Configuration
*   **Description:** Frontend autosave is currently managed in memory and `localStorage`. Official persistence needs to traverse the Action -> Server/Service boundary, and the frontend configuration for these persistence mechanisms is incomplete or mock-based.
*   **Owner:** Frontend Platform Team
*   **Risks:** Inconsistent user experience across sessions, potential mismatch between client state and server state, reliance on synthetic data.
*   **Dependencies:** Backend persistence API completion, validation of Action -> Server boundary patterns.
*   **References:** [Context Pack: Persistence](../archive/context-packs/persistence.md), [Gap Tracker MVP Plan](../process_mirroring/gap_tracker/GAP_TRACKER_MVP_PLAN.md)

## Audit References
These gaps are related to observations from the following audit and validation runs:
*   [P0-01-001](../agent-runs/jules/P0-01-001)
*   [P0-01-004](../agent-runs/jules/P0-01-004)
*   [P0-01-010](../agent-runs/jules/P0-01-010)
*   [V-01-004](../agent-runs/jules/V-01-004)
