# Inventário AS-IS: Process Definitions

## Arquivos Analisados

### `src/features/workflow/definitions/process-definition.types.ts`
- **Responsabilidade**: Definição de tipos TypeScript para registros e inputs de Process Definition.
- **Exports públicos**: `ProcessDefinitionStatus`, `ProcessDefinitionRecord`, `ProcessVersionStatus`, `ProcessVersionRecord`, `CreateProcessDefinitionInput`, `CreateProcessDefinitionResult`.
- **Inputs**: N/A
- **Outputs**: N/A
- **Dependências**: `@/features/builder/types`.
- **Entidades persistidas**: Referencia indiretamente `process_definitions` e `process_versions`.
- **Workspace boundary**: `workspaceId` presente em `ProcessDefinitionRecord` e `CreateProcessDefinitionInput`.
- **Transaction boundary**: N/A (Apenas tipos).
- **Error strategy**: N/A
- **Event strategy**: N/A
- **Status contratual**: Legado, focado em registros de banco de dados.
- **Riscos conhecidos**: Acoplamento com `SerializedBuilderDraft`.

### `src/features/workflow/definitions/process-definition.validation.ts`
- **Responsabilidade**: Validação lógica de inputs para criação de processos.
- **Exports públicos**: `validateCreateProcessDefinitionInput`.
- **Inputs**: `CreateProcessDefinitionInput`.
- **Outputs**: `ProcessDefinitionInputValidationResult`.
- **Dependências**: `@/features/builder/process-editor/validate-builder-draft`.
- **Entidades persistidas**: N/A
- **Workspace boundary**: Valida presença de `workspaceId`.
- **Transaction boundary**: N/A
- **Error strategy**: Retorna lista de issues estruturada.
- **Event strategy**: N/A
- **Status contratual**: Implementação de feature.
- **Riscos conhecidos**: Acoplamento direto com validador do Builder.

### `src/features/workflow/definitions/process-definition.mapper.ts`
- **Responsabilidade**: Transformação de dados entre Builder e Workflow.
- **Exports públicos**: `createProcessKeyFromName`, `mapBuilderDraftToCreateProcessDefinitionInput`.
- **Inputs**: `BuilderDraft`.
- **Outputs**: `CreateProcessDefinitionInput`.
- **Dependências**: `@/features/builder/types`.
- **Entidades persistidas**: N/A
- **Workspace boundary**: Propaga `workspaceId`.
- **Transaction boundary**: N/A
- **Error strategy**: N/A
- **Event strategy**: N/A
- **Status contratual**: Utilitário de mapeamento.
- **Riscos conhecidos**: Geração de `key` baseada no nome pode causar colisões se não houver sufixo.

### `src/features/workflow/definitions/process-definition.service.ts`
- **Responsabilidade**: Orquestração da criação de definições e versões de processo.
- **Exports públicos**: `createProcessDefinition`, `createProcessVersion`.
- **Inputs**: `CreateProcessDefinitionInput`, `BuilderDraft`.
- **Outputs**: `CreateProcessDefinitionResult`, `ProcessVersionRecord`.
- **Dependências**: `process-definition.repository`, `process-definition.validation`, `@/features/builder/process-editor/serialize-builder-draft`.
- **Entidades persistidas**: `process_definitions`, `process_versions`.
- **Workspace boundary**: Recebe `workspaceId`.
- **Transaction boundary**: Não utiliza transação explícita (risco de inconsistência parcial).
- **Error strategy**: Lança `ProcessDefinitionValidationError` e `ProcessDefinitionPersistenceError`.
- **Event strategy**: N/A
- **Status contratual**: Camada de serviço de feature.
- **Riscos conhecidos**: Falta de atomicidade na criação de definição + primeira versão.

### `src/features/workflow/definitions/process-definition.queries.ts`
- **Responsabilidade**: Consulta de definições e versões de processo no banco de dados.
- **Exports públicos**: `listProcessDefinitions`, `getProcessDefinitionById`, `getProcessVersionById`.
- **Inputs**: `workspaceId`, `processDefinitionId`, `processVersionId`.
- **Outputs**: Records normalizados.
- **Dependências**: `drizzle-orm`, `@/db/runtime/schema/workflow`.
- **Entidades persistidas**: `process_definitions`, `process_versions`.
- **Workspace boundary**: Filtragem obrigatória por `workspaceId`.
- **Transaction boundary**: Read-only.
- **Error strategy**: Retorna `null` ou array vazio.
- **Event strategy**: N/A
- **Status contratual**: Camada de consulta.
- **Riscos conhecidos**: Utiliza `any` para tipagem de resultados do Drizzle internamente.

