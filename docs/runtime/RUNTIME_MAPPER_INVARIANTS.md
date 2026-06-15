# Runtime Mapper Invariants

Este documento descreve as regras de mapeamento e invariantes aplicados aos objetos do módulo de runtime.

## ProcessInstance Mapper

### Precedência de Aliases
- `workspaceId` > `workspace_id`
- `processVersionId` > `process_version_id`
- `currentStateId` > `current_state_id`
- `createdAt` > `created_at`
- `updatedAt` > `updated_at`
- `createdById` > `created_by_id`

### Campos Obrigatórios (após mapeamento)
- `id` (UUID)
- `workspaceId` (UUID)
- `processVersionId` (UUID)
- `status` (Enum: pending, active, completed, failed, cancelled)
- `createdById` (UUID ou null)
- `createdAt` (ISO DateTime)
- `updatedAt` (ISO DateTime)

### Campos Derivados / Removidos
- `definitionId`: Não é incluído no objeto canônico (removido em favor de `processVersionId`).

### Imutabilidade
- O objeto de entrada (`raw`) não é mutado.
- Metadados fornecidos via contexto são mesclados com os metadados do objeto original sem mutar nenhum dos dois.

---

## ProcessPayload Mapper

### Precedência de Aliases
- `instanceId` > `instance_id`
- `workspaceId` > `workspace_id`
- `schemaVersion` > `schema_version`
- `createdAt` > `created_at`
- `updatedAt` > `updated_at`

### Campos Obrigatórios
- `id` (UUID)
- `instanceId` (UUID)
- `workspaceId` (UUID)
- `schemaVersion` (Semver)
- `data` (Record<string, unknown>)
- `createdAt` (ISO DateTime)
- `updatedAt` (ISO DateTime)

---

## ActionExecution Mapper

### Precedência de Aliases
- `actionKey`: `actionKey` > `action_key` > `node_id`
- `actorId` > `actor_id`
- `inputPayload` > `input_payload`
- `outputPayload` > `output_payload`
- `startedAt` > `started_at`
- `finishedAt` > `finished_at`
- `correlationId` > `correlation_id`
- `causationId` > `causation_id`

### Campos Obrigatórios
- `id` (UUID)
- `workspaceId` (UUID)
- `instanceId` (UUID)
- `actionKey` (String não vazia)
- `status` (Enum: pending, running, completed, failed, skipped)
- `startedAt` (ISO DateTime)
- `correlationId` (String/UUID)
- `causationId` (String/UUID)

---

## Regras Gerais de Rejeição (Casos Negativos)
O sistema rejeita e lança `ZodError` para:
- Ausência de campos obrigatórios.
- IDs em formato inválido (não UUID).
- Datas em formato inválido.
- Status fora dos enumerados permitidos.
- Payloads (`data`, `inputPayload`, `outputPayload`) que não sejam objetos JSON válidos.
