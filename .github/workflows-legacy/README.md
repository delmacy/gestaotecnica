# Legacy agent workflows

The former monolithic OpenCode workflows were removed from `.github/workflows` so GitHub Actions no longer activates them:

- `opencode-task-runner.yml`
- `opencode-continue-after-merge.yml`

Their complete history remains available in Git. They were replaced by the modular AI Factory workflows:

- `ai-queue-manager.yml`
- `ai-task-runner.yml`
- `ai-pr-validator.yml`
- `ai-merge-manager.yml`
- `agent-sprint-governor.yml`

The legacy workflows must not be restored as active files. New delivery behavior belongs in the component that owns that responsibility.
