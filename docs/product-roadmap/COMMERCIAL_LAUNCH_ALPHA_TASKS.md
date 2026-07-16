# Commercial Launch Alpha Task Plan

## Purpose

This phase turns the System Builder technical foundation into a first commercial
launch candidate. It starts only after `V-01` closes cleanly.

The phase is materialized in the Jules/OpenCode orchestrator as `CL-A` with 12
planned-gated sprints and 120 total tasks. It is intentionally gated so it does
not compete with the active `V-01` sprint.

## Release Rule

- `CL-01` may be released only after `V-01` is terminal-clean.
- `CL-02` through `CL-12` remain gated until the previous commercial-launch
  sprint closes cleanly.
- Before any task edits repository files, the local branch/worktree must be
  synchronized with `origin/main` and the base SHA must be recorded as evidence.
- Status changes must be produced by code/state-machine rules or documented
  deterministic gates. Do not reinterpret task status manually.

## Sprint Map

| Sprint | Lane | Title | Task Count | Depends On |
| --- | --- | --- | ---: | --- |
| `CL-01` | Product | Commercial launch baseline and local main synchronization | 10 | `V-01` |
| `CL-02` | Security | Tenant onboarding, auth, and admin readiness | 10 | `CL-01` |
| `CL-03` | Persistence | Persistent commercial vertical data model and repository binding | 10 | `CL-02` |
| `CL-04` | UI | Commercial builder shell and navigation readiness | 10 | `CL-03` |
| `CL-05` | Product | Capability registry and product modeling workflow | 10 | `CL-04` |
| `CL-06` | Builder | Form and view builder runtime binding | 10 | `CL-05` |
| `CL-07` | Runtime | Workflow publication and execution experience | 10 | `CL-06` |
| `CL-08` | Observability | Timeline, audit, and customer-visible evidence | 10 | `CL-07` |
| `CL-09` | Governance | Approvals, readiness gates, and commercial guardrails | 10 | `CL-08` |
| `CL-10` | Pilot | First customer/demo workspace readiness | 10 | `CL-09` |
| `CL-11` | Quality | Launch QA, performance, and regression hardening | 10 | `CL-10` |
| `CL-12` | Launch | Commercial launch packaging, operations, and handoff | 10 | `CL-11` |

## Task Inventory

### CL-01: Commercial launch baseline and local main synchronization

1. `CL-01-001-sync-gate` - Add a deterministic local branch sync gate for Codex/Jules worktrees before launch work starts.
2. `CL-01-002-launch-scope` - Define first commercial launch scope, personas, and non-goals.
3. `CL-01-003-acceptance-matrix` - Create commercial launch acceptance matrix and evidence checklist.
4. `CL-01-004-release-roles` - Document launch roles, support ownership, and escalation path.
5. `CL-01-005-environment-baseline` - Audit required environments, secrets, URLs, and deploy ownership.
6. `CL-01-006-demo-path` - Define the exact first-sale demo path from login to executed workflow.
7. `CL-01-007-risk-triage` - Convert known MVP/design-only gaps into launch blockers vs post-launch backlog.
8. `CL-01-008-analytics-plan` - Define product analytics and activation metrics for first launch.
9. `CL-01-009-customer-ready-definition` - Define customer-ready vs alpha/demo-ready terminology and gate labels.
10. `CL-01-010-launch-index` - Create launch evidence index linking all CL phase artifacts.

### CL-02: Tenant onboarding, auth, and admin readiness

1. `CL-02-001-tenant-model-audit` - Audit tenant/workspace/account model for first commercial use.
2. `CL-02-002-admin-onboarding-flow` - Implement or repair first admin onboarding flow with persisted evidence.
3. `CL-02-003-workspace-switching` - Verify workspace switching cannot leak cross-tenant data in UI flows.
4. `CL-02-004-rbac-minimum` - Implement minimum commercial RBAC roles and access checks.
5. `CL-02-005-session-hardening` - Review session/auth edge cases and add focused tests.
6. `CL-02-006-invite-flow` - Implement invite or admin-created user path for first customer workspace.
7. `CL-02-007-permission-copy` - Add user-facing permission copy and blocked-state messages.
8. `CL-02-008-auth-recovery` - Document and test admin recovery path without data reset.
9. `CL-02-009-security-audit` - Run focused auth/multitenancy security audit and record findings.
10. `CL-02-010-security-closeout` - Close CL-02 with proof of tenant-safe onboarding and RBAC evidence.

### CL-03: Persistent commercial vertical data model and repository binding

