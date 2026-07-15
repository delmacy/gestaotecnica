# Phase Handoff Index

## Purpose

This is the live handoff index for Codex/Jules phase work. It keeps the next
phase thread from depending on a long chat history or stale temporary reports.

Use this file with `docs/operations/CODEX_PHASE_THREAD_PROTOCOL.md`.

## Current Phase Thread Contract

- One active phase uses one active Codex thread.
- The active thread owns heartbeat supervision until phase closeout is complete.
- At phase closeout, Codex records a short handoff summary and retargets the
  `monitor-jules-opencode-supervisor` heartbeat to the next phase thread.
- Do not create a Jules task just to manage Codex thread handoff.

## Canonical Operational Docs

- `docs/operations/CODEX_PHASE_THREAD_PROTOCOL.md` - phase/thread handoff rules.
- `docs/operations/OPERATOR_RUNBOOK.md` - deploy, backup, restore, incident, and
  support operator procedures.
- `docs/operations/required-checks.md` - mandatory merge evidence and Vercel
  preview exception policy.
- `docs/operations/vercel-hourly-deploy.md` - production deploy workflow and
  hourly deployment guardrail.
- `docs/operations/VERTICAL_PHASE_RISK_REGISTER.md` - current vertical-phase risk
  assumptions.

## Handoff Record Template

Append or replace this block when Codex closes a phase or starts a new one:

```text
Phase:
Thread purpose:
Automation id: monitor-jules-opencode-supervisor
Target thread id:
Active sprint:
Current task:
Current PR:
Current Jules session:
State/log evidence:
GitHub evidence:
Jules evidence:
OpenCode review evidence:
Blockers or carry-forward items:
Next heartbeat action:
Last updated:
```

## Current Handoff Record

```text
Phase: V-01 vertical implementation
Thread purpose: supervise Jules/OpenCode governor execution and phase closeout
Automation id: monitor-jules-opencode-supervisor
Target thread id: 019f3737-6332-7c80-b8f7-5640a38279bb
Active sprint: verify in state/state.json.sprintPlan during heartbeat
Current task: verify in state/state.json tasks during heartbeat
Current PR: verify on GitHub during heartbeat
Current Jules session: verify with Jules API during heartbeat
State/log evidence: state/state.json, logs/heartbeat.log,
  logs/governor-decisions.jsonl, logs/jules-questions.jsonl
GitHub evidence: PR status, checks, reviews, comments, merge state
Jules evidence: session status, questions, PR creation state
OpenCode review evidence: heartbeat/OpenCode review records
Blockers or carry-forward items: none recorded in this index
Next heartbeat action: continue current phase thread until phase closeout, then
  create or request a new phase thread and retarget the heartbeat
Last updated: 2026-07-15
```

## Cleanup Rule

Keep live operating docs in this directory. Remove or archive one-off bootstrap
reports, stale inventories, and temporary evidence files once their decisions are
reflected in the canonical docs above.
