# EVENT RECEIPT AS-IS INVENTORY

Inventário das estruturas atuais de eventos e recibos para auditoria, sem criar novos recursos e sem executar dados reais.

## `workflow.events`

- **Path:** `src/db/runtime/schema/workflow.ts`
- **Responsibility:** Armazena os eventos do domínio.
- **Entity/Type:** Event Record
- **Fields:** `workspaceId`, `instanceId`, `eventType`, `entityType`, `entityId`, `actorType`, `actorId`, `source`, `correlationId`, `causationId`, `payload`, `createdAt`
- **Producer:** Runtime service operations (e.g. `startProcessInstance`, `advanceStep`)
- **Consumer:** Sem consumer ativo mapeado (append-only)
- **Persistence:** PostgreSQL, tabela `workflow_events`
- **Workspace Boundary:** `workspaceId`
- **Transaction Boundary:** Atualmente persistido fora da mesma transação da mudança de domínio.
- **Retry Strategy:** N/A (append-only)
- **Idempotency Strategy:** N/A
- **Correlation Strategy:** Opcional via `correlationId` / `causationId`
- **Security Strategy:** N/A (sem policies ativas)
- **Known Risks:** Grava dados de payload brutos com PII, fora de transação do comando de origem, eventTypes limitados e definidos como strings simples.
- **Contract Status:** NEEDS_REWORK

## `workflow.outbox_events`

- **Path:** `src/db/runtime/schema/workflow.ts`
- **Responsibility:** Armazena eventos para despacho via transactional outbox (atualmente sem dispatch/worker).
- **Entity/Type:** Outbox Record
- **Fields:** `eventLogId`, `topic`, `status`, `payload`, `attempts`, `lastError`, `createdAt`, `processedAt`
- **Producer:** `logEvent`
- **Consumer:** Nenhum (Dispatcher ausente)
- **Persistence:** PostgreSQL, tabela `workflow_outbox_events`
- **Workspace Boundary:** Inherits implicity via eventLogId
- **Transaction Boundary:** Fora da transação
- **Retry Strategy:** Ausente
- **Idempotency Strategy:** Ausente
- **Correlation Strategy:** Ausente
- **Security Strategy:** N/A
- **Known Risks:** Duplicação de payload, sem transaction boundaries, dispatcher/worker/cron ausente, sem locking e sem status apropriado para dead letter, timestamp properties insuficientes.
- **Contract Status:** NEEDS_REWORK

## `events.types.ts`

- **Path:** `src/features/workflow/runtime/events/events.types.ts`
- **Responsibility:** Definir os tipos do domínio de eventos e outbox.
- **Entity/Type:** Interfaces `LogEventInput`, `EventRecord`, `OutboxRecord`
- **Fields:** Reflete os campos do schema acima.
- **Producer:** N/A
- **Consumer:** N/A
- **Persistence:** N/A
- **Workspace Boundary:** N/A
- **Transaction Boundary:** N/A
- **Retry Strategy:** N/A
- **Idempotency Strategy:** N/A
- **Correlation Strategy:** N/A
- **Security Strategy:** N/A
- **Known Risks:** Tipos canônicos ausentes e não estruturados (e.g. envelope incompleto e schema version missing).
- **Contract Status:** NEEDS_REWORK

## `events.validation.ts`

- **Path:** `src/features/workflow/runtime/events/events.validation.ts`
- **Responsibility:** Validação em runtime dos schemas (Zod).
- **Entity/Type:** Validadores Zod (`logEventInputSchema`)
- **Fields:** Tipos inferidos refletindo DB.
- **Producer:** N/A
- **Consumer:** N/A
- **Persistence:** N/A
- **Workspace Boundary:** Valida `workspaceId`
- **Transaction Boundary:** N/A
- **Retry Strategy:** N/A
- **Idempotency Strategy:** N/A
- **Correlation Strategy:** N/A
- **Security Strategy:** N/A
- **Known Risks:** Ausência de schema de validação para Delivery, Retry, Payload Hashing, Security policies.
- **Contract Status:** NEEDS_REWORK

