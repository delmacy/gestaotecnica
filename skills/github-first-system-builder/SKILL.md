---
name: github-first-system-builder
description: Operate System Builder / Gestao Tecnica development through GitHub as the canonical technical system and Paperclip as the agent control plane.
---

# GitHub-First System Builder

Use this skill whenever an agent plans, executes, reviews, tests, or coordinates System Builder / Gestao Tecnica work.

## Rules

- Paperclip tasks coordinate agents; GitHub issues and pull requests are the technical source of truth.
- No code execution starts without a linked GitHub issue, unless the task is explicitly exploratory or docs-only.
- Every implementation ends in a pull request, a documented blocker, or a rejected/restarted branch.
- GitHub Actions are the primary validation evidence.
- Reviewer comments belong on the GitHub PR; Paperclip receives the summary and next action.
- Codex Governor is the final review gate and only human escalation interface.

## Required Task Shape

Each executable task must state:

- GitHub issue URL or issue number
- Workstream and owner
- Base branch and branch name
- Included scope and excluded scope
- Allowed and prohibited paths
- Contracts consumed or changed
- Required checks and evidence
- Rollback strategy
- Gate owner

## Escalation

Escalate to Codex only for product decisions, architecture decisions, missing permissions, missing credentials, irreconcilable conflicts, or cost/risk approval.
