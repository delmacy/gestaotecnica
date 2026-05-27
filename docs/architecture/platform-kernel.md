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
- Outbox futura

## Regra central

Modulos expoem actions.

Actions emitem events.

Flows reagem a events.

Flows chamam actions.

Integracoes externas chamam actions via API.

## Implementacao inicial

Actions iniciais:

- `work_items.create`
- `service_orders.complete`
- `notifications.send`
- `assets.create`
- `reports.generate_operational`
- `automations.run`

Eventos iniciais:

- `work_item.created`
- `service_order.completed`
- `notification.sent`
- `asset.created`
- `report.generated`
- `automation_rule.executed`

Flow inicial:

- `service-order-completed-notification`

Gateway inicial:

- `POST /api/integrations/commands`
- `GET /api/integrations/actions`

O endpoint de catalogo lista manifests, actions, events e flows sem expor os handlers internos. Ele serve como base para plugins, integracoes e futuras views administrativas de capacidade por workspace.

## O que ainda nao foi implementado

- workflow engine completo
- visual flow editor
- sandbox
- worker/outbox real
- API key real
- module registry em banco
- flow definitions em banco

## Proxima etapa

- Persistir `outbox_events`
- Persistir `flow_runs`
- Persistir `flow_action_runs`
- Criar workspace real no banco
- Criar module enablement por workspace

## Frase guia

Primeiro faca uma action emitir um evento e um flow reagir chamando outra action. Depois todos os modulos poderao seguir o mesmo padrao.
