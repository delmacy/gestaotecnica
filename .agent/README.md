# AI Factory

The repository uses a modular, sprint-aware delivery pipeline.

## Active workflows

- `AI Factory Queue Manager`: selects the next unblocked task from the active sprint.
- `AI Factory Task Runner`: executes one compact task with the configured model.
- `AI Factory PR Validator`: runs repository-wide delivery validation without AI.
- `AI Factory Merge Manager`: applies merge policy after validation.
- `Agent Sprint Governor`: closes a finished sprint through a reviewable PR.

The former monolithic OpenCode runner and continuation workflow are retired and preserved only in Git history.

## Start the factory

Open GitHub Actions and run `AI Factory Queue Manager`. Leave `task_file` empty to select the first unblocked task automatically.

The manager dispatches the isolated runner. A successful simple low-risk task opens an `agent/*` PR, passes the validator, is auto-merged by policy, and triggers selection of the next task. When the sprint has no remaining tasks or open agent PRs, the Sprint Governor opens the sprint closure PR.

## Task locations

- `.agent/tasks/ready`: selectable tasks
- `.agent/tasks/completed`: tasks delivered to `main`
- `.agent/tasks/failed`: tasks requiring intervention
- `.agent/sprints`: sprint manifests, reports and retrospectives

See `.agent/policies/sprint-lifecycle.md` and `.agent/policies/model-routing.md` for the complete contract.
