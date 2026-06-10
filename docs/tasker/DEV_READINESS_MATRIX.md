# Development Readiness Matrix

Esta matriz avalia individualmente a prontidão dos módulos para desenvolvimento de código, separando a plataforma agnóstica dos casos de uso reais de clientes (conforme DEC-SB-001).

| module | depends_on | can_use_synthetic_data | requires_real_sources | requires_database | requires_runtime | status | reason | next_action |
|---|---|---|---|---|---|---|---|---|
| DEV-READINESS-BUILDER-SHELL-001 | UI_CONTRACT_SHELL | true | false | false | false | READY_FOR_READINESS_REVIEW | Contrato criado em BUILDER_SHELL.md, aguarda auditoria para liberar dev | Auditoria de prontidão e autorização para código |
| DEV-READINESS-TASKER-BOARD-001 | UI_CONTRACT_TASKER | true | false | true | false | NOT_READY | Contrato pendente | Planejar Tasker Board |
| DEV-READINESS-CAPABILITY-EXPLORER-001 | UI_CONTRACT_CAPABILITY | true | false | false | false | NOT_READY | Contrato pendente | Planejar Capability Explorer |
| DEV-READINESS-PM-INTAKE-001 | UI_CONTRACT_PM | true | false | true | false | NOT_READY | Contrato pendente | Planejar PM Intake |
| DEV-READINESS-DOCS-VIEWER-001 | UI_CONTRACT_DOCS | true | false | false | false | NOT_READY | Contrato pendente | Planejar Docs Viewer |
| DEV-READINESS-WORKFLOW-BUILDER-001 | UI_CONTRACT_WORKFLOW | true | false | true | false | NOT_READY | Contrato pendente | Planejar Workflow Builder |
| DEV-READINESS-RUNTIME-001 | RUNTIME_CONTRACT | false | false | true | true | NOT_READY | Contrato base do runtime pendente | Definir contrato de runtime |
| DEV-READINESS-GESTAO-TECNICA-001 | PM_PILOT_REAL_SOURCES | false | true | true | true | BLOCKED | Fontes reais e plataforma base indisponíveis | Aguardar REAL-SRC-002 e conclusão do Builder Shell |
