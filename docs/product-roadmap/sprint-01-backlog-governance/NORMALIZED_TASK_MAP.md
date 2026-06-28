# Mapa de Tarefas Normalizado — Sprint 01

Este documento estabelece o mapeamento determinístico entre artefatos legados, o inventário da T01 e o catálogo oficial de 50 tasks.

## Tabela de Mapeamento

| normalized_id | candidate_id | origin_id | artifact_type | title | canonical_url_or_path | normalized_state | logical_owner | predecessor_ids | successor_ids | related_ids | duplicate_of | superseded_by | source_inventory_state | evidence | normalization_reason | risk | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SB-S01-T00 | N/A | PR #356 | pr | SB-S01-T00 — Preparar fontes e modelo verificável do inventário (v2) | https://github.com/delmacy/gestaotecnica/pull/356 | merged | governance | N/A | SB-S01-T01 | N/A | N/A | N/A | integrated | Merge commit 3b516cf | Task concluída e integrada. | low | Fundação da governança. |
| SB-S01-T01 | N/A | PR #358 | pr | SB-S01-T01 — Inventariar backlog e PRs existentes v2 | https://github.com/delmacy/gestaotecnica/pull/358 | merged | governance | SB-S01-T00 | SB-S01-T02, SB-S01-T03 | N/A | N/A | N/A | pending | Commits 2a0c390 a 544b65b na main | Integrado via commits diretos na main. | low | Inventário base para a T02. |
| SB-S01-T02 | N/A | task/sb-s01-t02 | branch | SB-S01-T02 — Normalizar IDs, estados e dependências | docs/product-roadmap/sprint-01-backlog-governance/NORMALIZED_TASK_MAP.md | in_progress | governance | SB-S01-T01 | SB-S01-T04 | SB-S01-T03 | N/A | N/A | N/A | Branch ativa | Task em execução atual. | low | Esta task. |
| SB-S01-T03 | N/A | unmapped | task | Criar validador do catálogo de tasks | docs/product-roadmap/TASK_INDEX.md | planned | governance | SB-S01-T01 | SB-S01-T04 | SB-S01-T02 | N/A | N/A | N/A | Catálogo oficial | Prevista no TASK_INDEX.md. | low | Pendente início. |
| SB-S01-T04 | N/A | unmapped | task | Auditar escopo e duplicidades | docs/product-roadmap/TASK_INDEX.md | planned | governance | SB-S01-T02, SB-S01-T03 | SB-S01-T05 | N/A | N/A | N/A | N/A | Catálogo oficial | Prevista no TASK_INDEX.md. | low | Pendente predecessores. |
| SB-S01-T05 | N/A | unmapped | task | Provar fluxo de descoberta pelo Jules | docs/product-roadmap/TASK_INDEX.md | planned | governance | SB-S01-T04 | SB-S02-T06 | N/A | N/A | N/A | N/A | Catálogo oficial | Prevista no TASK_INDEX.md. | low | Gate final da Sprint 01. |
| SB-S02-T06 | N/A | PR #344 | pr | feat: Canonical Event Contract and Event Writer (Clean Rebuild V2) | https://github.com/delmacy/gestaotecnica/pull/344 | merged | platform/events | SB-S01-T05 | SB-S02-T07, SB-S02-T08 | N/A | N/A | N/A | integrated | Merge commit 49451da | Entrega técnica da T06 confirmada. | low | Base para eventos. |
| unmapped | SB-S02-T07-C | PR #340 | pr | Canonical Event Contract and Event Writer | https://github.com/delmacy/gestaotecnica/pull/340 | closed-unmerged | platform/events | SB-S02-T06 | N/A | N/A | N/A | PR #344 | pending | GitHub closed state | Trabalho reaproveitável mas superado pela V2 (#344). | low | Código fechado. |
| SB-S03-T11 | N/A | Issue #345 | issue | Task: Workspace Onboarding and Tenant Administration | https://github.com/delmacy/gestaotecnica/issues/345 | ready | platform/core | SB-S02-T10 | SB-S03-T12 | N/A | N/A | N/A | open | Issue GitHub | Mapeada para o planejamento da Sprint 03. | medium | Requer Sprint 02 completa. |
| SB-S04-T16 | N/A | Issue #346 | issue | Task: Capability Installation and Module Manifest Runtime | https://github.com/delmacy/gestaotecnica/issues/346 | ready | platform/capabilities | SB-S02-T10, SB-S03-T15 | SB-S04-T17 | N/A | N/A | N/A | open | Issue GitHub | Mapeada para o planejamento da Sprint 04. | medium | Depende de Onboarding (S03). |
| SB-S05-T21 | N/A | Issue #347 | issue | Task: Builder Process Configuration and Draft Publishing | https://github.com/delmacy/gestaotecnica/issues/347 | ready | platform/builder | SB-S04-T20 | SB-S05-T22 | N/A | N/A | N/A | open | Issue GitHub | Mapeada para o planejamento da Sprint 05. | medium | Depende de Capabilities (S04). |
| SB-S06-T26 | N/A | Issue #348 | issue | Task: Commercial Vertical Integration (Workforce/Scheduling/Cases/Approval) | https://github.com/delmacy/gestaotecnica/issues/348 | ready | modules/workforce | SB-S02-T10, SB-S04-T20 | SB-S06-T29 | N/A | N/A | N/A | open | Issue GitHub | Parte da Issue #348 mapeia para S06 (Módulos). | high | Escopo amplo na issue original. |
| SB-S06-T26 | N/A | PR #334 | pr | Implement Human Resources Module (Isolated) | https://github.com/delmacy/gestaotecnica/pull/334 | merged | modules/workforce | N/A | SB-S06-T29 | SB-S06-T27 | N/A | N/A | integrated | Merge commit 9ce1018 | Workforce (HR) consolidado sob isolamento. | low | Já integrado. |
| SB-S06-T27 | N/A | PR #336 | pr | Rebuild Inventory Module with Workspace Isolation | https://github.com/delmacy/gestaotecnica/pull/336 | closed-unmerged | modules/inventory | N/A | SB-S06-T29 | N/A | N/A | N/A | pending | GitHub closed state | Trabalho de inventory isolado pendente de re-execução. | medium | Código legível e aproveitável. |
| SB-S06-T28 | N/A | Issue #339 | issue | Task: Approval Workflow Clean Rebuild | https://github.com/delmacy/gestaotecnica/issues/339 | ready | modules/approvals | SB-S02-T10 | SB-S06-T29 | N/A | N/A | N/A | open | Issue GitHub | Mapeada diretamente para S06-T28. | medium | Pendente execução oficial. |
| SB-S06-T28 | N/A | PR #332 | pr | Approval Workflow Module Consolidation | https://github.com/delmacy/gestaotecnica/pull/332 | closed-unmerged | modules/approvals | N/A | N/A | N/A | N/A | N/A | pending | GitHub closed state | Trabalho prévio para aprovações. | medium | Reaproveitável na T28. |
| SB-S06-T28 | N/A | PR #342 | pr | Clean Rebuild: Approval Workflow Module | https://github.com/delmacy/gestaotecnica/pull/342 | closed-unmerged | modules/approvals | N/A | N/A | N/A | N/A | N/A | pending | GitHub closed state | Tentativa de rebuild do workflow de aprovação. | medium | Reaproveitável. |
| SB-S08-T36 | N/A | Issue #349 | issue | Task: Typed Persistence Promotion Framework | https://github.com/delmacy/gestaotecnica/issues/349 | ready | platform/persistence | SB-S06-T30, SB-S07-T35 | SB-S08-T37 | N/A | N/A | N/A | open | Issue GitHub | Mapeada para planejamento da Sprint 08. | high | Depende de estabilidade dos módulos. |
| unmapped | SB-S08-T36-C | Issue #312 | issue | TASK-SB-PHASE-2-SCHEMA-CI-002: Active Phase 2 persistence gate | https://github.com/delmacy/gestaotecnica/issues/312 | superseded | platform/core | N/A | N/A | SB-S08-T36 | N/A | SB-S08-T36 | open | Issue GitHub | Substituída pela abordagem de persistência tipada da S08. | low | Antigo modelo de fases. |
| SB-S09-T41 | N/A | Issue #350 | issue | Task: Production Observability, Audit and Incident Readiness | https://github.com/delmacy/gestaotecnica/issues/350 | ready | platform/observability | SB-S02-T10, SB-S08-T40 | SB-S09-T44 | N/A | N/A | N/A | open | Issue GitHub | Mapeada para S09. | medium | Depende de persistência e eventos. |
| SB-S10-T46 | N/A | Issue #351 | issue | Task: Backup, Restore and Deployment Reproducibility | https://github.com/delmacy/gestaotecnica/issues/351 | ready | platform/deployment | SB-S07-T35, SB-S09-T45 | SB-S10-T47 | N/A | N/A | N/A | open | Issue GitHub | Mapeada para S10. | high | Finalização comercial. |
| unmapped | N/A | PR #343 | pr | Wave 02 Recovery, PR Cleanup and Repository Organization | https://github.com/delmacy/gestaotecnica/pull/343 | ready | governance | N/A | SB-S01-T01 | SB-S01-T04 | N/A | N/A | pending | PR Aberto | PR de limpeza e organização pendente. | low | Administrativo. |
| unmapped | N/A | PR #354 | pr | docs: expand Sprint 01 into executable task contracts | https://github.com/delmacy/gestaotecnica/pull/354 | ready | governance | SB-S01-T01 | SB-S01-T05 | N/A | N/A | N/A | pending | PR Aberto | Expansão documental da Sprint 01. | low | Em revisão. |
| unmapped | N/A | PR #333 | pr | Multi-tenant Isolation Test Suite & Audit Report | https://github.com/delmacy/gestaotecnica/pull/333 | merged | platform/core | N/A | SB-S06-T30 | N/A | N/A | N/A | integrated | Merge commit 9c3f3b8 | Testes de isolamento integrados. | low | Referência para testes multi-tenant. |
| unmapped | N/A | PR #338 | pr | Clean Rebuild: Case Management Module (Verified & Isolated) | https://github.com/delmacy/gestaotecnica/pull/338 | merged | modules/cases | N/A | unmapped | N/A | N/A | N/A | integrated | Merge commit 37bdf38 | Casos de uso consolidados e integrados. | low | Já em produção. |
| unmapped | N/A | PR #337 | pr | Scheduling Contracts (Refined & Validated) | https://github.com/delmacy/gestaotecnica/pull/337 | merged | modules/scheduling | N/A | unmapped | N/A | N/A | N/A | integrated | Merge commit bd5045a | Contratos de escala integrados. | low | Base para scheduling. |
| unmapped | N/A | PR #330 | pr | Wave 02 Boundary Review Audit Report | https://github.com/delmacy/gestaotecnica/pull/330 | merged | platform/core | N/A | SB-S01-T04 | N/A | N/A | N/A | integrated | Merge commit 1774187 | Auditoria técnica integrada. | low | Insumo para Sprint Review. |
| unmapped | N/A | PR #323 | pr | Consolidation of Reporting Module | https://github.com/delmacy/gestaotecnica/pull/323 | merged | modules/assets | N/A | unmapped | N/A | N/A | N/A | integrated | Merge commit 1828409 | Relatórios legados consolidados. | low | Funcionalidade isolada. |
| unmapped | N/A | PR #324 | pr | Implement Generic Work Intake Module | https://github.com/delmacy/gestaotecnica/pull/324 | merged | platform/builder | N/A | unmapped | N/A | N/A | N/A | integrated | Merge commit fcff664 | Entrada de trabalho consolidada. | low | Funcionalidade isolada. |
| unmapped | N/A | PR #328 | pr | Consolidação do Módulo Universal de Ativos | https://github.com/delmacy/gestaotecnica/pull/328 | merged | modules/assets | N/A | unmapped | N/A | N/A | N/A | integrated | Merge commit 7db8851 | Ativos integrados. | low | Funcionalidade isolada. |
| unmapped | N/A | docs/restore-roadmap-execution-context | branch | Restore Roadmap Execution Context | https://github.com/delmacy/gestaotecnica/tree/docs/restore-roadmap-execution-context | merged | governance | N/A | SB-S01-T01 | N/A | N/A | N/A | integrated | Linked PR #357 | Restauração de arquivos de roadmap. | low | Contexto restaurado. |
| unmapped | N/A | docs/roadmap-50-tasks-sprints | branch | 50 Tasks Roadmap | https://github.com/delmacy/gestaotecnica/tree/docs/roadmap-50-tasks-sprints | ready | governance | N/A | SB-S01-T01 | N/A | N/A | N/A | pending | Linked PR #354 | Documentação central de 50 tasks. | low | Base do catálogo. |
| unmapped | N/A | feat/approval-workflow-clean-rebuild | branch | Approval Workflow Clean Rebuild | https://github.com/delmacy/gestaotecnica/tree/feat/approval-workflow-clean-rebuild | ready | modules/approvals | N/A | SB-S06-T28 | N/A | N/A | N/A | pending | Linked PR #342 | Branch com código aproveitável para T28. | medium | Requer rebase/ajustes. |
| unmapped | N/A | feat/sb-s01-t01-backlog-inventory-5277845245308862127 | branch | Backlog Inventory T01 (V1) | https://github.com/delmacy/gestaotecnica/tree/feat/sb-s01-t01-backlog-inventory-5277845245308862127 | superseded | governance | N/A | N/A | SB-S01-T01 | N/A | SB-S01-T01 (V2) | pending | Linked PR #353 | Superado pela V2 correta. | low | Arquivo morto. |
| unmapped | N/A | ARCHITECTURE_CONTEXT.md | doc | Global Architectural Context | docs/product-roadmap/ARCHITECTURE_CONTEXT.md | merged | platform/core | N/A | SB-S01-T02 | N/A | N/A | N/A | integrated | Arquivo na main | Documento mestre de arquitetura. | low | Ativo. |
| unmapped | N/A | EXECUTION_RULES.md | doc | Deterministic Execution Rules | docs/product-roadmap/EXECUTION_RULES.md | merged | governance | N/A | SB-S01-T02 | N/A | N/A | N/A | integrated | Arquivo na main | Regras de conduta e execução. | low | Ativo. |
| unmapped | N/A | TASK_INDEX.md | doc | Task Index (50 tasks) | docs/product-roadmap/TASK_INDEX.md | merged | governance | N/A | SB-S01-T02 | N/A | N/A | N/A | integrated | Arquivo na main | Índice oficial de tarefas. | low | Ativo. |

