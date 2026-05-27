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

Modulos expoem actions.

Actions emitem events.

Flows reagem a events.

Flows chamam actions.

Integracoes externas chamam actions via API.

## Implementacao inicial

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

O endpoint de catalogo lista manifests, actions, events e flows sem expor os handlers internos. Ele serve como base para plugins, integracoes e futuras views administrativas de capacidade por workspace.

## Persistencia inicial

O kernel agora persiste:

- `integration_commands`: comandos recebidos pelo gateway, com idempotencia, payload, resposta e correlacao.
- `event_logs`: eventos emitidos por actions, com workspace, fonte, ator e correlation id.
- `outbox_events`: fila inicial para processar eventos e disparar flows.
- `flow_runs`: execucoes de flows por evento.
- `flow_action_runs`: actions chamadas dentro de cada flow.

O processamento do outbox ainda ocorre no mesmo request. Isso preserva simplicidade, mas ja cria a trilha para mover a execucao para worker dedicado.

## Habilitacao por workspace

`resolveWorkspaceContext` resolve o workspace real em `workspaces` e carrega modulos ativos em `workspace_module_configs`.

Se o workspace `sala-tecnica` ainda nao existir, a configuracao ativa e semeada a partir da adaptacao.

## Contratos publicos de actions

`GET /api/integrations/actions` e o ponto inicial de descoberta para plugins e sistemas externos. Cada action exposta informa:

- `key`
- `moduleKey`
- `description`
- `requiredScopes`
- `requiredModules`
- `callableBy`
- `emits`
- `idempotent`

Os schemas formais de input/output ainda serao fortalecidos com Zod ou JSON Schema.

## O que ainda nao foi implementado

- workflow engine completo
- visual flow editor
- sandbox
- worker assicrono dedicado para outbox
- API key real
- module registry em banco
- flow definitions em banco
- schemas formais de input/output por action

## Proxima etapa

- Criar worker dedicado para `outbox_events`
- Criar API key real
- Persistir definicoes de flows em banco
- Criar editor visual de flows
- Formalizar contratos com Zod/JSON Schema

## Frase guia

Primeiro faca uma action emitir um evento e um flow reagir chamando outra action. Depois todos os modulos poderao seguir o mesmo padrao.
