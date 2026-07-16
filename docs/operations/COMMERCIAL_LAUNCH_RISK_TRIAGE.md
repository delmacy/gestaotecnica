# Commercial Launch Alpha Risk Triage

This document tracks known MVP, design-only, persistence, security, and workflow gaps, converting them into actionable launch classifications.

## Needs Decision

* RT-009: Human-decision Blockers (Awaiting human validation could block complex candidates)

## Risk Triage Table

| ID | Source | Description | Launch Classification | Rationale | Owner Role | Mitigation | Evidence | Follow-up Task |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| RT-001 | `deferred_gaps_V01.md` | Deferred Persistence (Process instances, mock data) | `launch_blocker` | Lack of persistence prevents executing real non-synthetic workflows, blocking core value. | Data / Persistence Team | Implement persistence logic for process instances | `process_instances` schema | Phase 17B expansion |
| RT-002 | `deferred_gaps_V01.md` | Row-Level Security (RLS) & Workspace Capability | `launch_blocker` | Missing `workspace_id` allows potential cross-tenant leaks, critical for commercial alpha. | Security & Architecture Team | Migrate schema to add `workspace_id` | Database migration logs | Data Isolation PRs |
| RT-003 | `deferred_gaps_V01.md` | Frontend Persistence-Configuration | `alpha_allowed` | Autosave in memory/localStorage is acceptable for early alpha but needs follow-up. | Frontend Platform Team | Clear frontend state appropriately | Local storage state | Backend API completion |
| RT-004 | `VERTICAL_PHASE_RISK_REGISTER.md` | CI (Build/test failures) | `alpha_allowed` | CI failures are standard development risks. | Engineering Lead | Rely on GitHub Actions checks | CI Logs | Maintain clean main branch |
| RT-005 | `VERTICAL_PHASE_RISK_REGISTER.md` | Vercel Rate Limits | `alpha_allowed` | Deploy limit blocks previews, but not microtask CI validation. | Platform Engineer | Use local testing and GA checks | CI Logs | Bypass preview blockers |
| RT-006 | `VERTICAL_PHASE_RISK_REGISTER.md` | PR Review Bottlenecks | `alpha_allowed` | Can stall pipeline but doesn't impact customer data. | Engineering Lead | Delegate to Reviewer agent | PR review history | Optimize Codex Governor |
| RT-007 | `VERTICAL_PHASE_RISK_REGISTER.md` | Duplicate Sessions (Agent conflicts) | `alpha_allowed` | Internal risk, doesn't break customer launch. | Engineering Lead | Strict agent boundaries | Commit history | Enforce domain rules |
| RT-008 | `VERTICAL_PHASE_RISK_REGISTER.md` | GitHub Verification | `alpha_allowed` | Missing `gh` CLI impacts agents, not launch value. | Platform Engineer | Rely on curl | Script logs | Ensure curl is available |
| RT-009 | `VERTICAL_PHASE_RISK_REGISTER.md` | Human-decision Blockers | `needs_decision` | Awaiting human validation could block complex candidates. | Product Manager | Mark blocked until addressed | Issue tracker | Propose changes and wait |
