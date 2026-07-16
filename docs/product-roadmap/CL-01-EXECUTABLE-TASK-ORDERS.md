# CL-01 Executable Task Orders

## Purpose

`Commercial Launch Alpha` was first materialized as a planning backlog. This
document converts the remaining CL-01 work into executable Jules task orders.
Each task below has a scoped objective, allowed files, deliverables, acceptance
criteria, validation evidence, and hard stops.

These orders do not release the tasks by themselves. The orchestrator state
machine must still move a task from `planned_gated` to `ready` after Codex
confirms the local worktree is synchronized with `origin/main`.

## Shared Rules

- Base branch: `main`.
- PR target: `main`.
- Before editing, run `git fetch --all --prune` and confirm the task branch is
  based on the current `origin/main` SHA.
- Record the base SHA in the PR body.
- Stay inside the task's allowed files.
- Do not change package files, migrations, app code, CI config, environment
  files, or deployment settings unless the task explicitly allows it.
- If the task cannot be completed within the allowed files, stop and file a
  blocker instead of creating a no-op PR.
- Vercel free-tier/rate-limit failures are not task blockers when the PR is
  docs-only and required GitHub checks pass.

## CL-01-004: Release Roles

Allowed files:

- `docs/operations/**`
- `docs/product-roadmap/**`

Objective:

Define the operating model for the first commercial launch: who owns launch
approval, support triage, deployment decisions, rollback, customer
communication, and evidence sign-off.

Deliverables:

- Create `docs/operations/COMMERCIAL_LAUNCH_ROLES.md`.
- Include a role table with owner role, responsibility, decision authority,
  backup owner, evidence expected, and escalation trigger.
- Include a RACI matrix for launch approval, deploy, rollback, customer pilot
  setup, incident response, and post-launch acceptance.
- Include a state-machine section for launch decisions:
  `draft -> reviewed -> approved -> active -> paused -> closed`.

Acceptance criteria:

- Every launch-critical decision has exactly one accountable owner.
- Escalation path is explicit for security, data loss, deployment, customer
  blocker, and support incident.
- The document separates alpha/demo readiness from customer-ready launch.
- Readiness labels are described as state-machine outputs, not manual labels.
- No code, package, migration, CI, or environment file is changed.

Validation evidence:

- PR body lists the created file and the recorded `origin/main` base SHA.
- PR body confirms all changed files are under the allowed paths.
- PR body includes a short checklist mapping each acceptance criterion to the
  section that satisfies it.

Hard stop:

- If ownership requires naming real people or private customer data, use role
  names only and file a follow-up for staffing details.

## CL-01-005: Environment Baseline

Allowed files:

- `docs/system-builder/validation/**`
- `docs/operations/**`

Objective:

Audit required environments, secrets, URLs, deployment ownership, and launch
readiness risks without exposing secret values.

Deliverables:

- Create `docs/system-builder/validation/COMMERCIAL_LAUNCH_ENVIRONMENT_BASELINE.md`.
- Inventory environments: local, preview, staging if present, production, and
  demo/customer-pilot.
- For each environment, document required variables by name only, owner role,
  source of truth, validation command/check, and risk if missing.
- Document deployment ownership and Vercel rate-limit handling.
- Include an explicit secret-safety section: never record secret values.

Acceptance criteria:

- The baseline names required variables without leaking values.
- The document distinguishes required, optional, unknown, and blocked items.
- Vercel rate-limit is classified as an operational risk with mitigation.
- Each environment has a validation owner and validation evidence slot.
- No `.env*`, deployment config, package, code, or migration file is changed.

Validation evidence:

- PR body records the `origin/main` base SHA.
- PR body confirms no secret values were added.
- PR body lists all changed files and confirms they are docs-only.

Hard stop:

- If a required variable cannot be identified safely, mark it `unknown` and add
  an owner/action instead of guessing.

## CL-01-006: Demo Path

Allowed files:

- `docs/product-roadmap/**`
- `docs/operations/**`

Objective:

Define the exact first-sale demo path from login to executed workflow, including
fallback behavior where the current product is not yet production-complete.

Deliverables:

- Create `docs/product-roadmap/CL-01-DEMO-PATH.md`.
- Define the happy path as numbered user actions from login through workspace,
  capability selection, builder/publish, execution, and evidence review.
- For each step, include expected UI route/surface, expected data state,
  evidence produced, blocker condition, and fallback/demo note.
- Include a demo reset/reseed note if reset is required but not yet implemented.

Acceptance criteria:

- The path starts with login and ends with visible execution/audit evidence.
- Each step has a concrete route or surface, not vague product prose.
- Current gaps are marked as blockers, fallback, or post-launch follow-up.
- The demo path maps to personas from `CL-01-launch-scope.md`.
- No app code, package files, migrations, or deployment files are changed.

Validation evidence:

- PR body records the `origin/main` base SHA.
- PR body links the scope/persona document used as input.
- PR body includes a checklist showing every step has surface, data state,
  evidence, and blocker/fallback status.

Hard stop:

- If the current UI route does not exist, document the route as a blocker and do
  not create code or route stubs in this task.

## CL-01-007: Risk Triage

Allowed files:

