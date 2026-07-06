# GitHub-First Agent Company Operating Model

## Purpose

System Builder / Gestao Tecnica development uses GitHub as the canonical technical workflow and Paperclip as the agent orchestration control plane.

GitHub owns repository state, issues, branches, pull requests, Actions, milestones, releases, and review evidence. Paperclip owns agent hierarchy, tasks, instructions, skills, budgets, heartbeat, and operational audit.

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

## Workflow

1. Codex defines the workstream, risk, scope, contracts, and acceptance criteria.
2. PMO creates or links the GitHub issue, milestone, and Project item.
3. Git Manager validates base branch, branch name, labels, and PR expectations.
4. DevOps validates baseline Actions or records known failures.
5. Jules/OpenCode executes.
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