1. `CL-03-001-persistence-inventory` - Inventory all launch-critical mock/static data surfaces.
2. `CL-03-002-workspace-persistence-port` - Define workspace-scoped persistence ports for launch vertical data.
3. `CL-03-003-client-repository-binding` - Bind client/workspace/capability data to persisted repositories.
4. `CL-03-004-form-persistence-binding` - Bind form definitions to persisted workspace scope.
5. `CL-03-005-workflow-persistence-binding` - Bind workflow/process definitions to persisted workspace scope.
6. `CL-03-006-timeline-persistence-binding` - Bind timeline/audit items to persisted workspace scope.
7. `CL-03-007-seed-fixtures` - Create deterministic launch demo seed fixtures with no PII.
8. `CL-03-008-data-reset-safe` - Add safe demo data reset/reseed procedure for launch environments.
9. `CL-03-009-persistence-tests` - Add end-to-end persistence tests for the launch vertical.
10. `CL-03-010-persistence-closeout` - Record persistence proof and remaining production hardening gaps.

### CL-04: Commercial builder shell and navigation readiness

1. `CL-04-001-route-inventory` - Verify launch routes and remove dead/demo-only entry points from nav.
2. `CL-04-002-empty-states` - Implement professional empty/loading/error states for launch surfaces.
3. `CL-04-003-workspace-home` - Create customer workspace home with next-action navigation.
4. `CL-04-004-builder-navigation` - Connect Builder Shell navigation to real persisted launch surfaces.
5. `CL-04-005-capability-entry` - Create launch-ready capability entry path from workspace home.
6. `CL-04-006-form-entry` - Create launch-ready form builder entry path.
7. `CL-04-007-workflow-entry` - Create launch-ready workflow builder entry path.
8. `CL-04-008-execution-entry` - Create launch-ready execution/timeline entry path.
9. `CL-04-009-responsive-pass` - Run responsive/accessibility polish for launch shell.
10. `CL-04-010-ui-closeout` - Record UI launch walkthrough evidence and screenshots checklist.

### CL-05: Capability registry and product modeling workflow

1. `CL-05-001-capability-schema` - Finalize canonical capability schema for commercial launch.
2. `CL-05-002-capability-crud` - Implement workspace-scoped capability create/edit/list flow.
3. `CL-05-003-capability-status` - Implement capability lifecycle status and readiness indicators.
4. `CL-05-004-capability-relations` - Model capability relations to forms, workflows, and entities.
5. `CL-05-005-registry-view` - Bind registry viewer to persisted capability data.
6. `CL-05-006-capability-validation` - Add validation and clear user errors for invalid capability setup.
7. `CL-05-007-capability-import` - Support deterministic capability seed/import for demo workspace.
8. `CL-05-008-capability-audit` - Emit audit/timeline events for capability changes.
9. `CL-05-009-capability-docs` - Document capability modeling workflow for launch operator.
10. `CL-05-010-capability-closeout` - Prove capability-to-builder path in launch evidence.

### CL-06: Form and view builder runtime binding

1. `CL-06-001-form-real-data` - Replace launch form builder mock state with persisted definitions.
2. `CL-06-002-form-save-load` - Implement form save/load/version path within workspace scope.
3. `CL-06-003-form-preview` - Bind form preview to persisted schema and validation rules.
4. `CL-06-004-view-real-data` - Replace launch view builder mock state with persisted definitions.
5. `CL-06-005-view-save-load` - Implement view save/load/version path within workspace scope.
6. `CL-06-006-field-binding` - Implement field/entity binding validation across forms and views.
7. `CL-06-007-builder-dirty-state` - Add unsaved-change and optimistic/error behavior for builders.
8. `CL-06-008-builder-contract-tests` - Add contract tests proving form/view definitions round-trip.
9. `CL-06-009-builder-docs` - Document launch limits of form/view builders.
10. `CL-06-010-builder-closeout` - Record form/view builder E2E proof for launch vertical.

### CL-07: Workflow publication and execution experience

1. `CL-07-001-workflow-real-data` - Replace launch workflow builder mock state with persisted workflow definitions.
2. `CL-07-002-workflow-save-load` - Implement workflow save/load/version path.
3. `CL-07-003-publication-flow` - Implement publish action from workflow builder to publication contract.
4. `CL-07-004-publication-ui` - Add publish review UI with blockers/warnings/evidence.
5. `CL-07-005-execution-start` - Implement start execution path for published workflow.
6. `CL-07-006-execution-status` - Expose execution status, result, and failure state in UI.
7. `CL-07-007-runtime-errors` - Map runtime errors to user-safe launch messages.
8. `CL-07-008-runtime-idempotency` - Verify idempotent execution start/retry behavior.
9. `CL-07-009-runtime-e2e-tests` - Add E2E tests for publish to execute happy path.
10. `CL-07-010-runtime-closeout` - Record workflow publication/execution evidence.

### CL-08: Timeline, audit, and customer-visible evidence

