# OpenCode Actions setup

This branch introduces an event-driven, serialized OpenCode development queue.

## Repository variable

Configure `OPENCODE_MODEL` with the provider/model identifier accepted by the OpenCode GitHub action.

## Repository secrets

Configure at least one model provider credential used by the selected model:

- `OPENROUTER_API_KEY`, or
- `ANTHROPIC_API_KEY`, or
- `OPENAI_API_KEY`.

For reliable workflow-to-workflow dispatch after an automated merge, configure `OPENCODE_AUTOMATION_TOKEN` as a fine-grained token or GitHub App token with the minimum Actions workflow permission required for this repository. The scheduled watchdog remains a fallback when that token is absent or dispatch fails.

## Required repository settings

- Permit GitHub Actions to create and approve pull requests when automated PR creation is desired.
- Enable auto-merge.
- Protect `main` and require the `OpenCode Pull Request Gate / validate` check.
- Keep agent pull requests serialized; do not bypass the `agent/*` open-PR gate.

## Queue lifecycle

1. Add Markdown task files to `.agent/tasks/ready/`.
2. The task runner selects the lexicographically first task.
3. OpenCode edits the checked-out repository but does not control Git operations.
4. The workflow validates the implementation, optionally requests one repair pass, then validates again.
5. The workflow moves the task definition to `.agent/tasks/completed/`, commits, pushes, opens a pull request, and enables auto-merge.
6. Independent pull request checks judge the change.
7. A successful merge dispatches the next task.
8. The 15-minute schedule acts as a watchdog if the event chain is interrupted.
9. Vercel deployment remains independently batched by the existing hourly workflow.

## Existing workflows

The specialized Agent Work operational proof, architecture check, schema CI gate, environment validation, and hourly Vercel deployment remain in place. The Jules-based `system-builder-governor.yml` is removed by this reorganization.
