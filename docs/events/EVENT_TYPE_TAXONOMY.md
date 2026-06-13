# EVENT TYPE TAXONOMY

Este documento define as taxonomias canônicas de eventos emitidos e persistidos pelo sistema, visando padronização.

## Taxonomia Atual (As-Is)

- `process.started`
- `process.completed`
- `step.started`
- `step.completed`

## Taxonomia Canônica (To-Be)

Convenção: `bounded_context.aggregate.event` ou `bounded_context.aggregate.sub-aggregate.event`

### Process Instance (Runtime Lifecycle)
- `runtime.process.instance.started`
- `runtime.process.instance.completed`
- `runtime.process.instance.failed`
- `runtime.process.instance.cancelled`

### Step/Action Execution
- `runtime.step.execution.created`
- `runtime.step.execution.started`
- `runtime.step.execution.completed`
- `runtime.step.execution.failed`
- `runtime.step.execution.skipped`

### Transition/Router Events
- `runtime.transition.selected`
- `runtime.transition.rejected`

### Action Requests (Worker bindings)
- `runtime.action.requested`
- `runtime.action.completed`
- `runtime.action.failed`

### Payload Mutation
- `runtime.payload.created`
- `runtime.payload.updated`

### Outbox Transport Events (Para Audit/Receipt)
- `runtime.outbox.entry.created`
- `runtime.outbox.delivery.attempted`
- `runtime.outbox.delivery.succeeded`
- `runtime.outbox.delivery.failed`
- `runtime.outbox.delivery.dead_lettered`

### Receipts Recording
- `runtime.receipt.delivery.recorded`
- `runtime.receipt.consumer.recorded`

## Estratégia de Versionamento de Eventos

Foi analisado versionar eventos via nome do tipo (e.g., `runtime.process.instance.started.v2`) ou via o campo interno `schemaVersion` do envelope.

**Estratégia Canônica Escolhida:**
Adotaremos a versão armazenada explicitamente no envelope (`schemaVersion`), enquanto o `type` reflete a intenção de domínio imutável.
**Justificativa:** A mudança na estrutura do payload interno não muda a essência conceitual do tipo de evento. Ferramentas de subscrição filtram o domínio via `type` e a desserialização interna tratará mapeamento conforme a versão declarada em `schemaVersion`, mantendo a infraestrutura de routing limpa.

## Mapa de Compatibilidade (As-Is para To-Be)

- `process.started` -> `runtime.process.instance.started`
- `process.completed` -> `runtime.process.instance.completed`
- `step.started` -> `runtime.step.execution.started`
- `step.completed` -> `runtime.step.execution.completed`
