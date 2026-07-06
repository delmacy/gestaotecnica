# CODEX_GOVERNOR_BOOTSTRAP_REPORT

## Scope

Bootstrap report for the GitHub-first agent company setup on `gestaotecnica`.

## Repository State

- Checked repository: `delmacy/gestaotecnica`
- Local branch at bootstrap: `main`
- Remote: `origin https://github.com/delmacy/gestaotecnica.git`
- Existing root governance file before bootstrap: `AGENTS.md`

## GitHub State Observed

- Open draft PR observed: `#371 Add GitHub-first agent company operating model`
- Additional open PR observed: `#366 SB-S02-T09 — Revisão de isolamento e append-only`
- Open milestone observed: `SB GitHub-First Pilot`
- Agent and gate labels already exist in GitHub
- Actions workflows present in `.github/workflows/`
- PR template present at `.github/pull_request_template.md`
- Issue templates were not present on `main` at bootstrap time
- `CODEOWNERS` present and currently set to `* @delmacy`

## Governance Files

Created during bootstrap:

- `COMPANY.md`
- `TEAM.md`
- `PROJECT.md`
- `TASK.md`
- `SOUL.md`
- `HEARTBEAT.md`
- `TOOLS.md`
- `SKILL.md`

Verified existing:

- `AGENTS.md`

## Worker Agent Target Topology

- PMO Manager
- Git Manager
- DevOps Manager
- Tester
- Reviewer
- Jules Executor
- Docs Operator
- Unit Test Operator
- Triage Operator

Each worker bundle is required to carry:

- `AGENTS.md`
- `SOUL.md`
- `HEARTBEAT.md`
- `TOOLS.md`
- role-specific `SKILL.md`

## Worker Agents Created In Paperclip

- PMO Manager: `fecc53a4-8779-4f1b-896a-b3077b459250`
- Git Manager: `09aba987-4c7d-4520-8a3b-6e320e9162b9`
- DevOps Manager: `3263ebb7-346a-4bb7-9061-0ed26a636e6b`
- Tester: `1fa16367-18de-4deb-bd27-cdeae82c9e2b`
- Reviewer: `c426905b-f05f-48d2-b757-d01f28605b7c`
- Jules Executor: `8314e42a-b145-4f60-8ec8-cf860440540b`
- Docs Operator: `683410d2-04cb-4776-8173-1df53ef0c36d`
- Unit Test Operator: `0aa47fbb-5fd4-49c5-98c7-3fcb3362e276`
- Triage Operator: `14317cf7-f187-4b43-97b7-0849d7746e4c`

All were configured to report to Codex Governor and to use managed instruction bundles carrying `AGENTS.md`, `SOUL.md`, `HEARTBEAT.md`, `TOOLS.md`, and role-specific `SKILL.md`.

## Runtime Correction After Bootstrap

Issue `DEL-47` corrected the worker runtime split expected by the operating model:

- PMO Manager, Git Manager, DevOps Manager, Tester, Reviewer, Docs Operator, Unit Test Operator, and Triage Operator now use `opencode_local`
- `Jules Executor` remains on `jules_local`
- Managed instruction bundles were preserved for every worker agent during the adapter change

## Agent Model Balancing (DEL-50)

After human approval, the `opencode_local` agents were moved away from the single `opencode/gpt-5.4` model to a cost/reasoning-balanced profile:

| Agent | Adapter | Model |
|-------|---------|-------|
| Codex Governor | `opencode_local` | `opencode/kimi-k2.7-code` |
| PMO Manager | `opencode_local` | `opencode/qwen3.6-plus` |
| Git Manager | `opencode_local` | `opencode/deepseek-v4-pro` |
| DevOps Manager | `opencode_local` | `opencode/qwen3.6-plus` |
| Tester | `opencode_local` | `opencode/minimax-m2.5` |
| Reviewer | `opencode_local` | `opencode/kimi-k2.6` |
| Docs Operator | `opencode_local` | `opencode/deepseek-v4-flash-free` |
| Unit Test Operator | `opencode_local` | `opencode/minimax-m2.5` |
| Triage Operator | `opencode_local` | `opencode/qwen3.5-plus` |
| Jules Executor | `jules_local` | adapter-managed |

Rationale:

- The governor/task-elaboration agent keeps a high-reasoning model.
- Manager agents use intermediate models because their work is more deterministic.
- Operational agents (docs, tests, records) use the cheapest adequate models.
- `Jules Executor` is unchanged on its own adapter-managed model.

The updated model map is also recorded in `TEAM.md`.

## Initial Gaps Recorded

- `main` does not yet contain issue templates.
- GitHub Project v2 creation is reported as blocked in draft PR `#371`.
- Bootstrap artifacts exist locally in this workspace and need normal PR handling before repository acceptance.

## Approval Gate

Bootstrap completion does not authorize broad execution.

Next required action:

- Human approval of the bootstrap state
- Then execution-task creation and delegation under the GitHub-first contract
