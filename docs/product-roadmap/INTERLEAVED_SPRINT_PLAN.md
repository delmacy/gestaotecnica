# System Builder - Interleaved Sprint Plan

This plan prevents one subsystem from advancing too far ahead of the rest of the commercial product.

## Operating Rule

Sprints are lane-specific. A sprint should contain 10 small Jules tasks unless Codex explicitly approves a smaller corrective sprint.

Codex keeps only the active sprint executable in the supervisor queue. The next three sprints may be staged as planned work. When a sprint closes cleanly, the next sprint should be promoted automatically so the Jules/OpenCode flow stays continuous. Codex only pauses the chain when the current sprint closes with:

- delivery defects;
- contaminated PR;
- recurring review failure;
- architecture drift;
- corrective sprint recommendation;
- human or product decision.

If a sprint exposes integration debt, Codex may insert a corrective sprint before the next planned lane sprint. If it does not, the next planned lane sprint should start without waiting for manual approval.

## Lanes

| Lane | Purpose | Gate Bias |
|---|---|---|
| Runtime | Execution safety, events, workflow runtime, receipts, observability | Gate A |
| Modules | Capability registry, manifests, reusable app modules, lifecycle | Gates B and D |
| UI | Builder shell, form/view/workflow builder surfaces, read-only viewers | Gates B and C |
| Core | Workflow definitions, publication contracts, persistence boundaries | Gates A and B |
| Integrations | Webhooks, external connectors, retries, security, import/export | Gates D and E |
| Operations | Governance, audit, permissions, health, release readiness | Gates E and F |

Gestão Técnica is not a System Builder platform lane. It is the first client project to be built with the platform after the platform reaches the required capability level. It may provide examples, acceptance pressure, and future validation scenarios, but it must not drive platform implementation as if it were an extension module.

## Three-Sprint Minimum Per Lane

### Runtime

| Sprint | Theme | Goal |
|---|---|---|
| RT-01 | Event action boundary | Finish runtime/events public safety and no-any gates |
| RT-02 | Event receipts and idempotency | Make runtime events commercially auditable |
| RT-03 | Runtime observability contract | Add support diagnostics, error surfaces, and evidence tests |

### Modules

| Sprint | Theme | Goal |
|---|---|---|
| MOD-01 | Capability registry lifecycle contracts | Define install/activate/deactivate contracts and tests |
| MOD-02 | Module manifest validation | Harden manifest schema, versioning, and compatibility checks |
| MOD-03 | Blueprint packaging contracts | Prepare reusable module packages for export/import |

### UI

| Sprint | Theme | Goal |
|---|---|---|
| UI-01 | UI Contracts Viewer MVP | Implement read-only static viewer for UI contracts |
| UI-02 | Builder shell navigation hardening | Make navigation states, empty states, and active section behavior reliable |
| UI-03 | View Builder design-only MVP | Implement safe mock/static view builder surface without backend coupling |

### Core

| Sprint | Theme | Goal |
|---|---|---|
| CORE-01 | Workflow publication contract | Define publish result, rollback metadata, and preflight tests |
| CORE-02 | Draft persistence boundary | Establish save/load draft contracts before real Builder publication |
| CORE-03 | Definition compatibility checks | Validate version compatibility and runtime execution readiness |

### Integrations

| Sprint | Theme | Goal |
|---|---|---|
| INT-01 | Webhook contract foundation | Define webhook envelope, signature, and idempotency contracts |
| INT-02 | Connector execution boundary | Add retry/error/result contracts for external connector calls |
| INT-03 | Import/export blueprint channel | Prepare secure import/export flow for reusable blueprints |

### Operations

| Sprint | Theme | Goal |
|---|---|---|
| OPS-01 | Health and structured logging | Add support-safe health/readiness and log contracts |
| OPS-02 | Audit and approval provenance | Make approvals and audit receipts enforceable and testable |
| OPS-03 | Release candidate readiness | Add backup/restore proof, runbooks, release checklist, and known limitations |

## Interleaved Sequence

The sequence rotates lanes so commercial readiness stays balanced:

1. RT-01 - Runtime event action boundary
2. MOD-01 - Capability registry lifecycle contracts
3. UI-01 - UI Contracts Viewer MVP
4. CORE-01 - Workflow publication contract
5. OPS-01 - Health and structured logging
6. INT-01 - Webhook contract foundation
7. RT-02 - Event receipts and idempotency
8. MOD-02 - Module manifest validation
9. UI-02 - Builder shell navigation hardening
10. CORE-02 - Draft persistence boundary
11. OPS-02 - Audit and approval provenance
12. INT-02 - Connector execution boundary
13. RT-03 - Runtime observability contract
14. MOD-03 - Blueprint packaging contracts
15. UI-03 - View Builder design-only MVP
16. CORE-03 - Definition compatibility checks
17. OPS-03 - Release candidate readiness
18. INT-03 - Import/export blueprint channel

## Long Autonomous Backlog

The detailed continuation backlog lives in `AUTONOMOUS_BACKLOG_160_TASKS.md`.

That file expands the interleaved sequence into 16 additional executable sprints, 160 microtasks total, starting at `MOD-02` and continuing through `OPS-04`. It is the fallback artifact for future coordinators when Codex supervision is unavailable or reduced.

Use it as follows:

1. Materialize only one sprint at a time as executable `ready` tasks.
2. Keep future sprints `planned_gated`.
3. Promote the next sprint only after clean closeout of the active sprint.
4. Insert a corrective sprint before the next lane sprint if review, CI, scope, or architecture evidence requires it.
5. Do not use the Gestao Tecnica client project as a platform implementation lane.

## Client Project Parking Lot

Gestão Técnica is parked here until the platform can support client projects through published capabilities, forms, views, workflows, governance, runtime execution, and operational evidence.

Future client-project sprints, not platform sprints:

| Sprint | Theme | Start Condition |
|---|---|---|
| GT-CLIENT-01 | Technical request domain model | System Builder can create and publish persisted domain capabilities |
| GT-CLIENT-02 | Intake and triage golden path | Form/view/workflow publication is available |
| GT-CLIENT-03 | Execution timeline and dashboard | Runtime events, audit receipts, and read models are ready |

## Current Queue

Active:

- MOD-01 - Capability registry lifecycle contracts.

Planned next three:

1. UI-01 - UI Contracts Viewer MVP
2. CORE-01 - Workflow publication contract
3. OPS-01 - Health and structured logging

These planned sprints are the rolling queue. In the supervisor, they may already be materialized as ordered `ready` tasks with higher order numbers than the active sprint. That is intentional: the supervisor still runs one Jules task at a time, but it does not need Codex to create the next task when a clean sprint finishes. If MOD-01 leaves defects, Codex inserts a corrective sprint before UI-01 by changing the queue order/status.
