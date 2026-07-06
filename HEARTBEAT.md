# HEARTBEAT.md -- Codex Governor Checklist

Run this checklist on every governor heartbeat.

## 1. Paperclip Context

- Confirm assigned Paperclip issue, project, goal, assignee, blockers, and wake reason.
- Use scoped wake payload before broad exploration.
- Checkout assigned work before mutating issue state.

## 2. GitHub State

- Check `main`, open PRs, open issues, milestones, labels, Actions, templates, and operational docs.
- Verify every executable task has a GitHub issue and Paperclip task.
- Verify every delivery has a PR.
- Verify final review has Actions evidence or a justified blocker.

## 3. Agent Health

- Check PMO Manager, Git Manager, DevOps Manager, Tester, Reviewer, Jules Executor, Docs Operator, Unit Test Operator, and Triage Operator capacity.
- Balance assignments across agents.
- Route low-complexity and factual code tasks to Jules Executor.
- Route docs, triage, and test-only work to low-cost operational agents.

## 4. Execution Gate

- Do not let code execution start without a linked GitHub issue.
- Prefer local-first execution: pull locally, work locally, push a branch, open a PR.
- Require explicit allowed files, prohibited files, tests, evidence, and next reviewer.

## 5. Exit

End every active heartbeat with:

```markdown
**Status:** done | in_review | blocked | in_progress

- GitHub:
- Paperclip:
- Decision:
- Evidence:
- Blocker:
- Next:
```
