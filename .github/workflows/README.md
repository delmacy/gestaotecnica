# GitHub Actions workflows

## Continuous OpenCode queue

- `opencode-task-runner.yml`: selects and implements one queued task, validates it, opens a PR, and enables auto-merge.
- `opencode-continue-after-merge.yml`: dispatches the next queued task after an `agent/*` PR is merged.
- `opencode-ci.yml`: independent PR validation gate.

## Specialized validation

- `agent-work-governance.yml`: PR metadata/governance checks for Agent Work changes.
- `agent-work-integration.yml`: Agent Work operational proof against PostgreSQL.
- `architecture-check.yml`: architecture constraints.
- `schema-ci-gate.yml`: schema and migration checks.
- `phase-2-env-validation.yml`: environment validation.

## Deployment

- `vercel-hourly-deploy.yml`: validates and promotes the latest `main` commit no more than once per hour.

The former Jules-based `system-builder-governor.yml` has been retired.
