# Builder Shell Navigation Matrix

Esta matriz define o mapeamento das rotas candidatas para o Builder Shell e seus respectivos status e dependências atuais.

| nav_item | route_candidate | module | persona_primary | status | depends_on | data_mode | blocked_by | next_task |
|---|---|---|---|---|---|---|---|---|
| Dashboard | `/builder` | Shell Core | Platform Admin | documented | BUILDER_SHELL | synthetic | None | Desenvolver Shell |
| Tasker | `/builder/tasker` | Tasker | Builder Architect | needs_contract | TASKER_BOARD | synthetic | None | TASKER-BOARD-001 |
| Capabilities | `/builder/capabilities` | Capabilities | Capability Architect | needs_contract | CAPABILITY_EXPLORER | synthetic | None | CAPABILITY-EXPLORER-001 |
| Registry | `/builder/registry` | Registry | Capability Architect | needs_contract | REGISTRY_VIEW | synthetic | None | REGISTRY-VIEW-001 |
| Process Mirroring | `/builder/process-mirroring` | Process Mirroring | Process Analyst | needs_contract | PROCESS_MIRROR_BOARD | synthetic | None | PM-INTAKE-001 |
| Docs | `/builder/docs` | Docs Viewer | Reviewer | needs_contract | DOCS_VIEWER | synthetic | None | DOCS-VIEWER-001 |
| UI Contracts | `/builder/ui-contracts` | UI Contracts | UX Architect | needs_contract | UI_CONTRACTS_VIEWER | synthetic | None | UI-CONTRACTS-VIEWER-001 |
| Settings | `/builder/settings` | Settings | Platform Admin | needs_contract | SHELL_SETTINGS | synthetic | None | Definir Settings |
| Workflow Builder | `/builder/workflows` | Workflow Builder | Builder Architect | future | WORKFLOW_BUILDER | synthetic | Roadmap | WORKFLOW-BUILDER-001 |
| Form Builder | `/builder/forms` | Form Builder | Builder Architect | future | FORM_BUILDER | synthetic | Roadmap | FORM-BUILDER-001 |
| View Builder | `/builder/views` | View Builder | UX Architect | future | VIEW_BUILDER | synthetic | Roadmap | VIEW-BUILDER-001 |
| Runtime | `/builder/runtime` | Runtime | Process Analyst | blocked | RUNTIME_CONTRACT | real_required | RUNTIME-001 | GT-RUNTIME-001 |
