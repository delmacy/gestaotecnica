# Runtime Command Contract

Este documento expõe as portas lógicas e os DTOs canônicos (comandos e retornos) da camada Application do Runtime.

## 1. StartProcessInstanceCommand
- **workspaceId** (Required UUID)
- **processVersionId** (Required UUID)
- **actor** (Required/Opcional Futuro RuntimeActor) - ActorId que submeteu o trigger.
- **correlationId** (Opcional String) - Usado para webhooks / async.
- **causationId** (Opcional UUID) - ID do processo pai (sub-processo) ou web request.
- **idempotencyKey** (Futuro UUID/String) - Deve ser implementado no contrato para evitar side-effects duplos (uma call POST repetida).
- **input** (Required/Opcional Object) - `initialPayload`.
- **expected_result**: `StartProcessInstanceResult` (Process Instance Criada e ativa, e Output do primeiro nó se for síncrono).
- **possible_errors**: INVALID_INPUT, PROCESS_VERSION_NOT_FOUND, PROCESS_VERSION_NOT_PUBLISHED, INTERNAL_ERROR.
- **transaction_expectation**: Insert de Instância + Insert Inicial de Payload + Registro de Event (Auditoria) + Insert da 1ª ActionExecution em transação SQL única.
- **event_expectation**: Evento `process.started` em BD, sinal em outbox.

## 2. AdvanceStepCommand
- **workspaceId** (Required UUID)
- **processInstanceId** (Required UUID)
- **actionExecutionId** (Required UUID) - A task em aberto que está sendo completada.
- **actionKey** (Required String) - Referência estática (para sanity check contra o Graph).
- **output** (Required Object) - `outputPayload` gerado pela submissão do step atual.
- **actor** (Required RuntimeActor) - Quem fechou a task.
- **correlationId** (Opcional)
- **idempotencyKey** (Futuro)
- **expected_result**: `AdvanceStepResult` contendo o ID da PRÓXIMA ActionExecution ou sinalização Terminal da Instance.
- **possible_errors**: INSTANCE_NOT_FOUND, INSTANCE_NOT_ACTIVE, ACTION_EXECUTION_NOT_FOUND, ACTION_EXECUTION_NOT_ACTIVE, END_NODE_REACHED, AMBIGUOUS_TRANSITION, INTERNAL_ERROR.
- **transaction_expectation**: Update da current Action (completed) + Insert next Action (pending) + Update Instance Status se End node + Update Payload + Outbox events => todos na mesma transação.
- **event_expectation**: `step.completed` emitido para o outbox. `step.started` emitido para outbox da nova fase (ou `process.completed`).

## 3. FailProcessInstanceCommand (Cancelamento)
- **workspaceId** (Required UUID)
- **processInstanceId** (Required UUID)
- **actor** (Required)
- **reason** (Required String)
- **expected_result**: Instância com status "failed" / "cancelled".
- **transaction_expectation**: Muta status e emite evento `process.failed`/`process.cancelled`.

## 4. CompleteActionExecutionCommand / FailActionExecutionCommand
*Esses comandos são subtipos e ações de mais baixo nível, hoje mapeados diretamente como uso interno do `AdvanceStepCommand`. Na evolução do outbox, se um Webhook externo falhar, ele chama o `FailActionExecutionCommand`.*

## Estratégia de Idempotência
A idempotencyKey deve ser introduzida na camada de Controller (API Gateway / Server Actions). A transação no Postgres deverá criar/ler da tabela `idempotency_keys` atômica ou validar o ID repetido. Por enquanto está demarcado como 'futuro', mas é requisito do contrato de maturidade.
