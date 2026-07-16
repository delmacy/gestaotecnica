# Commercial Launch Alpha: Customer Ready Definition

This document defines the deterministic gate states for Commercial Launch Alpha. Readiness is represented strictly as a state machine, not a free-text status. The distinction between alpha/demo readiness and customer-ready launch is enforced.

## State Machine Definitions

The following states represent the lifecycle of a feature or module.

### 1. prospect
*   **Description:** Initial idea or proposed feature for launch.
*   **Entry Criteria:** Proposed by Product Manager.
*   **Exit Criteria:** Approved for drafting.
*   **Owner Role:** Product Manager
*   **Evidence Required:** Launch Scope PR.

### 2. draft
*   **Description:** Initial task planning and scope definition. Not ready for alpha or demo.
*   **Entry Criteria:** Transitioned from prospect.
*   **Exit Criteria:** Code and documentation complete, reviewed by peers.
*   **Owner Role:** Product Manager
*   **Evidence Required:** Launch Scope PR, Sign-off document.

### 3. demo_ready
*   **Description:** Functional prototype suitable for internal demonstrations or pilot setup.
*   **Entry Criteria:** Code and documentation complete.
*   **Exit Criteria:** Pilot setup confirmation.
*   **Owner Role:** Sales/Demo Lead
*   **Evidence Required:** Pilot setup confirmation. *Mock/design-only surfaces cannot be labeled demo_ready.*

### 4. alpha_ready
*   **Description:** Feature is deployed and reviewed by peers, achieving alpha readiness.
*   **Entry Criteria:** Code and documentation complete, reviewed by peers.
*   **Exit Criteria:** Engineering Lead and Product Manager sign-off.
*   **Owner Role:** Product Manager
*   **Evidence Required:** Launch Scope PR, Sign-off document.

### 5. customer_ready
*   **Description:** Feature is fully tested and deployed to production, customer pilot live.
*   **Entry Criteria:** Alpha sign-off.
*   **Exit Criteria:** Feature is actively used in production.
*   **Owner Role:** Engineering Lead
*   **Evidence Required:** Readiness Checklist, CI/CD logs.

### 6. blocked
*   **Description:** Progress is halted due to a dependency, critical bug, or missing core feature.
*   **Entry Criteria:** An issue prevents progress from the current state (e.g., security breach, data loss).
*   **Exit Criteria:** The blocking issue is mitigated or hotfixed.
*   **Owner Role:** Support Lead
*   **Evidence Required:** Incident response plan.

### 7. retired
*   **Description:** Feature is deprecated or launch phase completed.
*   **Entry Criteria:** Transitioned to standard operations or post-launch backlog.
*   **Exit Criteria:** Feature removed or fully transitioned.
*   **Owner Role:** Product Manager
*   **Evidence Required:** Sign-off document.

## Allowed Transitions and Approvals

*   `prospect` -> `draft` (Approved by: Product Manager)
*   `draft` -> `demo_ready` (Approved by: Engineering Lead)
*   `draft` -> `blocked` (Approved by: Engineering Lead)
*   `demo_ready` -> `alpha_ready` (Approved by: Sales/Demo Lead)
*   `demo_ready` -> `blocked` (Approved by: Support Lead)
*   `alpha_ready` -> `customer_ready` (Approved by: Product Manager & Engineering Lead)
*   `alpha_ready` -> `blocked` (Approved by: Support Lead)
*   `customer_ready` -> `blocked` (Approved by: Support Lead)
*   `blocked` -> [Previous State] (Approved by: Engineering Lead)
*   [Any State] -> `retired` (Approved by: Product Manager)

## Strict Constraints and Examples of Forbidden Claims

*   **Mock/Design-Only Surfaces:** It is strictly forbidden to label mock/design-only surfaces as `customer_ready`. They are, at best, `draft` state.
*   **Without Evidence:** Claims of readiness without the documented required evidence (e.g., claiming `customer_ready` without Readiness Checklist and CI/CD logs) are invalid. The state remains in the previous valid state until evidence is provided.
