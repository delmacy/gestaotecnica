# Backlog Operacional

O backlog foi replanejado (DEC-SB-001) para priorizar o desenvolvimento do System Builder como plataforma, utilizando dados sintéticos e adiando as validações de cliente real (Gestão Técnica) para um momento em que a plataforma esteja funcional.

## Grupo A — Plataforma Builder liberável agora

| ID | Módulo | Título | Tipo | Prioridade | Status |
|---|---|---|---|---|---|
| BUILDER-SHELL-001 | ui | Planejar shell principal do System Builder | architecture | high | done |
| DEV-READINESS-BUILDER-SHELL-001 | tasker | Auditar prontidão para desenvolvimento do Builder Shell | architecture | high | done |
| DEV-BUILDER-SHELL-001 | ui | Desenvolver interface do Builder Shell (com mock data) | implementation | high | done |
| DEV-REVIEW-BUILDER-SHELL-001 | ui | Revisar implementação do Builder Shell | architecture | high | done |
| TASKER-BOARD-001 | ui | Preparar Tasker Board para desenvolvimento | architecture | high | done |
| DEV-READINESS-TASKER-BOARD-001 | tasker | Auditar prontidão para desenvolvimento do Tasker Board | architecture | high | done |
| DEV-TASKER-BOARD-001 | ui | Desenvolver interface do Tasker Board (com mock data e limites) | implementation | high | done |
| DEV-REVIEW-TASKER-BOARD-001 | tasker | Revisar implementação do Tasker Board | architecture | high | done |
| CAPABILITY-EXPLORER-001 | ui | Preparar Capability Explorer para desenvolvimento | architecture | high | ready |
| REGISTRY-VIEW-001 | ui | Preparar Registry read-only | architecture | medium | backlog |
| DOCS-VIEWER-001 | ui | Preparar visualizador de docs/workboards | architecture | medium | backlog |
| PM-INTAKE-001 | ui | Preparar Process Mirroring Intake | architecture | high | backlog |
| SOURCE-INTAKE-001 | ui | Preparar Source Inventory / Evidence Intake | architecture | medium | backlog |
| GAP-TRACKER-001 | ui | Preparar Gap Tracker | architecture | medium | backlog |
| AS-IS-MIRROR-001 | ui | Preparar As-Is Mirror Board | architecture | medium | backlog |
| UI-CONTRACTS-VIEWER-001 | ui | Preparar visualizador de contratos de UI | architecture | medium | backlog |

## Grupo B — Plataforma Builder com design/contrato antes de código

| ID | Módulo | Título | Tipo | Prioridade | Status |
|---|---|---|---|---|---|
| FORM-BUILDER-001 | ui | Planejar Form Builder | contract | high | backlog |
| VIEW-BUILDER-001 | ui | Planejar View Builder | contract | high | backlog |
| WORKFLOW-BUILDER-001 | ui | Planejar Workflow Builder | contract | high | backlog |
| GOVERNANCE-MATRIX-001 | ui | Planejar Role/Permission Matrix | contract | medium | backlog |
| OPERATOR-GUIDE-001 | ui | Planejar Operator Guide | contract | medium | backlog |
| ENTERPRISE-MAP-001 | ui | Planejar Enterprise Map | contract | medium | backlog |

## Grupo C — Runtime e integrações futuras

| ID | Módulo | Título | Tipo | Prioridade | Status |
|---|---|---|---|---|---|
| RUNTIME-CONTRACT-001 | runtime | Refinar contrato de runtime | contract | medium | backlog |
| EVENT-RECEIPT-001 | runtime | Refinar modelo de eventos/recibos | contract | medium | backlog |
| INTEGRATION-CONTRACT-001 | integrations | Refinar contrato de webhooks/n8n | contract | medium | backlog |
| API-GATEWAY-FUTURE-001 | integrations | Registrar API Gateway como futuro, não imediato | contract | medium | backlog |

## Grupo D — Cliente Gestão Técnica / fontes reais / piloto real

| ID | Módulo | Título | Tipo | Prioridade | Status |
|---|---|---|---|---|---|
| REAL-SRC-002 | process_mirroring | Receber fontes reais anonimizadas | documentation | high | blocked |
| CAP-VAL-002 | capabilities | Validar capabilities no piloto real | contract | high | blocked |
| GT-PILOT-001 | process_mirroring | Planejar Gestão Técnica como primeiro cliente | architecture | medium | blocked |
| GT-RUNTIME-001 | runtime | Desenvolver processo real da Gestão Técnica | implementation | medium | blocked |

---
## Histórico (Concluídas/Antigas)
*(Tasks antigas preservadas para rastreabilidade)*
| ID | Módulo | Título | Status |
|---|---|---|---|
| DOC-002 | doc | Revisar segunda rodada documental | done |
| TASKER-001 | tasker | Validar fluxo de transição de tasks | done |
| PM-PILOT-001 | process_mirroring | Selecionar processo piloto | done |
| PM-PILOT-002 | process_mirroring | Capturar fontes e observações piloto | review |
| PM-PILOT-003 | process_mirroring | Validar espelho e gaps piloto | done |
| CAP-VAL-001 | capabilities | Revisar fronteiras das 24 capabilities | done |
| UI-CON-001 | ui | Refinar contratos de superfícies prioritárias | review |
| REAL-SRC-001 | process_mirroring | Preparar pacote de coleta de fontes reais | done |
| EA-PILOT-001 | enterprise_architecture | Criar mapas do piloto | backlog |
| GOV-PILOT-001 | governance | Validar papéis e SoD do piloto | backlog |
| ENA-PILOT-001 | enablement | Criar guia e checklist piloto | backlog |
| DEV-READINESS-001 | tasker | Auditar prontidão para execução futura | blocked |
