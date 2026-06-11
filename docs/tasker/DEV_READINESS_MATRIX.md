# Development Readiness Matrix

Esta matriz avalia individualmente a prontidão dos módulos para desenvolvimento de código, separando a plataforma agnóstica dos casos de uso reais de clientes (conforme DEC-SB-001).

| module | depends_on | can_use_synthetic_data | requires_real_sources | requires_database | requires_runtime | status | reason | next_action |
|---|---|---|---|---|---|---|---|---|
| DEV-READINESS-BUILDER-SHELL-001 | UI_CONTRACT_SHELL | true | false | false | false | DONE | Shell pode ser implementado como layout/plataforma visual com dados sintéticos, sem autenticação real, sem RBAC real, sem banco, sem runtime e sem fontes reais. | Implementação e revisão concluídas |
| DEV-REVIEW-BUILDER-SHELL-001 | DEV-BUILDER-SHELL-001 | true | false | false | false | DONE | Revisão do código do Builder Shell concluída com sucesso. | Passar para o próximo módulo. |
| DEV-READINESS-TASKER-BOARD-001 | UI_CONTRACT_TASKER | true | false | false | false | DONE | Tasker Board implementado como UI de coordenação usando mock data local. | Implementação e revisão do Tasker Board concluídas |
| DEV-REVIEW-TASKER-BOARD-001 | DEV-TASKER-BOARD-001 | true | false | false | false | DONE | Revisão do código do Tasker Board concluída com sucesso. | Passar para o próximo módulo. |
| DEV-READINESS-CAPABILITY-EXPLORER-001 | UI_CONTRACT_CAPABILITY | true | false | false | false | READY_FOR_DEV_WITH_LIMITS | Capability Explorer pode ser implementado como UI de exploração do catálogo universal de capabilities com mock data local, sem banco, sem persistência real, sem edição real de Markdown, sem runtime, sem auth/RBAC real, sem instalação real de capability, sem alteração real de workspace e sem fontes reais. | Implementar UI com dados sintéticos |
| DEV-READINESS-REGISTRY-VIEW-001 | UI_CONTRACT_REGISTRY | true | false | false | false | DONE | Contratos e matrizes de paridade do Registry View foram criados e auditados. UI baseada em mock data desenvolvida. | Revisão da UI |
| DEV-REVIEW-REGISTRY-VIEW-001 | DEV-REGISTRY-VIEW-001 | true | false | false | false | DONE | Código do Registry View foi revisado estrutural e arquitetonicamente, testes aprovados. | Seguir para a próxima feature da plataforma (DOCS-VIEWER) |
| DEV-READINESS-PM-INTAKE-001 | UI_CONTRACT_PM | true | false | true | false | DONE | Contrato revisado e aprovado | Implementação concluída |
| DEV-REVIEW-PM-INTAKE-001 | DEV-PM-INTAKE-001 | true | false | false | false | DONE | Revisão do PM Intake concluída com sucesso. | Seguir para a próxima task (SOURCE-INTAKE-001). |
| DEV-READINESS-DOCS-VIEWER-001 | UI_CONTRACT_DOCS | true | false | false | false | DONE | Contratos e matrizes de paridade do Docs Viewer foram criados e auditados. UI baseada em mock data desenvolvida. | Revisão da UI |
| DEV-REVIEW-DOCS-VIEWER-001 | DEV-DOCS-VIEWER-001 | true | false | false | false | DONE | Revisão do código do Docs Viewer concluída com sucesso. | Seguir para a próxima task (PM-INTAKE-001). |
| DEV-READINESS-WORKFLOW-BUILDER-001 | UI_CONTRACT_WORKFLOW | true | false | true | false | NOT_READY | Contrato pendente | Planejar Workflow Builder |
| DEV-READINESS-RUNTIME-001 | RUNTIME_CONTRACT | false | false | true | true | NOT_READY | Contrato base do runtime pendente | Definir contrato de runtime |
| DEV-READINESS-GESTAO-TECNICA-001 | PM_PILOT_REAL_SOURCES | false | true | true | true | BLOCKED | Fontes reais e plataforma base indisponíveis | Aguardar REAL-SRC-002 e conclusão do Builder Shell |