## `events.repository.ts`

- **Path:** `src/features/workflow/runtime/events/events.repository.ts`
- **Responsibility:** Operações DB de log e queries de event timeline.
- **Entity/Type:** Queries e Inserts.
- **Fields:** N/A
- **Producer:** N/A
- **Consumer:** N/A
- **Persistence:** Insert de event e outbox em chamadas separadas ou com promessas encadeadas (`Promise.all` não garante transação estrita para dependências sequenciais).
- **Workspace Boundary:** Isolamento no query
- **Transaction Boundary:** N/A (Quebrado - cast 'as any')
- **Retry Strategy:** N/A
- **Idempotency Strategy:** N/A
- **Correlation Strategy:** N/A
- **Security Strategy:** N/A
- **Known Risks:** Utiliza `db as any` e insert destrutivo de typings no event_log. Outbox não usa lock/select for update.
- **Contract Status:** NEEDS_REWORK

## `events.server.ts` e `events.actions.ts`

- **Path:** `src/features/workflow/runtime/events/events.server.ts`, `src/features/workflow/runtime/events/events.actions.ts`
- **Responsibility:** Camada de serviço/ação (retornar `getTimelineForInstanceAction` etc.).
- **Entity/Type:** Server Action
- **Fields:** N/A
- **Producer:** N/A
- **Consumer:** N/A
- **Persistence:** N/A
- **Workspace Boundary:** Context authorization
- **Transaction Boundary:** N/A
- **Retry Strategy:** N/A
- **Idempotency Strategy:** N/A
- **Correlation Strategy:** N/A
- **Security Strategy:** N/A
- **Known Risks:** N/A
- **Contract Status:** NEEDS_REWORK

## `runtime.service.ts` e `runtime-step.service.ts`

- **Path:** `src/features/workflow/runtime/runtime.service.ts`, `src/features/workflow/runtime/runtime-step.service.ts`
- **Responsibility:** Chamadas imperativas a `logEvent` de forma síncrona dentro da request original.
- **Entity/Type:** Serviços de domínio
- **Fields:** Tipos canônicos usados.
- **Producer:** N/A
- **Consumer:** N/A
- **Persistence:** N/A
- **Workspace Boundary:** N/A
- **Transaction Boundary:** Executa mutations principais isoladamente das chamadas de `logEvent`.
- **Retry Strategy:** N/A
- **Idempotency Strategy:** N/A
- **Correlation Strategy:** N/A
- **Security Strategy:** N/A
- **Known Risks:** Falha no logEvent não reverte mutation, tornando o DB inconsistente com o outbox.
- **Contract Status:** NEEDS_REWORK

## Agent Gateway receipts e Gateway Receipts UI

- **Path:** `src/features/platform/gateway/gateway.types.ts`, `src/app/admin/gateway/receipts/page.tsx`
- **Responsibility:** Recibo de aceitação/entrada para APIs e webhooks. UI que mostra estes recibos.
- **Entity/Type:** `GatewayReceipt`, `GatewayReceiptsTable`
- **Fields:** `status`, `source`, `payloadFormat`, `search`, etc.
- **Producer:** External Ingestion via API Gateway.
- **Consumer:** N/A
- **Persistence:** Read-only (UI) / Persistence DB (Agent Gateway log).
- **Workspace Boundary:** N/A
- **Transaction Boundary:** N/A
- **Retry Strategy:** N/A
- **Idempotency Strategy:** N/A
- **Correlation Strategy:** Correlation ID.
- **Security Strategy:** N/A
- **Known Risks:** Gateway receipts são independentes dos recibos do runtime, confusão potencial com trace receipts.
- **Contract Status:** BOUNDARY_IDENTIFIED
