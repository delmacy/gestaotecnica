# OPENCODE-BOOTSTRAP — validate the autonomous task pipeline

## Objective

Perform a minimal, low-risk repository change that proves the OpenCode queue can select a task, edit the working tree, pass independent validation, open a pull request, auto-merge, and dispatch the next queued task.

## Scope

Create `docs/automation/opencode-pipeline.md` documenting:

- the event-driven queue lifecycle;
- the role of the watchdog schedule;
- the independent pull request gate;
- the hourly Vercel deployment boundary;
- required repository variables and secrets.

## Allowed paths

- `docs/automation/**`
- `.agent/tasks/ready/010-OPENCODE-BOOTSTRAP.md` may be moved to `.agent/tasks/completed/`

## Forbidden paths

- `.github/workflows/**`
- application source code
- database migrations
- deployment configuration

## Acceptance criteria

- Documentation accurately reflects the workflows in the repository.
- No application behavior changes.
- Repository validation passes.
- The task file is moved to the completed queue in the same pull request.

## Risk

Low.
