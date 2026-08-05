# Compact OpenCode agent factory

The repository queue is event-driven: one ready task is implemented, validated, proposed as a pull request, merged, and then the next task is released.

## Operating model

1. Planning creates small files in `.agent/tasks/ready/`.
2. The runner reads deterministic frontmatter with `scripts/agent/read-task-metadata.mjs`.
3. `model_tier` selects a repository-configured OpenCode model.
4. OpenCode edits only the declared scope.
5. GitHub Actions enforces file-count, lint, typecheck, architecture, tests, and build.
6. The task moves to `completed/` only in the implementation pull request.

## Repository variables

Configure:

- `OPENCODE_MODEL_SIMPLE`
- `OPENCODE_MODEL_STANDARD`
- `OPENCODE_MODEL_ADVANCED`

The simple model is the default production worker. Standard and advanced models are escalation tiers, not defaults.

## Provider secret

Configure at least one provider secret supported by the selected models, such as `OPENROUTER_API_KEY`.

## Task sizing

Prefer tasks that:

- touch 1-4 files;
- stay inside one module;
- require no open-ended architecture decisions;
- have exact acceptance criteria;
- name validation commands;
- can be reverted independently.

High-risk tasks are rejected by the automatic queue.
