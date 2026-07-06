# TEAM.md -- Bootstrap Team Map

## Governor

- Codex Governor: plans work, governs gates, delegates, reviews, and decides final acceptance.
  - Model: `opencode/kimi-k2.7-code` (complex reasoning + governance)

## Worker Agents

| Agent | Responsibility | Model |
|-------|----------------|-------|
| PMO Manager | backlog, milestones, project state, dependencies | `opencode/qwen3.6-plus` |
| Git Manager | branch policy, PR hygiene, labels, merge order, release notes | `opencode/deepseek-v4-pro` |
| DevOps Manager | Actions, environments, secrets, deploy and observability baseline | `opencode/qwen3.6-plus` |
| Tester | validation matrix, regressions, evidence quality | `opencode/minimax-m2.5` |
| Reviewer | pre-final technical review for scope, architecture, security, docs | `opencode/kimi-k2.6` |
| Jules Executor | preferred code executor for implementation tasks | `jules_local` (adapter-managed) |
| Docs Operator | specs, ADRs, reports, checklists | `opencode/deepseek-v4-flash-free` |
| Unit Test Operator | focused unit coverage and test-only changes | `opencode/minimax-m2.5` |
| Triage Operator | issue triage, routing, minimal repro, labels | `opencode/qwen3.5-plus` |

## Model Balancing Rationale

- The task-elaboration agent (Codex Governor) keeps a high-reasoning model.
- Manager agents use intermediate models because their work is more deterministic and less open-ended reasoning.
- Operational agents (docs, records, tests, code helpers) use the cheapest adequate models to control cost.
- Jules Executor uses its own adapter-managed model.

## Routing

- Product, permission, credential, cost, risk, or irreconcilable conflict decisions escalate to the human.
- Execution issues route to Jules Executor unless a narrower operator is a better fit.
- Review gates route to Reviewer, Tester, DevOps Manager, or Git Manager based on the blocker class.
