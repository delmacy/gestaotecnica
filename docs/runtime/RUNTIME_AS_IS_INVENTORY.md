# Runtime As-Is Inventory

Este documento cataloga o estado atual dos módulos e schemas do engine de runtime, de forma a embasar a reconciliação do contrato.

## 1. db/runtime/schema/workflow.ts
- **responsibility**: Define a estrutura de persistência para as instâncias de execução, payloads e actions executadas.
- **public_exports**: processInstances, processPayloads, actionExecutions, insert schemas associados.
- **dependencies**: drizzle-orm.
- **database_entities**: `processInstances` (id, workspaceId, processVersionId, currentStateId, status, etc.), `processPayloads` (schemaVersion vs schema_version divergence), `actionExecutions`.
- **workspace_boundary**: Implementada através de UUID por linha na base.
- **transaction_boundary**: N/A no nível de schema (mapeamento apenas).
- **error_strategy**: N/A
- **event_strategy**: N/A
- **known_risks**: A coluna `schema_version` está exportando um camelCase mismatch (`schemaVersion`), sem validação forte. A `processDefinitionId` não está na entity de instance, precisando ser deduzida por join com processVersion.
- **contract_status**: draft (precisa revisão canônica)

## 2. features/workflow/runtime/runtime.types.ts
- **responsibility**: Assinaturas de Tipos TS, Input/Output para instâncias e steps, mapeamento com Drizzle.
- **public_exports**: ProcessInstanceStatus, ActionExecutionStatus, ProcessInstanceRecord, ActionExecutionRecord, ProcessPayloadRecord, StartProcessInstanceInput, StepExecutionInput, etc.
- **dependencies**: Nenhuma (tipos apenas).
- **database_entities**: Tipa o que sai do banco.
- **workspace_boundary**: Tipa que todas as entidades pedem um `workspaceId`.
- **transaction_boundary**: N/A.
- **error_strategy**: N/A
- **event_strategy**: N/A
- **known_risks**: Mistura tipos relacionados a instâncias e a actions/steps; stepExecutionInput permite status livre (`completed`). Uso de `any` em PayloadRecords.
- **contract_status**: draft

## 3. features/workflow/runtime/runtime.validation.ts
- **responsibility**: Valida os inputs via Zod.
- **public_exports**: startProcessInstanceInputSchema, actionExecutionInsertSchema, stepExecutionInputSchema, advanceStepInputSchema.
- **dependencies**: Zod.
- **database_entities**: N/A.
- **workspace_boundary**: Requer workspaceId válido UUID.
- **transaction_boundary**: N/A.
- **error_strategy**: Mapeia para erros Zod.
- **event_strategy**: N/A.
- **known_risks**: Usa `z.any()` em payloads, permitindo qualquer estrutura, ignorando `schemaVersion`.
- **contract_status**: draft

## 4. features/workflow/runtime/runtime.errors.ts
- **responsibility**: Dicionário de erros previstos no Runtime.
- **public_exports**: RuntimeErrorCode, RuntimeError, RuntimeResult.
- **dependencies**: Nenhuma.
- **database_entities**: N/A.
- **workspace_boundary**: N/A.
- **transaction_boundary**: N/A.
- **error_strategy**: Define código estático (INVALID_INPUT, INSTANCE_NOT_FOUND, etc) para a union type `RuntimeResult`.
- **event_strategy**: N/A.
- **known_risks**: Códigos de erro muito genéricos (`INTERNAL_ERROR`).
- **contract_status**: draft

## 5. features/workflow/runtime/runtime.repository.ts
- **responsibility**: Acesso ao banco de dados (ler e gravar nas tabelas de runtime).
- **public_exports**: insertProcessInstance, getProcessInstanceById, insertActionExecution, updateActionExecutionStatus, getActionExecutionById, updateProcessInstanceStatus.
- **dependencies**: db.
- **database_entities**: `process_instances`, `action_executions`.
- **workspace_boundary**: Filtra e insere de acordo com o `workspaceId`.
- **transaction_boundary**: Nenhuma. As operações de INSERT e UPDATE não compartilham transação nativamente (nenhum tx do drizzle sendo passado no fluxo de forma transacional).
- **error_strategy**: Repassa as promises (sujeito a crash).
- **event_strategy**: N/A
- **known_risks**: Gravações parciais se o engine falhar no meio. Sem lock de row (não tem SELECT FOR UPDATE). Sem controle de concorrência.
- **contract_status**: draft

## 6. features/workflow/runtime/runtime.service.ts
- **responsibility**: Inicialização de instâncias a partir do contract do workflow.
- **public_exports**: startProcessInstance
- **dependencies**: validations, repository, events.
- **database_entities**: Manipula instâncias.
- **workspace_boundary**: Presente e repassada do input.
- **transaction_boundary**: Nenhuma explícita (múltiplas chamadas await do db).
- **error_strategy**: Captura try-catch genérico (retorna INTERNAL_ERROR).
- **event_strategy**: Chama `logEvent`.
- **known_risks**: Processo falhando após a gravação da `processInstance` e antes da criação da primeira action execution deixa estado órfão. Sem idempotência.
- **contract_status**: draft

## 7. features/workflow/runtime/runtime-step.service.ts
- **responsibility**: Lógica de advance (passos sucessivos).
- **public_exports**: advanceStep
- **dependencies**: runtime.repository, process-definition.queries.
- **database_entities**: Lê definition do workflow (através do workspace) e atualiza executions.
- **workspace_boundary**: Respeitada em inputs, mas carece verificação forte ao buscar nodes.
- **transaction_boundary**: Multiplas chamadas não-transacionais (update status, load instance, insert next execution).
- **error_strategy**: Return type formatado com error codes.
- **event_strategy**: logEvent para `step.started` e `step.completed`.
- **known_risks**: O path-finding busca a PRIMEIRA edge apenas, ignorando `conditions` e branches. Ausência de transação (update/insert podem separar na falha do server). Sem lock pessimista / otimista (race conditions podem gerar duplicidade de node ativo).
- **contract_status**: draft

## 8. features/workflow/runtime/runtime.server.ts (Boundary)
- **responsibility**: Boundary actions de NextJS para Server Actions de componentes UI / Controllers externos.
- **public_exports**: startProcessInstanceAction, advanceStepAction.
- **dependencies**: services, repository.
- **database_entities**: N/A.
- **workspace_boundary**: Hardcoded mock tenant context.
- **transaction_boundary**: N/A.
- **error_strategy**: Try-catch devolvendo INTERNAL_ERROR.
- **event_strategy**: N/A.
- **known_risks**: Tenancy chumbada e ignorando autoria real (actorId chumbado). Usado para early phases, mas é inseguro.
- **contract_status**: draft
