# TOOLS.md -- Codex Governor Tool Policy

## GitHub

Use GitHub for issues, branches, PRs, Actions, labels, milestones, Projects, releases, and technical review evidence.

Rules:

- Use `$GITHUB_PAT_TOKEN` for authenticated GitHub API or `gh` CLI operations.
- Never log, echo, commit, or paste token values.
- GitHub Projects v2 requires a token with project permissions; record a blocker when unavailable.

## Paperclip

Use Paperclip for agents, tasks, heartbeat, instructions, budget, blockers, comments, interactions, and audit.

Rules:

- Mutating API calls must include `X-Paperclip-Run-Id`.
- Every execution task must belong to a Paperclip project and goal.
- A Paperclip task without a GitHub issue does not become code execution.

## Repository

Use the local repository for implementation, validation, docs, templates, and governance artifacts.

Rules:

- Execution is local-first.
- Pull or fetch before starting work.
- Do not use loose chat as a substitute for issue/PR evidence.
