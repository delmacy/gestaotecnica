# CL-01 Commercial Launch Alpha: Evidence Index

This document tracks all artifacts, policies, and gate statuses for the CL-01 Commercial Launch Alpha.
It serves as the definitive index for launch readiness.

## Artifact Links

The following artifacts have been created and merged during the CL-01 preparatory phase:

- [CL-01-001: Launch Scope](CL-01-launch-scope.md)
- [CL-01-002: Architecture Context](ARCHITECTURE_CONTEXT.md)
- [CL-01-003: Execution Rules](EXECUTION_RULES.md)
- [CL-01-004: Release Roles](../operations/COMMERCIAL_LAUNCH_ROLES.md)
- [CL-01-005: Environment Baseline](../operations/RELEASE_READINESS_INVENTORY.md)
- [CL-01-006: Demo Path](CL-01-DEMO-PATH.md)
- [CL-01-007: Risk Triage](../operations/VERTICAL_PHASE_RISK_REGISTER.md)
- [CL-01-008: Analytics Plan](CL-01-ANALYTICS-PLAN.md)
- [CL-01-009: Customer-Ready Definition](CL-01-CUSTOMER-READY-DEFINITION.md)
- [CL-01-010: Alpha Dataset](CL-01-ALPHA-DATASET.md)
- [CL-01-011: Launch Index](CL-01-LAUNCH-EVIDENCE-INDEX.md) (This document)

## Gate Status Matrix

| Gate / Module | Artifact Link | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Sync Gate** | [sync-gate.md](../operations/sync-gate.md) | `alpha_ready` | Established baseline process for tracking. |
| **Launch Scope** | [CL-01-launch-scope.md](CL-01-launch-scope.md) | `alpha_ready` | Scope defined and non-goals clarified. |
| **Acceptance Matrix** | [CL-01-EXECUTABLE-TASK-ORDERS.md](CL-01-EXECUTABLE-TASK-ORDERS.md) | `alpha_ready` | Executable tasks linked to launch scope. |
| **Roles** | [COMMERCIAL_LAUNCH_ROLES.md](../operations/COMMERCIAL_LAUNCH_ROLES.md) | `alpha_ready` | RACI and Operating Model defined. |
| **Environment Baseline** | [RELEASE_READINESS_INVENTORY.md](../operations/RELEASE_READINESS_INVENTORY.md) | `alpha_ready` | CI/CD and deployment gaps identified. |
| **Demo Path** | [CL-01-DEMO-PATH.md](CL-01-DEMO-PATH.md) | `alpha_ready` | First-sale demo path documented. |
| **Risk Triage** | [VERTICAL_PHASE_RISK_REGISTER.md](../operations/VERTICAL_PHASE_RISK_REGISTER.md) | `alpha_ready` | V-01 and MVP risks triaged. |
| **Analytics** | [CL-01-ANALYTICS-PLAN.md](CL-01-ANALYTICS-PLAN.md) | `alpha_ready` | Activation metrics defined. |
| **Readiness Definition** | [CL-01-CUSTOMER-READY-DEFINITION.md](CL-01-CUSTOMER-READY-DEFINITION.md) | `alpha_ready` | Deterministic gate states established. |
| **Alpha Dataset** | [CL-01-ALPHA-DATASET.md](CL-01-ALPHA-DATASET.md) | `alpha_ready` | Demo data credentials and boundaries documented. |
| **Handoff** | [CL-01-LAUNCH-EVIDENCE-INDEX.md](CL-01-LAUNCH-EVIDENCE-INDEX.md) | `draft` | Index generated. Transitions to alpha_ready upon PR review. |

## Do Not Release CL-02 Until

*   All CL-01 artifacts in the Gate Status Matrix are marked `customer_ready`.
*   Evidence required by the [Customer-Ready Definition](CL-01-CUSTOMER-READY-DEFINITION.md) for each module is attached.
*   No unresolved blockers exist in the Risk Triage phase.