1. `CL-08-001-timeline-real-data` - Bind timeline UI/service to persisted timeline contracts.
2. `CL-08-002-audit-receipts` - Create audit receipts for launch-critical actions.
3. `CL-08-003-activity-feed` - Implement workspace activity feed for capability/form/workflow/execution.
4. `CL-08-004-event-filtering` - Add filters/search for timeline by entity/workflow/status.
5. `CL-08-005-support-diagnostics` - Create support diagnostics panel or export for launch operator.
6. `CL-08-006-error-correlation` - Add correlation IDs to user-visible failures and logs.
7. `CL-08-007-audit-redaction` - Verify no secrets/PII leak into audit/timeline views.
8. `CL-08-008-timeline-e2e-tests` - Add E2E timeline proof for the launch vertical.
9. `CL-08-009-observability-runbook` - Document support evidence collection and incident workflow.
10. `CL-08-010-observability-closeout` - Record observability proof and residual gaps.

### CL-09: Approvals, readiness gates, and commercial guardrails

1. `CL-09-001-readiness-state-machine` - Implement product readiness states as explicit state machine.
2. `CL-09-002-approval-contracts` - Formalize approval request/result contracts.
3. `CL-09-003-approval-ui` - Implement approval/rejection UI for publish and launch gates.
4. `CL-09-004-sod-rules` - Add minimum segregation-of-duty guardrails.
5. `CL-09-005-blocker-handling` - Implement blocker display and resolution workflow.
6. `CL-09-006-governance-audit` - Emit audit receipts for approvals and gate changes.
7. `CL-09-007-policy-docs` - Document commercial governance policy and exceptions.
8. `CL-09-008-gate-tests` - Add tests proving gates cannot be bypassed by UI-only state.
9. `CL-09-009-governance-e2e` - Prove approval-gated publish/execution E2E.
10. `CL-09-010-governance-closeout` - Record governance launch evidence.

### CL-10: First customer/demo workspace readiness

1. `CL-10-001-demo-workspace-seed` - Create first commercial demo workspace seed set.
2. `CL-10-002-technical-service-template` - Model Technical Service as a launch demo template without real PII.
3. `CL-10-003-demo-script` - Write operator demo script mapped to real UI routes.
4. `CL-10-004-demo-reset` - Implement one-command demo reset/reseed flow.
5. `CL-10-005-sample-users` - Create safe sample users/roles/workspace fixtures.
6. `CL-10-006-pilot-intake` - Create source intake path for adding first real customer sources later.
7. `CL-10-007-pilot-gap-register` - Track what remains blocked by missing real GT sources.
8. `CL-10-008-demo-e2e` - Add demo happy-path automated test.
9. `CL-10-009-pilot-ops-doc` - Document pilot onboarding and customer acceptance checklist.
10. `CL-10-010-pilot-closeout` - Record demo workspace proof and GT carry-forward blockers.

### CL-11: Launch QA, performance, and regression hardening

1. `CL-11-001-build-baseline` - Refresh launch build/test baseline from main.
2. `CL-11-002-test-triage` - Classify failing/flaky tests and fix launch-blocking ones.
3. `CL-11-003-smoke-suite` - Create launch smoke suite for auth/workspace/builder/runtime.
4. `CL-11-004-a11y-suite` - Add focused accessibility checks for launch routes.
5. `CL-11-005-performance-pass` - Measure and fix obvious slow launch screens/actions.
6. `CL-11-006-security-pass` - Run focused security check on auth/tenant/persistence surfaces.
7. `CL-11-007-rollback-drill` - Document and validate rollback/reseed/deploy recovery drill.
8. `CL-11-008-ci-required-checks` - Ensure required GitHub checks match launch merge policy.
9. `CL-11-009-release-candidate` - Create release candidate validation report.
10. `CL-11-010-qa-closeout` - Close QA with explicit go/no-go recommendation.

### CL-12: Commercial launch packaging, operations, and handoff

1. `CL-12-001-pricing-packaging` - Define first-launch packaging assumptions and feature boundaries.
2. `CL-12-002-terms-boundaries` - Document alpha/commercial terms, support limits, and known gaps.
3. `CL-12-003-operator-training` - Create operator training checklist and walkthrough.
4. `CL-12-004-customer-onboarding` - Create customer onboarding guide for first workspace.
5. `CL-12-005-launch-dashboard` - Create launch readiness dashboard/index doc.
6. `CL-12-006-production-env-check` - Validate production env variables, domains, deployment and backups.
7. `CL-12-007-support-playbook` - Create first-line support playbook and escalation checklist.
8. `CL-12-008-release-notes` - Prepare first commercial release notes and demo changelog.
9. `CL-12-009-go-no-go` - Perform final go/no-go review with evidence links.
10. `CL-12-010-handoff-next-phase` - Record launch handoff and next commercial backlog.
