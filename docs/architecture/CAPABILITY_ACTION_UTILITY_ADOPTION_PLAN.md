# Plano de Adoção: Capability, Action e Utility App

Baseado no inventário de fronteiras, este plano propõe a sequência de pacotes para formalizar os contratos e a integração entre Capability, Action e Utility App.

## 1. Pacotes Propostos

### Fase 1: Fundação de Contratos (Definition)

#### PKG-CAPABILITY-CORE-CONTRACT-001
- **Objetivo:** Definir o esquema canônico para Capabilities, incluindo esquemas de entrada e saída (Zod).
- **Escopo:**
  - `src/platform/registry/contracts/capability.ts`
  - Integração com a tabela `registry.capabilities` (adição de colunas de schema JSONB).
- **Dependência:** Nenhuma.

#### PKG-ACTION-DESCRIPTOR-CONTRACT-001
- **Objetivo:** Unificar a definição de Action entre o `Action Registry` e o uso em Workflows.
- **Escopo:**
  - Refatorar `ActionDefinition` para um contrato Zod compartilhado.
  - Adicionar suporte a metadados de governança.
- **Dependência:** Nenhuma.

### Fase 2: Implementação de Utility Apps

#### PKG-UTILITY-APP-REGISTRY-001
- **Objetivo:** Criar a infraestrutura de persistência e registro para Utility Apps.
- **Escopo:**
  - Tabelas `registry.utility_apps` e `registry.utility_app_versions`.
  - Contrato de definição de Utility App.
- **Dependência:** Fase 1.

#### PKG-UTILITY-CAPABILITY-BINDING-001
- **Objetivo:** Formalizar a relação onde um Utility App implementa uma Capability.
- **Escopo:**
  - Tabela de junção `registry.utility_capability_implementations`.
  - Lógica de validação de compatibilidade de schema entre Utility App e Capability.
- **Dependência:** `PKG-UTILITY-APP-REGISTRY-001`, `PKG-CAPABILITY-CORE-CONTRACT-001`.

### Fase 3: Execução e Adaptação (Runtime)

#### PKG-UTILITY-ACTION-ADAPTER-001
- **Objetivo:** Criar o adaptador que permite que as funções internas de um Utility App sejam expostas como `Actions` globais.
- **Escopo:**
  - `src/platform/actions/adapters/utility-adapter.ts`.
  - Registro automático de ações ao publicar uma versão de Utility App.
- **Dependência:** `PKG-UTILITY-APP-REGISTRY-001`, `PKG-ACTION-DESCRIPTOR-CONTRACT-001`.

#### PKG-VIEW-BINDING-EXTENSION-001
- **Objetivo:** Extender o `ViewBinding` para suportar novos tipos de targets (como Utility Apps diretamente).
- **Escopo:**
  - Refatorar `ViewBinding` schema em `src/components/builder/view-builder/view-builder-types.ts`.
- **Dependência:** `PKG-UTILITY-APP-REGISTRY-001`.

---

## 2. Sequência Recomendada

1. `PKG-CAPABILITY-CORE-CONTRACT-001` (Fundação declarativa)
2. `PKG-ACTION-DESCRIPTOR-CONTRACT-001` (Fundação técnica)
3. `PKG-UTILITY-APP-REGISTRY-001` (Nova entidade Utility App)
4. `PKG-UTILITY-CAPABILITY-BINDING-001` (Ligação de negócio)
5. `PKG-UTILITY-ACTION-ADAPTER-001` (Habilitação técnica)
6. `PKG-VIEW-BINDING-EXTENSION-001` (Habilitação de interface)
