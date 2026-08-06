# Agent sprint lifecycle

A sprint is the delivery boundary above compact OpenCode tasks.

## Hierarchy

`portfolio -> roadmap -> epic -> sprint -> task`

The repository currently automates the sprint and task layers. Epic and roadmap identifiers remain metadata until their registries are introduced.

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

Dependencies are declared with `depends_on`. The queue remains serial and must not start a dependent task before its prerequisites are completed.

## Execution boundary

The agent performs only the compact implementation and `agent_validation`. Repository-wide validation remains the responsibility of CI. Free or low-cost models must not receive an automatic second repair session by default.

## Sprint closure

A sprint is eligible for closure only when:

1. every linked task is in `completed`;
2. no linked task is in `failed`;
3. no `agent/*` pull request remains open;
4. required CI checks were enforced on each merged task;
5. completion report, metrics and retrospective are generated.

`Agent Sprint Governor` evaluates the active sprint after merges or by manual dispatch. Closure is proposed through a pull request so reports remain reviewable and branch protection remains effective.

## Generated evidence

The closure pull request contains:

- `reports/completion-report.md`
- `reports/metrics.json`
- `retrospective.md`
- `sprint.yaml` with `status: closed` and `closed_at`

Findings that are not required by the current task must become backlog items; they must not expand the running task.