## Resumo de Normalização

- **Total de itens analisados:** 37 (extraídos seletivamente do inventário T01 conforme regras da T02)
- **Itens com ID oficial (SB-*):** 14
- **Itens "unmapped":** 23
- **IDs candidatos propostos:** 2 (SB-S02-T07-C, SB-S08-T36-C)
- **Duplicidades:** 0 (consolidadas no mapeamento)
- **Itens "superseded":** 2 (Issue #312, branch sb-s01-v1)
- **Itens "closed-unmerged":** 4 (PR #340, PR #336, PR #332, PR #342)
- **Itens "investigar":** 0 (todas as classificações foram resolvidas com base no estado atual da `main`)
- **Dependências criadas:** 12 novas relações de predecessor/sucessor explícitas.

## Divergências corrigidas em relação à T01

1. **Estado do PR #358 / SB-S01-T01:** Confirmado como `merged` via commits diretos na `main` (544b65b), corrigindo o estado `open/pending` da T01.
2. **Owners Lógicos:** Donos individuais foram normalizados para domínios (ex: `modules/workforce`, `platform/core`, `platform/builder`).
3. **Estados Permitidos:** Uso estrito de `planned`, `ready`, `in_progress`, `merged`, `superseded`, `closed-unmerged`, `unmapped`.
4. **Mapeamento de Módulos:** Ativos, relatórios e intake foram mapeados para owners preferenciais (`modules/assets`, `platform/builder`).

## Limitações restantes

- Módulos consolidados na Wave 02 (Relatórios, Entrada de Trabalho, Ativos) permanecem como `unmapped` por não possuírem tasks de refino específicas nas 50 iniciais, embora o código esteja integrado.
- A Issue #348 (Vertical Comercial) possui um escopo que transborda a Sprint 06, exigindo quebras futuras em T31-T35.

## Dívida conhecida herdada da T01

- O inventário da T01 contém centenas de PRs mergeados legados que não foram trazidos para este mapa por não impactarem diretamente a execução das 50 tasks prioritárias.
- Algumas branches sem PR ativo podem conter código órfão não classificado; optou-se por mapear apenas branches vinculadas a issues ou PRs documentados.
