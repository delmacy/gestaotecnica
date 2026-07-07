# SB-F0-T01: Backlog Reset Report

**Date**: 2026-07-07
**Owner**: Git Manager (DEL-107)
**Plan reference**: [DEL-106](/DEL/issues/DEL-106) — Plano System Builder restart limpo e governado

## Summary

Per the approved plan, all old GitHub Issues and Paperclip tasks from the pre-restart wave have been classified and closed. No old work unit remains open as an executable task.

## GitHub Issues Disposition

### Closed as superseded (this heartbeat)

| Issue | Title | Classification | Action |
|-------|-------|----------------|--------|
| [#370](https://github.com/delmacy/gestaotecnica/issues/370) | [BLOCKER] GitHub Projects v2 token permission | superseded | Closed with status/superseded label. Token blocker no longer relevant — pilot model replaced. |
| [#371](https://github.com/delmacy/gestaotecnica/issues/371) | Add GitHub-first agent company operating model | superseded | Issue + PR closed. Templates/CODEOWNERS infra can be recreated in new wave. Unmerged PR available as reference diff. |
| [#366](https://github.com/delmacy/gestaotecnica/issues/366) | SB-S02-T09 — Revisão de isolamento e append-only | superseded | Closed. PR #366 closed without merge. Findings should be re-captured in new F1 contracts if still relevant. |

### Previously closed as superseded (by Codex Governor)

| Issue | Title |
|-------|-------|
| [#375](https://github.com/delmacy/gestaotecnica/issues/375) | F1-T03: Auditoria completa do schema e migrations |
| [#374](https://github.com/delmacy/gestaotecnica/issues/374) | F1-T02: CI baseline — build e typecheck verdes |
| [#373](https://github.com/delmacy/gestaotecnica/issues/373) | F1-T01: Merge do modelo GitHub-first em main |
| [#369](https://github.com/delmacy/gestaotecnica/issues/369) | SB-GHF-003 GitHub / Paperclip Operating System pilot |
| [#368](https://github.com/delmacy/gestaotecnica/issues/368) | SB-GHF-002 Persistence / Multi-Tenancy gate definition |
| [#367](https://github.com/delmacy/gestaotecnica/issues/367) | SB-GHF-001 Quality / CI / Observability baseline |
| [#365](https://github.com/delmacy/gestaotecnica/issues/365) | SB-S02-T08: Transactional Batch Events (merged, PR closed) |
| [#364](https://github.com/delmacy/gestaotecnica/issues/364) | SB-S02-T08 — Lotes transacionais de eventos |
| [#363](https://github.com/delmacy/gestaotecnica/issues/363) | SB-S02-T07 — Idempotência concorrente de eventos |
| [#362](https://github.com/delmacy/gestaotecnica/issues/362) | SB-S01-T05 — Provar fluxo de descoberta pelo Jules |
| [#361](https://github.com/delmacy/gestaotecnica/issues/361) | SB-S01-T04 — Auditar escopo e duplicidades |
| [#360](https://github.com/delmacy/gestaotecnica/issues/360) | SB-S01-T03 — Criar validador do catálogo de tasks |
| [#359](https://github.com/delmacy/gestaotecnica/issues/359) | SB-S01-T02 — Normalizar IDs, estados e dependências |
| [#358](https://github.com/delmacy/gestaotecnica/issues/358) | SB-S01-T01 — Inventariar backlog e PRs existentes v2 |

### Remaining open (new F0 wave — correct)

| Issue | Title | Status |
|-------|-------|--------|
| [#376](https://github.com/delmacy/gestaotecnica/issues/376) | SB-F0-T01: Reconciliar restart limpo da DEL-106 | open (this issue) |
| [#377](https://github.com/delmacy/gestaotecnica/issues/377) | SB-F0-T02: Produzir contrato executavel da Fase 1 | open (blocked) |

### Milestone

- **SB GitHub-First Pilot** (milestone #2): Closed as superseded. All 7 issues closed (4 previously, 3 this heartbeat).

## Old Remote Branches

The following stale remote branches remain for historical reference. They are not blocked from cleanup but are harmless as-is:

| Branch | Associated Issue |
|--------|-----------------|
| `codex/github-first-agent-company` | #371 (closed) |
| `ops/agent-model-balance-DEL-50` | #372 (closed, merged) |
| `ops/issue-templates-DEL-71` | Old ops branch |
| `review/SB-S02-T09-isolation-append-only` | #366 (closed) |
| `task/DEL-84-plano-desenvolvimento` | DEL-84 |
| `task/sb-s01-t01-inventariar-backlog-prs-v2-*` | #358 (closed) |
| `task/sb-s02-t08-lotes-transacionais-eventos-*` | #364 (closed) |

## Paperclip Tasks Disposition

All old Paperclip tasks associated with the above issues were either closed or superseded by Codex Governor prior to this task.

Active Paperclip tasks in the new F0 wave:
- [DEL-107](/DEL/issues/DEL-107) — SB-F0-T01 (this task, done after this report)
- [DEL-108](/DEL/issues/DEL-108) — SB-F0-T02 (assigned to Reviewer)

## Gates Cleared

| Gate | Status |
|------|--------|
| Nenhuma GitHub Issue antiga permanece como unidade executavel | ✅ Cleared |
| Nenhuma Paperclip task antiga sera reutilizada | ✅ Cleared (all superseded by DEL-106 plan) |
| Backlog inventariado e classificado | ✅ Done this heartbeat |
| Relatorio de disposicao registrado | ✅ This document |

## Next Actions

1. Git Manager: Close [DEL-107](/DEL/issues/DEL-107) as done.
2. Reviewer: Continue [DEL-108](/DEL/issues/DEL-108) (SB-F0-T02) — produce executable F1 contract.
3. Codex Governor: Gate review of F0 completion before F1 wave begins.
