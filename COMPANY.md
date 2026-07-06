---
schema: agentcompanies/v1
kind: company
slug: system-builder-gestao-tecnica
name: System Builder / Gestao Tecnica Agent Company
description: GitHub-first agent company for developing System Builder and Gestao Tecnica.
version: 0.1.0
goals:
  - Develop System Builder and Gestao Tecnica through GitHub-native engineering workflows.
  - Keep Paperclip as the agent orchestration control plane.
  - Use GitHub Issues, Pull Requests, Actions, milestones, and Projects as the canonical technical work trail.
includes:
  - TEAM.md
  - PROJECT.md
  - AGENTS.md
  - SOUL.md
  - HEARTBEAT.md
  - TOOLS.md
  - SKILL.md
  - skills/github-first-system-builder/SKILL.md
---

# System Builder / Gestao Tecnica Agent Company

This company operates with GitHub as the technical source of truth and Paperclip as the agent orchestration layer. GitHub-first means canonical issues, branches, PRs, Actions, milestones, and Projects. It does not mean remote-first execution: workers pull locally, work locally, then push branches and PRs.

Codex is the governance interface to the human operator. OpenCode managers coordinate engineering operations. Cheap operational agents handle repeatable work. Jules is the preferred code executor.

Canonical operating model: `docs/operations/GITHUB_FIRST_AGENT_COMPANY.md`.
