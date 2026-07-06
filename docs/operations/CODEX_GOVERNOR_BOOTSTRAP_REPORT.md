# Codex Governor Bootstrap Report

Date: 2026-07-06

## Scope

DEL-89 requested correction of the agent company operating model because agents were not receiving assignments reliably and the prior GitHub-first wording was being treated as remote-first execution.

This report records the bootstrap state for `delmacy/gestaotecnica` and the current governance gates.

## GitHub State

- Repository: `delmacy/gestaotecnica`
- Default branch: `main`
- Operating-model PR: https://github.com/delmacy/gestaotecnica/pull/371
- Additional open PR observed: https://github.com/delmacy/gestaotecnica/pull/366
- Pilot milestone: `SB GitHub-First Pilot`
- Project v2 blocker: https://github.com/delmacy/gestaotecnica/issues/370
- Pilot issues observed:
  - https://github.com/delmacy/gestaotecnica/issues/367
  - https://github.com/delmacy/gestaotecnica/issues/368
  - https://github.com/delmacy/gestaotecnica/issues/369
  - https://github.com/delmacy/gestaotecnica/issues/373

## Repository Governance Files

Verified or added in PR #371:

- `COMPANY.md`
- `TEAM.md`
- `AGENTS.md`
- `PROJECT.md`
- `TASK.md`
- `SKILL.md`
- `HEARTBEAT.md`
- `SOUL.md`
- `TOOLS.md`
- `.github/ISSUE_TEMPLATE/agent-task.yml`
- `.github/ISSUE_TEMPLATE/blocker-report.yml`
- `.github/pull_request_template.md`
- `.github/CODEOWNERS`
- `docs/operations/GITHUB_FIRST_AGENT_COMPANY.md`
- `docs/operations/GITHUB_FIRST_PILOT.md`

## Paperclip Agent State

Observed worker agents:

- PMO Manager
- Git Manager
- DevOps Manager
- Tester
- Reviewer
- Jules Executor
- Docs Operator
- Unit Test Operator
- Triage Operator
- Jules Sandbox

The live agent instruction bundles already include the DEL-89 corrections for local-first execution, GitHub issue and PR gates, Jules parallelism, and low-cost OpenCode model policy.

## Operating Corrections

- GitHub-first now explicitly means canonical GitHub recordkeeping, not remote-first execution.
- Execution is local-first: pull locally, work locally, validate locally when applicable, push branch, open PR.
- Low-complexity and factual code work routes to Jules Executor by default.
- Jules adapter parallelism is allowed when branches and allowed files do not collide.
- Every execution task must belong to a GitHub issue plus Paperclip project and goal.
- Stale prior tasks must be cancelled, archived, or explicitly superseded before assigning replacement work.

## Validation Evidence

- PR #371 was inspected and is mergeable.
- GitHub governance workflow on PR #371 was already green before this report update.
- GitHub Projects v2 creation remains blocked by token permission and is tracked in issue #370.

## Gate

Broad System Builder execution remains gated behind human approval after the operating-model PR is reviewed and merged.
