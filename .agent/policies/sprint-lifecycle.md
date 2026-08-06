# Agent sprint lifecycle

A sprint is the delivery boundary above compact AI tasks.

## Active architecture

The AI Factory is event-driven and modular:

1. `AI Factory Queue Manager` finds the active sprint and first unblocked ready task.
2. `AI Factory Task Runner` executes one compact task with bounded context and focal validation.
3. `AI Factory PR Validator` performs repository-wide CI without calling AI.
4. `AI Factory Merge Manager` auto-merges only simple low-risk deliverables; escalated work waits for review.
5. `Agent Sprint Governor` evaluates closure after merges and proposes a closure PR.

The retired monolithic OpenCode runner and its continuation workflow are no longer active.

## Task contract

Every task in an active sprint must declare:

- `sprint_id`
- `epic_id`
- `story_points`
- `estimated_minutes`
- `model_tier`
- `risk`
- `requires_database`
- `context_paths`
- `allowed_paths`
- `agent_validation`
- `ci_validation`
- `max_files`

Dependencies are declared with `depends_on`. The queue remains serial and does not start a dependent task before every prerequisite appears in `completed`.

## Execution boundary

The task runner receives a selected task; it does not plan the sprint. It supplies `context_paths`, asks for one implementation pass, runs only `agent_validation`, enforces scope, and opens a delivery PR.

Repository-wide lint, typecheck, architecture, database validation, unit tests, integration tests and build belong to the PR validator. Free or low-cost models receive no automatic repair session.

## Merge policy

- `simple + low`: automatic squash merge after the validator succeeds.
- any other tier or risk: validated PR remains open for human review.
- `high` risk: task runner rejects automatic execution.

## Sprint closure

A sprint is eligible for closure only when:

1. every linked task is in `completed`;
2. no linked task is in `failed`;
3. no `agent/*` pull request remains open;
4. required CI checks were enforced on each merged task;
5. completion report, metrics and retrospective are generated.

Closure is proposed through a pull request containing deterministic evidence. No AI call is required to close or report the sprint.

## Delivery evidence

The sprint closure PR contains:

- `reports/completion-report.md`
- `reports/metrics.json`
- `retrospective.md`
- `sprint.yaml` with `status: closed` and `closed_at`

Findings outside the current task become backlog items and must not expand a running task.
