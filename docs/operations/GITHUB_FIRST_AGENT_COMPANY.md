# GitHub-First Agent Company Operating Model

## Purpose

System Builder / Gestao Tecnica development uses GitHub as the canonical technical workflow and Paperclip as the agent orchestration control plane.

GitHub owns repository state, issues, branches, pull requests, Actions, milestones, releases, and review evidence. Paperclip owns agent hierarchy, tasks, instructions, skills, budgets, heartbeat, and operational audit.

GitHub-first is not remote-first execution. Agents must pull locally, work locally, validate locally when applicable, push a branch, and deliver through a PR.

## Agent Organization

### Codex Governor

- Single interface with the human operator.
- Owns planning, scope decomposition, final review, gate decisions, and escalation.
- Does not implement code by default.
- Opens or approves workstreams and validates final evidence.

### OpenCode Managers

- PMO Manager: GitHub Projects, milestones, roadmap, dependencies, task shape, and status hygiene.
- Git Manager: branch policy, PR hygiene, labels, merge order, conflicts, releases, and changelog.
- DevOps Manager: GitHub Actions, environments, secrets, deploys, migrations, logs, and observability.
- Tester: test matrix, Actions validation, coverage, regressions, and evidence.
- Reviewer: PR diff review, scope control, architecture, security, tests, migrations, and docs.

### Operational Workers

- Handle documentation, specs, triage, unit tests, checklists, evidence, and routine updates.
- Do not alter shared contracts without an explicit task and gate.

### Jules Executor

- Preferred code executor.
- Works from GitHub issue scope and Paperclip task context.
- Delivers a PR, a blocker report, or a correction request.
- Receives low-complexity and factual code tasks by default.
- May run as multiple parallel Jules adapter agents when branches and allowed files do not collide.

## Workflow

1. Codex defines the workstream, risk, scope, contracts, and acceptance criteria.
2. PMO creates or links the GitHub issue, milestone, and Project item.
3. Git Manager validates base branch, branch name, labels, and PR expectations.
4. DevOps validates baseline Actions or records known failures.
5. Jules/OpenCode executes locally, then pushes a branch.
6. Tester validates Actions and required checks.
7. Reviewer reviews PR diff and evidence.
8. Codex approves, requests changes, closes, restarts, or escalates.

## Mandatory GitHub Artifacts

- GitHub issue for each executable task.
- Branch named `workstream/<front>/<issue-id>-<slug>` or `task/<issue-id>-<slug>` when no workstream branch is needed.
- Pull request linked to the issue.
- Actions result or documented blocker.
- Labels using `front/*`, `type/*`, `risk/*`, `agent/*`, `gate/*`, and `status/*`.
- Milestone for the current System Builder phase or rollout.
- Paperclip project and goal for each task.

## Initial Workstreams

1. Quality / CI / Observability
2. Persistence / Multi-Tenancy
3. GitHub / Paperclip Operating System

Expand to Workflow / Actions / Events, Security / Identity / Governance, Builder UI / Registry / Forms, and Gestao Tecnica Runtime only after the pilot gate is proven.

## Decision Rules

- Paperclip task without a linked GitHub issue does not become code execution.
- Code without PR is not a delivery.
- PR without Actions evidence or blocker does not reach final review.
- Jules completion means ready for validation, not accepted.
- Out-of-scope files return to Reviewer and Git Manager before Codex review.
- Human escalation is only for product, architecture, permission, credential, cost, risk, or irreconcilable conflict.

## Task Allocation Rules

- Cancel, archive, or explicitly supersede stale prior tasks before assigning replacement work.
- Keep all work attached to a GitHub issue, milestone or Project item when available, Paperclip project, and Paperclip goal.
- Prefer Jules Executor for low-complexity and factual code changes.
- Use OpenCode managers for planning, review, DevOps, Git hygiene, and technical gates.
- Use low-cost operational agents for docs, triage, fixtures, unit tests, and checklist work.
- Split long or parallel work into child issues instead of polling agents.
