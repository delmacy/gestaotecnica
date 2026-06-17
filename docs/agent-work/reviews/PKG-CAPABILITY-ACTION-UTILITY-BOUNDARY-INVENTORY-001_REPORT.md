# Relatório de Inventário: PKG-CAPABILITY-ACTION-UTILITY-BOUNDARY-INVENTORY-001

## 1. Identificação
- **Package ID:** PKG-CAPABILITY-ACTION-UTILITY-BOUNDARY-INVENTORY-001
- **Base SHA:** d747fff7398c6be62bf5f347410934d940695368
- **Head SHA:** GitHub PR head
- **Status:** Concluído

## 2. Arquivos Analisados
- `src/db/platform/schema/registry.ts`
- `src/db/runtime/schema/workflow.ts`
- `src/platform/actions/action-registry.ts`
- `src/platform/actions/action-types.ts`
- `src/platform/workflows/contracts/process-node-edge.ts`
- `src/components/builder/view-builder/view-builder-types.ts`
- `src/platform/workspaces/module-catalog.ts`
- `docs/utility-apps/UTILITY_APP_AS_IS_INVENTORY.md`

## 3. Conceitos Confirmados
- **Capability:** Existe como tabela em `registry.capabilities`. Representa habilidades de negócio declarativas.
- **Action Descriptor:** Metadados e schemas de ações persistidos na tabela `workflow.action_registry`.
- **Action Handler:** Funções executáveis registradas em memória no `ActionRegistry` (`src/platform/actions/action-registry.ts`).
- **Action Instance:** Passos de fluxo configurados na tabela `workflow.actions` vinculados a versões de processo.
- **Module:** Existe em `registry.modules` como unidade de empacotamento e distribuição.
- **Process:** Orquestração de fluxos temporais em `workflow.process_definitions`.
- **View Binding:** Interface em `ViewBlueprint` para ligar visualizações a targets; suporte a `capability` e `form` confirmado via schema.
- **Registry:** Namespace de definições persistido no PostgreSQL.

## 4. Sobreposições Encontradas
- **Ações:** O termo `Action` é sobrecarregado para descrever o catálogo (Descriptor), a lógica técnica (Handler) e o nó do fluxo (Instance).
- **Módulos vs Capabilities:** Há acoplamento semântico onde módulos são usados para entregar capacidades, mas a distinção entre o pacote (Module) e a habilidade (Capability) é mantida em tabelas separadas.

## 5. Lacunas Identificadas
- **Contratos de Capability:** Ausência de contratos formais de Input/Output (Zod) para capabilities.
- **Utility App:** Inexistência de entidade formal e contrato no código atual; proposta consolidada em PR #212.
- **Extensibilidade de Binding:** O `ViewBinding` atual é fechado para um conjunto pequeno de tipos, dificultando a integração de novas ferramentas como Utility Apps.

## 6. Sequência Recomendada
1. `PKG-CAPABILITY-CORE-CONTRACT-001` (Definição de contratos de negócio)
2. `PKG-ACTION-DESCRIPTOR-CONTRACT-001` (Unificação de metadados de ações)
3. `PKG-UTILITY-APP-CORE-CONTRACT-001` (Consolidado em PR #212)
4. `PKG-REGISTRY-PERSISTENCE-UPDATE-001` (Atualização de persistência do Registry)
5. `PKG-UTILITY-CAPABILITY-BINDING-001` (Ligação entre ferramentas e capacidades)
6. `PKG-UTILITY-ACTION-ADAPTER-001` (Ponte de execução técnica)
7. `PKG-VIEW-BINDING-EXTENSION-001` (Extensão de bindings de interface)
