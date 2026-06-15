# Runtime Mapper Invariants

Este documento descreve as invariantes e regras de mapeamento para as entidades de runtime.

## ProcessInstance Mapper

### Precedência de Aliases
- `workspaceId` > `workspace_id`
- `processVersionId` > `process_version_id`
- `currentStateId` > `current_state_id`
- `createdById` > `created_by_id`
- `createdAt` > `created_at`
- `updatedAt` > `updated_at`

### Campos Obrigatórios
- `id` (UUID)
- `workspaceId` (UUID)
- `processVersionId` (UUID)
- `status` (Enum)
- `createdAt` (ISO Date)
- `updatedAt` (ISO Date)

### Campos Derivados/Removidos
- `definitionId`: Não deve estar presente no contrato canônico (removido em favor de `processVersionId`).

### Regras de Imutabilidade
- O objeto `raw` de entrada não é mutado.
- O campo `metadata` de entrada não é mutado.
- Se `context.metadata` for fornecido, ele é mesclado com o metadata da entidade sem mutar nenhum dos objetos de entrada.

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
- `schemaVersion` (SemVer)
- `data` (Objeto)

### Regras de Imutabilidade
- O objeto `raw` de entrada não é mutado.
- O campo `data` não é mutado.

---

## ActionExecution Mapper

### Precedência de Aliases
- `actionKey`: `actionKey` > `action_key` > `node_id`
- `actorId` > `actor_id`
- `workspaceId` > `workspace_id`
- `instanceId` > `instance_id`
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
- `actionKey` (String)
- `status` (Enum)
- `startedAt` (ISO Date)
- `correlationId` (UUID)
- `causationId` (UUID)

### Regras de Imutabilidade
- O objeto `raw` de entrada não é mutado.
- `inputPayload` e `outputPayload` não são mutados.
- `null` explícito para `actorId` é preservado.

---

## Casos de Rejeição (Geral)
- Ausência de campos obrigatórios.
- UUIDs inválidos em campos identificadores.
- Status fora dos Enums permitidos.
- Timestamps que não seguem o formato ISO 8601 (UTC com 'Z').
- Payloads que não respeitam o contrato de `UnknownRecord`.