### `src/features/workflow/definitions/process-definition.server.ts`
- **Responsabilidade**: Bridge entre serviços e Server Actions, tratando erros.
- **Exports públicos**: `createProcessDefinitionServer`, `listProcessDefinitionsServer`, `getProcessDefinitionWithLatestVersionServer`.
- **Inputs**: Mesmos dos serviços/queries.
- **Outputs**: `Result` pattern (`ok: true/false`).
- **Dependências**: `process-definition.service`, `process-definition.queries`.
- **Entidades persistidas**: N/A
- **Workspace boundary**: Propaga `workspaceId`.
- **Transaction boundary**: N/A
- **Error strategy**: Captura erros e converte para envelopes JSON-safe.
- **Event strategy**: N/A
- **Status contratual**: Controller server-side.
- **Riscos conhecidos**: Catch-all para `SERVER_ERROR` esconde detalhes técnicos.

### `src/features/workflow/definitions/process-definition.actions.ts`
- **Responsabilidade**: Entrypoint para Next.js Server Actions.
- **Exports públicos**: `saveBuilderDraftAsProcessDefinitionAction`, `listProcessDefinitionsAction`, `getProcessDefinitionWithLatestVersionAction`.
- **Inputs**: Mesmos do server.
- **Outputs**: Mesmos do server.
- **Dependências**: `process-definition.server`, `@/db`.
- **Entidades persistidas**: N/A
- **Workspace boundary**: Recebe `workspaceId`.
- **Transaction boundary**: N/A
- **Error strategy**: Validação básica de DB configurado.
- **Event strategy**: N/A
- **Status contratual**: API de UI.
- **Riscos conhecidos**: Hardcoded `createdBy` uuid padrão.

### `src/features/workflow/definitions/process-definition-publication.service.ts`
- **Responsabilidade**: Lógica de publicação de uma versão de processo.
- **Exports públicos**: `publishProcessVersion`.
- **Inputs**: `PublishProcessVersionInput`.
- **Outputs**: `PublishProcessVersionResult`.
- **Dependências**: `process-definition.queries`, `process-definition.repository`.
- **Entidades persistidas**: `process_versions`, `process_definitions`.
- **Workspace boundary**: Valida `workspaceId`.
- **Transaction boundary**: Chamadas sequenciais ao repo sem transação.
- **Error strategy**: Retorna objeto de erro com código.
- **Event strategy**: N/A (Não dispara eventos de publicação ainda).
- **Status contratual**: Serviço especializado.
- **Riscos conhecidos**: Falta de transação entre `publishProcessVersionRecord` e `markProcessDefinitionAsPublished`.

### `src/features/workflow/definitions/process-definition.repository.ts`
- **Responsabilidade**: Acesso direto ao banco de dados via Drizzle.
- **Exports públicos**: `insertProcessDefinition`, `insertProcessVersion`, `getLatestProcessVersionNumber`, `publishProcessVersionRecord`, `markProcessDefinitionAsPublished`.
- **Inputs**: `db`, payloads crus.
- **Outputs**: Records do Drizzle.
- **Dependências**: `@/db/runtime/schema/workflow`.
- **Entidades persistidas**: `process_definitions`, `process_versions`.
- **Workspace boundary**: Espera `workspaceId` nos inputs.
- **Transaction boundary**: Recebe `db` (pode ser transação).
- **Error strategy**: N/A (Lança erros do Drizzle).
- **Event strategy**: N/A
- **Status contratual**: Camada de persistência.
- **Riscos conhecidos**: `isActive` é tratado como string ("true"/"false") em vez de boolean no schema.

### `src/db/runtime/schema/workflow.ts`
- **Responsabilidade**: Definição do schema do banco de dados (Drizzle).
- **Exports públicos**: `processDefinitions`, `processVersions`, `states`, `transitions`, `actions`, `processInstances`, etc.
- **Dependências**: `drizzle-orm`.
- **Entidades persistidas**: Todas as tabelas de workflow.
- **Workspace boundary**: `workspace_id` presente em quase todas as tabelas.
- **Status contratual**: Verdade absoluta do banco.
- **Riscos conhecidos**: Duplicidade conceitual entre `processDefinitions.isActive` e `status`.

### `src/features/builder/process-editor/validate-builder-draft.ts`
- **Responsabilidade**: Validação estrutural do draft do Builder.
- **Exports públicos**: `validateBuilderDraft`.
- **Inputs**: `BuilderDraft`.
- **Outputs**: `BuilderValidationResult`.
- **Dependências**: `@/features/builder/types`.
- **Riscos conhecidos**: Lógica de validação de grafo mínima (apenas IDs duplicados e start/end nodes).

### Caminhos não encontrados
- `src/features/workflow/definitions/process-definition-publication.server.ts`: Encontrado.
- `src/features/workflow/definitions/process-definition-publication.actions.ts`: Encontrado.
- `src/db/platform/schema/workflow*`: Encontrado como `src/db/platform/schema/workflow.ts` (idêntico ao runtime/schema/workflow.ts em conteúdo mas possivelmente redundante).
- `src/platform/workflows/**`: Encontrado (Kernel Actions, Flow Runner, Mappers).
