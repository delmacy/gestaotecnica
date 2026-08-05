# Compact OpenCode agent factory

The repository queue is event-driven: one ready task is implemented, validated, proposed as a pull request, merged, and then the next task is released.

## Operating model

1. Planning creates small files in `.agent/tasks/ready/`.
2. The runner reads deterministic frontmatter with `scripts/agent/read-task-metadata.mjs`.
3. `model_tier` selects a repository-configured OpenCode model.
4. OpenCode edits only the declared scope.
5. GitHub Actions enforces file-count, lint, typecheck, architecture, tests, and build.
6. The task moves to `completed/` only in the implementation pull request.

## Configuration

### GitHub Actions

Go to **Repository > Settings > Secrets and variables > Actions**.

#### Required secrets

Configure at least one provider API key:

| Secret name | Description |
|---|---|
| `OPENROUTER_API_KEY` | OpenRouter provider key (recommended) |
| `OPENAI_API_KEY` | OpenAI direct provider key |
| `ANTHROPIC_API_KEY` | Anthropic direct provider key |
| `GOOGLE_API_KEY` | Google direct provider key |

#### Recommended variables

Model names should be stored as Repository Variables (not secrets):

| Variable name | Tier | Example value |
|---|---|---|
| `OPENCODE_MODEL_SIMPLE` | simple | `deepseek/deepseek-chat-v3-0324` |
| `OPENCODE_MODEL_STANDARD` | standard | `anthropic/claude-sonnet-4-20250514` |
| `OPENCODE_MODEL_ADVANCED` | advanced | `anthropic/claude-opus-4-1-20250414` |

#### Tier resolution

The workflow resolves models using this priority:

```
vars.OPENCODE_MODEL_* -> secrets.OPENCODE_MODEL_* (fallback)
```

Configure models as Variables. Secrets are only used as a legacy fallback.

### Local development

```bash
cp .env.example .env.local
```

Edit `.env.local` with your provider keys and model names. This file is gitignored and never committed.

Run the diagnostic to verify your configuration:

```bash
npm run opencode:diagnose
```

Optionally specify a tier:

```bash
npm run opencode:diagnose -- standard
```

## Repository variables

Configure:

- `OPENCODE_MODEL_SIMPLE`
- `OPENCODE_MODEL_STANDARD`
- `OPENCODE_MODEL_ADVANCED`

The simple model is the default production worker. Standard and advanced models are escalation tiers, not defaults.

## Provider secret

Configure at least one provider secret supported by the selected models, such as `OPENROUTER_API_KEY`.

## Manual workflow dispatch

You can trigger the runner manually from the Actions tab:

1. Go to **Actions > OpenCode Task Runner**
2. Click **Run workflow**
3. Optionally specify:
   - `task_file`: name of a file in `.agent/tasks/ready/`
   - `model_tier`: override the tier from the task file (`simple`, `standard`, `advanced`)
   - `diagnostic_only`: validate configuration without invoking the model

## Fork PR limitation

Workflows triggered by `pull_request` events from forks do not receive repository secrets. This is a GitHub security feature. The task runner uses `repository_dispatch` and `schedule` triggers which run on the main repository and have full access to secrets. Do not use `pull_request_target` to work around this, as it may introduce code execution risks with elevated privileges.

## Task sizing

Prefer tasks that:

- touch 1-4 files;
- stay inside one module;
- require no open-ended architecture decisions;
- have exact acceptance criteria;
- name validation commands;
- can be reverted independently.

High-risk tasks are rejected by the automatic queue.
