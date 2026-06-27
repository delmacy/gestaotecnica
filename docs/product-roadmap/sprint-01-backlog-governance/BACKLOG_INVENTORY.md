# Inventário de Backlog e PRs

Este documento consolida o estado real do backlog e branchs existentes, mapeando-os para o novo modelo de tasks `SB-*`.

| Item | Fonte | Estado Real | Duplicidade | Substituto | Risco |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Canonical Event Contract | branch `feat/canonical-events-contract-*` | In Progress | Sim | SB-S02-T06 | Baixo |
| Canonical Event Writer | branch `feat/platform/canonical-event-*` | In Progress | Sim | SB-S02-T07 | Médio (Idempotência) |
| Workforce Clean Rebuild | branch `feat/workforce-module-clean-rebuild` | In Progress | Sim | SB-S06-T26 | Baixo |
| Inventory Clean Rebuild | branch `feature/inventory-module-rebuild-*` | In Progress | Sim | SB-S06-T27 | Baixo |
| Approval Workflow Rebuild | branch `feat/approval-workflow-clean-rebuild` | In Progress | Sim | SB-S06-T28 | Baixo |
| Case Management Rebuild | branch `feat/case-management-clean-rebuild-*` | In Progress | Sim | SB-S07-T33 | Baixo |
| Scheduling Contracts | branch `feat/scheduling-contracts-wave-02-*` | In Progress | Sim | SB-S07-T32 | Médio (Validação) |
| Reporting Module Refinement | branch `feature/reporting-module-refinement-*` | In Progress | Sim | SB-S07-T34 | Baixo |
| Universal Assets Module | branch `feature/universal-assets-module-*` | Merged (#328) | Sim | SB-S06-T27 | Baixo |
| Documents Consolidation | branch `jules/documents-consolidation-*` | In Progress | Sim | SB-S06-T27 | Baixo |
| Global Work Board (1-52) | `docs/GLOBAL_WORK_BOARD.md` | Superseded | Sim | Roadmap SB-* | Baixo |
| Master Plan Phases | `docs/00-current/PLANO_MESTRE_PROXIMAS_FASES.md` | Superseded | Sim | Roadmap SB-* | Baixo |
| Work Board Tasks | `docs/00-current/WORK_BOARD.md` | Superseded | Sim | Roadmap SB-* | Baixo |
| Multi-tenant Isolation Audit | branch `multi-tenant-isolation-suite-*` | In Progress | Sim | SB-S09-T44 | Alto (Segurança) |
| Boundary Review Audit | branch `ops/wave-02-boundary-review-*` | In Progress | Sim | SB-S01-T04 | Baixo |

## Observações
- A maioria das branches ativas de "clean rebuild" de módulos agora deve ser consolidada sob os IDs da Sprint 06 e 07.
- O `GLOBAL_WORK_BOARD.md` e o `WORK_BOARD.md` legado estão formalmente substituídos pelo `TASK_INDEX.md`.
- Nenhuma task relevante ficou sem classificação.
- Estado derivado de análise de branches remotas e logs de commit.
