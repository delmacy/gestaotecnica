# Matriz Contratual: Process Definitions

## Conceitos e Mapeamentos

| Conceito | Nome Atual | Arquivo de Origem | Tipo TypeScript | Schema Zod | Schema Banco | Mapper | Service Consumidor | Campo Canônico Proposto | Divergências | Decisão Necessária |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ProcessDefinition** | `ProcessDefinitionRecord` | `process-definition.types.ts` | `ProcessDefinitionRecord` | N/A | `process_definitions` | `normalizeProcessDefinitionRecord` | `process-definition.service.ts` | `ProcessDefinition` | `isActive` no banco vs `status` no tipo. | Unificar status/isActive. |
| **ProcessVersion** | `ProcessVersionRecord` | `process-definition.types.ts` | `ProcessVersionRecord` | N/A | `process_versions` | `normalizeProcessVersionRecord` | `process-definition.service.ts` | `ProcessVersion` | `definition` vs `definitionJson`. | Padronizar nome do campo JSON. |
| **ProcessNode** | `BuilderNode` | `builder-block.types.ts` | `BuilderNode` | N/A | `states` / `actions` (parcial) | N/A | `validate-builder-draft.ts` | `ProcessNode` | Não há schema canonical para runtime. | Criar schema runtime para Nodes. |
| **ProcessEdge** | `BuilderEdge` | `builder-block.types.ts` | `BuilderEdge` | N/A | `transitions` | N/A | `validate-builder-draft.ts` | `ProcessEdge` | Não há schema canonical para runtime. | Criar schema runtime para Edges. |
| **BuilderDraft** | `BuilderDraft` | `builder-draft.types.ts` | `BuilderDraft` | N/A | N/A | `serializeBuilderDraft` | `process-definition.service.ts` | `BuilderDraft` | Puramente visual/editor. | Definir separação clara do Runtime. |
| **Publication** | `PublishProcessVersionResult` | `process-definition-publication.types.ts` | `PublishProcessVersionResult` | N/A | N/A | N/A | `process-definition-publication.service.ts` | `ProcessPublication` | É apenas um evento/resultado hoje. | Criar contrato de intenção de publicação. |
| **ValidationIssue** | `ProcessDefinitionInputValidationIssue` | `process-definition.validation.ts` | `ProcessDefinitionInputValidationIssue` | N/A | N/A | N/A | `process-definition.validation.ts` | `ValidationIssue` | Diferente de `BuilderValidationIssue`. | Unificar com `PlatformErrorEnvelope`. |
| **DefinitionStatus** | `ProcessDefinitionStatus` | `process-definition.types.ts` | `"draft" \| "published" \| "archived"` | N/A | `text` | N/A | `process-definition.service.ts` | `ProcessStatus` | Banco usa `isActive` string. | Mudar para enum Zod/DB. |
| **VersionStatus** | `ProcessVersionStatus` | `process-definition.types.ts` | `"draft" \| "published" \| "archived"` | N/A | `text` | N/A | `process-definition.service.ts` | `VersionStatus` | Valores não validados em runtime. | Padronizar estados. |

## Verificações de Identidade

- **id**: UUID v4 em todas as tabelas. Consistente.
- **workspaceId**: Presente como `workspaceId` (TS) e `workspace_id` (DB). Consistente.
- **definitionId**: Referenciado como `processDefinitionId` no TS e `process_definition_id` no DB das versões. Consistente.
- **versionId**: Não existe campo `versionId` explícito, usa-se o `id` da `process_versions`.
- **processVersionId**: Usado em `process_instances` e `states/actions/transitions`. Canonical ID para runtime.
- **key**: Presente na definição. Usada para identificação amigável e URL.
- **version**: Inteiro incremental na tabela de versões. Consistente.

**Campos Duplicados/Derivados:**
- `isActive` ("true"/"false") na `process_definitions` é redundante com o `status` ("published").
- `blueprintKey` e `blueprintVersion` aparecem no DB mas não no TS de feature.

## Estados Catalogados

- **Process Definition**: `draft`, `published`, `archived`.
- **Process Version**: `draft`, `published`, `archived`.
- **Banco (isActive)**: `"true"`, `"false"`.

## Nodes e Edges (Builder vs Runtime)

| Campo | No Builder | No Runtime | Persistido | Derivado | Notas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **nodeId** | Sim (`id`) | Sim (`key` / `actionKey`) | Sim | Não | Essencial para rastreabilidade. |
| **nodeType** | Sim (`type`) | Sim | Sim | Não | Mapeado para `actions.type` ou `states`. |
| **source/target** | Sim | Sim | Sim (`transitions`) | Não | |
| **conditions** | Sim (`condition`) | Sim | Sim (`transitions.config`) | Não | |
| **pos visual** | Sim (`position`) | Não | Sim (no JSON do draft) | Não | Ignorado pelo motor de execução. |
| **config** | Sim (`config`) | Sim | Sim | Não | |
| **action ref** | Sim | Sim | Sim (`actions.key`) | Não | |

## Segurança e Boundaries

- **Workspace Isolation**: Filtragem por `workspaceId` implementada em `queries.ts` e `service.ts`.
- **Session**: `workspaceId` recebido via input nas Server Actions. `createdBy` hardcoded em alguns pontos.
- **Layer Violations**:
    - `process-definition.repository.ts` importa de `@/db/runtime/schema/workflow`.
    - `process-definition.queries.ts` importa de `@/db/runtime/schema/workflow`.
    - **Risco**: `process-definition.service.ts` importa utilitários do Builder (`serializeBuilderDraft`, `validateBuilderDraft`), criando acoplamento bidirecional se não houver cuidado.
