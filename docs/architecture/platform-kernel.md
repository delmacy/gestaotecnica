# Platform Kernel

## Objetivo

Provar o ciclo:

`Action -> Event -> Flow -> Action`

## Componentes

- Workspace Context
- Module Manifest
- Action Registry
- Action Runner
- Event Registry
- EventLog Service
- Flow Runner
- Integration Command Gateway
- Outbox inicial persistente

## Regra central

Módulos expõem actions.

Actions emitem events.

Flows reagem a events.

Flows chamam actions.

Integrações externas chamam actions via API.

## Implementação inicial

Actions iniciais:

- `work_items.create`
- `work_items.transition`
- `service_orders.create`
- `service_orders.complete`
- `notifications.send`
- `assets.create`
- `reports.generate_operational`
- `automations.run`
- `documents.generate`
- `legacy_records.create`
- `shift_logs.add_entry`
- `evidences.attach`
- `approvals.request`

Eventos iniciais:

- `work_item.created`
- `work_item.transitioned`
- `service_order.created`
- `service_order.completed`
- `notification.sent`
- `asset.created`
- `report.generated`
- `automation_rule.executed`
- `document.generated`
- `legacy_record.created`
- `shift_log.entry_added`
- `evidence.attached`
- `approval.requested`

Flow inicial:

- `service-order-completed-notification`
- `work-item-auto-service-order`

Gateway inicial:

- `POST /api/integrations/commands`
- `GET /api/integrations/actions`

O endpoint de catálogo lista manifests, actions, events e flows sem expor os handlers internos. Ele serve como base para plugins, integrações e futuras views administrativas de capacidade por workspace.

## Persistência inicial

O kernel agora persiste:

- `integration_commands`: comandos recebidos pelo gateway, com idempotência, payload, resposta e correlação.
- `event_logs`: eventos emitidos por actions, com workspace, fonte, ator e correlation id.
- `outbox_events`: fila inicial para processar eventos e disparar flows.
- `flow_runs`: execuções de flows por evento.
- `flow_action_runs`: actions chamadas dentro de cada flow.

O processamento do outbox ainda ocorre no mesmo request. Isso preserva simplicidade, mas já cria a trilha para mover a execução para worker dedicado.

## Habilitação por workspace

`resolveWorkspaceContext` resolve o workspace real em `workspaces` e carrega módulos ativos em `workspace_module_configs`.

Se o workspace `sala-tecnica` ainda não existir, a configuração ativa é semeada a partir da adaptação.

## Contratos públicos de actions

`GET /api/integrations/actions` é o ponto inicial de descoberta para plugins e sistemas externos. Cada action exposta informa:

- `key`
- `moduleKey`
- `description`
- `requiredScopes`
- `requiredModules`
- `callableBy`
- `inputSchema`
- `outputSchema`
- `emits`
- `idempotent`

Os contratos de input/output usam um subconjunto simples de JSON Schema. A próxima evolução é validar esses contratos em runtime com Zod ou JSON Schema completo.

## O que ainda não foi implementado

- workflow engine completo
- visual flow editor
- sandbox
- worker assíncrono dedicado para outbox
- API key real
- module registry em banco
- flow definitions em banco
- validação runtime dos schemas de input/output por action

## Próxima etapa

- Criar worker dedicado para `outbox_events`
- Criar API key real
- Persistir definições de flows em banco
- Criar editor visual de flows
- Adicionar validação runtime aos contratos com Zod/JSON Schema

## Frase guia

Primeiro faça uma action emitir um evento e um flow reagir chamando outra action. Depois todos os módulos poderão seguir o mesmo padrão.
