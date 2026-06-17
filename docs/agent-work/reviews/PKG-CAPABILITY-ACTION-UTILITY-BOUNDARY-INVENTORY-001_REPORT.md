# Relatório de Inventário: PKG-CAPABILITY-ACTION-UTILITY-BOUNDARY-INVENTORY-001

## 1. Identificação
- **Package ID:** PKG-CAPABILITY-ACTION-UTILITY-BOUNDARY-INVENTORY-001
- **Base SHA:** d747fff7398c6be62bf5f347410934d940695368
- **Head SHA:** (Current commit after documentation)
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
- **Capability:** Existe como tabela em `registry.capabilities`. Representa habilidades de negócio.
- **Action:** Existe tanto em `workflow.actions` (runtime) quanto em `workflow.action_registry` (catálogo).
- **Module:** Existe em `registry.modules` como unidade de empacotamento.
- **Process:** Existe em `workflow.process_definitions` como orquestrador de estados.
- **View Binding:** Existe em `ViewBlueprint` para ligar visualizações a targets (capabilities, forms).
- **Registry:** Namespace `registrySchema` no PostgreSQL.

## 4. Sobreposições Encontradas
- **Ações:** Há uma sobreposição conceitual entre ações de workflow (passos de processo) e o catálogo global de ações (`action_registry`).
- **Módulos vs Capabilities:** Em alguns lugares, o termo "módulo" é usado para se referir a uma capability instalada, embora existam tabelas separadas para ambos.

## 5. Lacunas Identificadas
- **Contratos de Capability:** Ausência de esquemas de entrada/saída (I/O) para capabilities.
- **Utility App:** Falta uma entidade formal para Utility Apps no banco de dados e nos contratos.
- **Descoberta de Ações:** O mecanismo de descoberta de ações de Utility Apps ainda não existe.

## 6. Sequência Recomendada
1. Formalizar contratos de Capability (`PKG-CAPABILITY-CORE-CONTRACT-001`).
2. Unificar descritores de Action (`PKG-ACTION-DESCRIPTOR-CONTRACT-001`).
3. Criar o registro formal de Utility Apps (`PKG-UTILITY-APP-REGISTRY-001`).
4. Implementar adaptadores de execução (`PKG-UTILITY-ACTION-ADAPTER-001`).
5. Extender View Bindings para novos targets (`PKG-VIEW-BINDING-EXTENSION-001`).
