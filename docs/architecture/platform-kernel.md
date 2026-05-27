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

Eventos iniciais:

- `work_item.created`
- `service_order.completed`
- `notification.sent`

Flow inicial:

- `service-order-completed-notification`

Gateway inicial:

- `POST /api/integrations/commands`

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