- `docs/operations/**`
- `docs/architecture/gaps/**`
- `docs/product-roadmap/**`

Objective:

Convert known MVP, design-only, mock, persistence, security, and workflow gaps
into launch blockers, mitigated risks, or post-launch backlog items.

Deliverables:

- Create `docs/operations/COMMERCIAL_LAUNCH_RISK_TRIAGE.md`.
- Review existing gap docs and CL-01 artifacts.
- Add a risk table with id, source, description, launch classification,
  rationale, owner role, mitigation, evidence, and follow-up task.
- Classifications must be: `launch_blocker`, `alpha_allowed`,
  `demo_only_allowed`, `post_launch_backlog`, or `needs_decision`.

Acceptance criteria:

- Every referenced risk has one classification and one owner role.
- Customer data isolation, persistence gaps, workflow execution gaps, and
  support/rollback risks are explicitly covered.
- The rationale explains why each item can or cannot ship in Commercial Alpha.
- `needs_decision` items are called out at the top.
- No code, migration, package, CI, or environment file is changed.

Validation evidence:

- PR body records the `origin/main` base SHA.
- PR body lists source docs reviewed.
- PR body counts risks by classification.

Hard stop:

- If evidence is insufficient to classify a risk, mark it `needs_decision`.

## CL-01-008: Analytics Plan

Allowed files:

- `docs/product-roadmap/**`
- `docs/operations/**`

Objective:

Define product analytics and activation metrics for the first launch without
implementing tracking code.

Deliverables:

- Create `docs/product-roadmap/CL-01-ANALYTICS-PLAN.md`.
- Define activation, engagement, reliability, support, and conversion metrics.
- For each metric, include event/source name, definition, owner role, frequency,
  target threshold, and current instrumentation status.
- Include a no-code instrumentation backlog for metrics not yet measurable.

Acceptance criteria:

- Metrics map to the first commercial launch scope and personas.
- Activation includes at least: workspace created, first capability modeled,
  first workflow published, first execution completed, evidence viewed.
- Reliability includes failed execution, support incident, rollback/retry, and
  deployment/rate-limit signal.
- Unknown instrumentation is recorded as backlog, not silently assumed.
- No analytics SDK, app code, schema, migration, package, or config file is
  changed.

Validation evidence:

- PR body records the `origin/main` base SHA.
- PR body confirms the task is documentation-only.
- PR body includes a metric count by category and a list of unknown/backlog
  instrumentation items.

Hard stop:

- If a metric would require code instrumentation, document it as backlog and do
  not implement it in this task.

## CL-01-009: Customer-Ready Definition

Allowed files:

- `docs/product-roadmap/**`
- `docs/operations/**`

Objective:

Define customer-ready, alpha-ready, demo-ready, and blocked terminology as
deterministic gate states for Commercial Launch Alpha.

Deliverables:

- Create `docs/product-roadmap/CL-01-CUSTOMER-READY-DEFINITION.md`.
- Define readiness states and allowed transitions.
- Include criteria for `prospect`, `draft`, `demo_ready`, `alpha_ready`,
  `customer_ready`, `blocked`, and `retired`.
- Include who can approve each transition and what evidence is required.
- Include examples of claims that must not be made without evidence.

Acceptance criteria:

- Readiness is represented as a state machine, not free-text status.
- Each state has entry criteria, exit criteria, owner role, and evidence.
- The document clearly forbids calling mock/design-only surfaces customer-ready.
- The definitions align with CL-01 launch scope, risk triage, and analytics.
- No code, migration, package, CI, or environment file is changed.

Validation evidence:

- PR body records the `origin/main` base SHA.
- PR body includes a transition list and evidence checklist summary.
- PR body confirms all edits stayed in allowed docs paths.

Hard stop:

- If readiness cannot be decided for a surface, classify it `blocked` or
  `needs_decision`; do not invent readiness.

## CL-01-010: Launch Index

Allowed files:

- `docs/product-roadmap/**`
- `docs/operations/**`
- `docs/system-builder/validation/**`

Objective:

Create a launch evidence index that links all CL-01 artifacts and records which
Commercial Alpha gates are satisfied, blocked, or pending.

Deliverables:

- Create `docs/product-roadmap/CL-01-LAUNCH-EVIDENCE-INDEX.md`.
- Link every CL-01 artifact, including merged artifacts from CL-01-001 through
  CL-01-009.
- Include gate status table for sync gate, launch scope, acceptance matrix,
  roles, environment baseline, demo path, risk triage, analytics, readiness
  definition, and handoff.
- Include an explicit `Do Not Release CL-02 Until` section.

Acceptance criteria:

- Every CL-01 task has an artifact link or a blocker entry.
- Gate status uses deterministic labels: `satisfied`, `blocked`, `pending`, or
  `not_applicable`.
- The index identifies remaining launch blockers and next actions.
- The index records the latest `origin/main` SHA used for the review.
- No code, migration, package, CI, or environment file is changed.

Validation evidence:

- PR body records the `origin/main` base SHA.
- PR body lists all linked artifacts and unresolved blockers.
- PR body confirms no CL-02 work is released by this PR.

Hard stop:

- If an expected CL-01 artifact is missing, record a blocker instead of creating
  replacement content outside this task's scope.
