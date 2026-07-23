# GitHub Governor Runbook

## Purpose

The GitHub governor workflow moves the System Builder orchestration trigger from a server-only cron into GitHub Actions while preserving the existing supervisor/governor state machine.

GitHub Actions is only the scheduler and audited runner. The authoritative decisions remain in `/opt/delmacy/system-builder-orchestrator`, `state/state.json`, `logs/governor-decisions.jsonl`, `logs/heartbeat.log`, and the existing Python scripts.

## Workflow

Workflow file: `.github/workflows/system-builder-governor.yml`

Triggers:

- `workflow_dispatch` for manual operation.
- `schedule` every 20 minutes.
- `workflow_run` after the repository's governance, architecture, environment, and schema gates complete.

Delivery path:

1. Jules opens or updates a PR.
2. Repository checks run normally.
3. The completed check workflow wakes `system-builder-governor.yml`.
4. The workflow runs the existing supervisor/governor in the `opencode-supervisor` container.
5. If OpenCode review approves and merge gates are clean, the workflow enables bot approval and auto-merge through the existing state machine.
6. After merge, the next heartbeat/tick releases exactly one next serial task/session.
7. If review requests changes, the supervisor comments on the PR with an `@jules` repair instruction and keeps the task out of the merge path.

Concurrency:

- The workflow uses a single global group, `system-builder-governor`.
- `cancel-in-progress` is disabled so runs queue rather than interrupt each other.
- The remote heartbeat lock is honored. If `state/heartbeat.lock` is recent, the run exits without creating another Jules session.

## Secrets

Configure these repository secrets:

- `OPENCODE_GOVERNOR_HOST`: server host/IP.
- `OPENCODE_GOVERNOR_USER`: SSH user.
- `OPENCODE_GOVERNOR_PASSWORD`: SSH password.
- `OPENCODE_GOVERNOR_PORT`: optional SSH port; defaults to `22`.
- `OPENCODE_GOVERNOR_GITHUB_TOKEN`: optional token for GitHub PR/comment/merge operations. If absent, the workflow `GITHUB_TOKEN` is passed.
- `OPENCODE_GOVERNOR_JULES_API_KEY`: Jules API key used by the supervisor when it needs to inspect sessions, answer questions, or create the next session.

## Modes

Manual mode options:

- `heartbeat`: run `supervisor.py flow-heartbeat`, then `opencode_governor.py tick`, then `supervisor.py flow-heartbeat` again.
- `tick`: run `opencode_governor.py tick`, then one supervisor heartbeat.
- `dry-run`: call governor dry-run mode if supported by the deployed script.

## Safety Rules

- Do not restart `paperclip-app`.
- Do not create Jules sessions outside the supervisor/state machine.
- Do not merge if the governor or supervisor marks the task as `needs_codex`, `failed`, `review_failed`, `changes_requested`, or `AWAITING_USER_FEEDBACK`.
- Bot approval and auto-merge are only enabled inside the remote supervisor/governor process with `AUTO_APPROVE_WITH_BOT=true`, `AUTO_MERGE=true`, and `REQUIRE_MERGE_BEFORE_NEXT=true`; the workflow itself does not bypass review logic.
- Questions from Jules must be answered through the supervisor log path or commented back to Jules/PR with concrete repair instructions.
- If the remote container is not running, the workflow fails loudly instead of attempting infrastructure recovery.

## Expected Outcome

When a Jules PR finishes checks, the workflow wakes the supervisor/governor. If the PR is clean, the existing state machine can approve/merge and then release exactly one next task/session. If the PR needs repair or human input, the workflow records the blocker instead of leaving the queue silently stalled.
