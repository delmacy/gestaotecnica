# Codex Phase Thread Protocol

## Purpose

Keep Codex/Jules supervision fast, auditable, and bounded by phase. Long-lived
threads accumulate obsolete status, repeated heartbeat output, and stale
decisions. From now on, each execution phase should have one active Codex thread
that owns the heartbeat, sprint closeout checks, and user-facing decisions for
that phase.

This protocol is not a Jules task. It is conversation and supervision hygiene for
Codex.

## Operating Rule

One active phase equals one active Codex thread.

- The active phase thread receives the `monitor-jules-opencode-supervisor`
  heartbeat.
- The phase thread supervises only the current phase/sprint and its direct
  closeout.
- When a new phase starts, open or hand off to a new Codex thread and retarget
  the same heartbeat automation to that new thread.
- The previous phase thread remains an audit trail. It should not keep receiving
  recurring heartbeat messages after handoff.

## Roles

- Codex owns planning, gatekeeping, GitHub/Jules/Governor verification, phase
  closeout review, and heartbeat handoff.
- Jules remains the executor for repository work, fixes, tests, migrations,
  docs, CI/CD log handling, GitHub operations, and repository artifacts.
- OpenCode Governor may recommend hold, continue, predictive preview, or release,
  but Codex must verify the recommendation against `state/state.json`, Jules,
  GitHub, and the policy gates before accepting it.

## Handoff Trigger

Start a new phase thread when all are true:

- The active sprint or phase is terminal-clean, or the user explicitly starts a
  new phase.
- There are no pending `ready`, `jules_running`, `pr_open`, review, question, or
  merge-gate items from the previous phase unless they are intentionally carried
  forward as named blockers.
- Codex has recorded a closeout decision: release, hold, corrective sprint, or
  user decision needed.
- The next phase has a clear objective or sprint plan.

Do not create duplicate Jules sessions during handoff. Do not restart
`paperclip-app` as part of this protocol.

## Required Handoff Summary

Before retargeting the heartbeat, leave a short handoff summary in the current
thread or the new phase thread:

```text
Phase:
Thread purpose:
Automation id: monitor-jules-opencode-supervisor
Server/env: C:\Users\admin\Documents\jules_bug\.env
Orchestrator: /opt/delmacy/system-builder-orchestrator
Active sprint:
Current task:
Current PR:
Current Jules session:
State/log evidence:
Last GitHub/Jules verification:
Blockers or carry-forward items:
Next heartbeat action:
```

Keep this summary factual and current. Do not paste the full old conversation.

## Heartbeat Behavior

Every heartbeat should:

- Read `state/state.json`, `logs/heartbeat.log`,
  `logs/governor-decisions.jsonl`, and `logs/jules-questions.jsonl`.
- Verify that any local repo branch/worktree used by Codex for review,
  documentation, or corrective changes is synchronized with `origin/main`
  before edits or release decisions. If the branch is stale or cannot
  fast-forward, report the blocker instead of continuing from stale state.
- Compare the active sprint/phase in state with the thread purpose.
- Run `python3 scripts/supervisor.py flow-heartbeat` only when it is safe and no
  recent lock is active.
- Report only material changes, blockers, PRs, questions, mismatches, and next
  actions.
- Use `DONT_NOTIFY` for routine healthy progress.
- Use `NOTIFY` when there is a blocker, a governor decision mismatch, an
  unhandled Jules question, a low-rhythm exception, a phase closeout decision, or
  a required thread handoff.

When a phase handoff is needed, the heartbeat should prepare or request the new
Codex thread, then update the automation target to the new thread id. If the
thread tool is unavailable in that run, notify the user with the handoff summary
and wait for the new thread id.

## Automation Update Rule

Retarget the existing automation instead of creating another recurring monitor.

Keep these fields unless the user explicitly changes them:

```text
id: monitor-jules-opencode-supervisor
kind: heartbeat
name: Monitor Jules/OpenCode supervisor
status: ACTIVE
rrule: FREQ=HOURLY;INTERVAL=2
```

Only `targetThreadId` and the prompt content should change during phase thread
handoff.

## Closeout Checklist

Before releasing the next phase or retargeting heartbeat ownership, verify:

- The local repo branch/worktree has fetched `origin/main` and is either on the
  expected branch with a known base SHA or explicitly documented as stale.
- Jules sessions are not duplicated and match the state file.
- GitHub PR status, checks, comments, reviews, and merge state match local state.
- OpenCode review is present for relevant PRs.
- Governor decisions are compatible with Codex policy.
- Future sprint tasks remain `planned_gated` until the active phase is closed.
- Any corrective work is explicit and scoped.

If the closeout is not clean, keep the current phase thread active and record the
reason.
