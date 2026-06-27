# Inventário de Backlog e PRs

Este documento consolida o estado real do backlog e branchs existentes, mapeando-os para o novo modelo de tasks `SB-*`.

| Item | Fonte | Estado Real | Duplicidade | Substituto | Risco |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Canonical Event Contract | branch `feat/canonical-events-contract-*` | In Progress | Sim | SB-S02-T06 | Baixo |
| Canonical Event Writer | branch `feat/platform/canonical-event-*` | In Progress | Sim | SB-S02-T07 | Médio (Idempotência) |
| Workforce Clean Rebuild | branch `feat/workforce-module-clean-rebuild` | In Progress | Sim | SB-S06-T26 | Baixo |
| Human Resources Module | branch `feature/human-resources-module-*` | In Progress | Sim | SB-S06-T26 | Baixo (Membros) |
| Inventory Clean Rebuild | branch `feature/inventory-module-rebuild-*` | In Progress | Sim | SB-S06-T27 | Baixo |
| Approval Workflow Rebuild | branch `feat/approval-workflow-clean-rebuild` | In Progress | Sim | SB-S06-T28 | Baixo |
| Case Management Rebuild | branch `feat/case-management-clean-rebuild-*` | In Progress | Sim | SB-S07-T33 | Baixo |
| Work Intake Module | branch `feature/work-intake-module-*` | In Progress | Sim | SB-S07-T31 | Baixo (Flow) |
| Scheduling Contracts | branch `feat/scheduling-contracts-wave-02-*` | In Progress | Sim | SB-S07-T32 | Médio (Validação) |
| Reporting Module Refinement | branch `feature/reporting-module-refinement-*` | In Progress | Sim | SB-S07-T34 | Baixo |
| Persistence Reconciliation | branch `docs/persistence-schema-reconciliation-*` | Planning | Sim | SB-S08-T36 | Baixo |
| Universal Assets Module | branch `feature/universal-assets-module-*` | Merged (#328) | Não | Baseline (Core) | Nenhum |
| Documents Consolidation | branch `jules/documents-consolidation-*` | In Progress | Sim | SB-S06 (Pendente ID) | Baixo |
| Global Work Board (1-52) | `docs/GLOBAL_WORK_BOARD.md` | Superseded | Sim | Roadmap SB-* | Baixo |
| Master Plan Phases | `docs/00-current/PLANO_MESTRE_PROXIMAS_FASES.md` | Superseded | Sim | Roadmap SB-* | Baixo |
| Work Board Tasks | `docs/00-current/WORK_BOARD.md` | Superseded | Sim | Roadmap SB-* | Baixo |
| Multi-tenant Isolation Audit | branch `multi-tenant-isolation-suite-*` | In Progress | Sim | SB-S09-T44 | Alto (Segurança) |
| Boundary Review Audit | branch `ops/wave-02-boundary-review-*` | In Progress | Sim | SB-S01-T04 | Baixo |

## Observações
- **Consolidação:** As branches de "clean rebuild" (Workforce, Inventory, Approval) estão mapeadas diretamente para a Sprint 06.
- **Integração:** Módulos de processo (Work Intake, Reporting, Cases) estão mapeados para a Sprint 07.
- **Baseline:** O módulo de Assets, por já estar mergeado, é considerado parte do baseline e não possui substituto futuro no roadmap de 50 tasks.
- **Gaps:** O módulo de Documents ainda não possui um ID específico no roadmap de 50 tasks, mas deve ser tratado na Sprint 06 como parte da infraestrutura de módulos.
- **HR:** O módulo de Human Resources foi identificado como dependência da task de Workforce (T26).
- **Persistence:** O planejamento de reconciliação de persistência foi mapeado para a Sprint 08.
- Nenhuma task relevante ficou sem classificação. Estado derivado de análise de branches remotas e logs de commit.
