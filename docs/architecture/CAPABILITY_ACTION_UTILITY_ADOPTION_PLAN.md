# Plano de Adoção: Capability, Action e Utility App

Baseado no inventário de fronteiras, este plano propõe a sequência de pacotes para formalizar os contratos e a integração entre Capability, Action e Utility App.

## 1. Pacotes Propostos

### Fase 1: Fundação de Contratos (Definition)

#### PKG-CAPABILITY-CORE-CONTRACT-001
- **Objetivo:** Definir o esquema canônico para Capabilities, incluindo os contratos Zod para metadados e esquemas de entrada e saída (I/O).
- **Escopo:**
  - `src/platform/registry/contracts/capability.ts`.
  - Definição formal do contrato sem alteração de persistência.
- **Dependência:** Nenhuma.

#### PKG-ACTION-DESCRIPTOR-CONTRACT-001
- **Objetivo:** Unificar a definição de Action entre o catálogo persistente (Descriptor) e o uso em fluxos (Instance).
- **Escopo:**
  - Refatorar `ActionDefinition` para um contrato Zod compartilhado.
  - Adicionar suporte a metadados de governança e schemas de I/O estáveis.
- **Dependência:** Nenhuma.

### Fase 2: Implementação de Utility Apps e Persistência

#### PKG-UTILITY-APP-CORE-CONTRACT-001
- **Objetivo:** Definir o contrato canônico para Utility Apps.
- **Escopo:**
  - `src/platform/utility-apps/contracts/utility-app.ts`.
  - Esquema Zod para metadados, versões e categorias (lookup, calculation, etc.).
- **Status:** Consolidado via PR #212.
- **Dependência:** Fase 1.

#### PKG-REGISTRY-PERSISTENCE-UPDATE-001
- **Objetivo:** Atualizar o schema do banco de dados para suportar os novos contratos de Capability e Utility App.
- **Escopo:**
  - Migrações para adicionar colunas de schema em `registry.capabilities`.
  - Criação das tabelas `registry.utility_apps` e `registry.utility_app_versions`.
- **Dependência:** `PKG-CAPABILITY-CORE-CONTRACT-001`, `PKG-UTILITY-APP-CORE-CONTRACT-001`.

#### PKG-UTILITY-CAPABILITY-BINDING-001
- **Objetivo:** Formalizar a relação onde um Utility App implementa uma Capability.
- **Escopo:**
  - Tabela de junção `registry.utility_capability_implementations`.
  - Lógica de validação de compatibilidade de schema entre Utility App e Capability.
- **Dependência:** `PKG-REGISTRY-PERSISTENCE-UPDATE-001`.

### Fase 3: Execução e Adaptação (Runtime)

#### PKG-UTILITY-ACTION-ADAPTER-001
- **Objetivo:** Criar o adaptador que permite que funções de um Utility App sejam expostas como `Actions` globais.
- **Escopo:**
  - `src/platform/actions/adapters/utility-adapter.ts`.
  - Mecanismo de ponte entre o Utility App e o Action Runner.
- **Dependência:** `PKG-UTILITY-APP-CORE-CONTRACT-001`, `PKG-ACTION-DESCRIPTOR-CONTRACT-001`.

#### PKG-VIEW-BINDING-EXTENSION-001
- **Objetivo:** Extender o `ViewBinding` para suportar Utility Apps como targets diretos.
- **Escopo:**
  - Refatorar `ViewBinding` schema em `src/components/builder/view-builder/view-builder-types.ts`.
- **Dependência:** `PKG-UTILITY-APP-CORE-CONTRACT-001`.

---

## 2. Sequência Recomendada

1. `PKG-CAPABILITY-CORE-CONTRACT-001` (Contrato de negócio)
2. `PKG-ACTION-DESCRIPTOR-CONTRACT-001` (Contrato técnico)
3. `PKG-UTILITY-APP-CORE-CONTRACT-001` (Consolidado em PR #212)
4. `PKG-REGISTRY-PERSISTENCE-UPDATE-001` (Habilitação de persistência)
5. `PKG-UTILITY-CAPABILITY-BINDING-001` (Ligação de negócio)
6. `PKG-UTILITY-ACTION-ADAPTER-001` (Habilitação técnica)
7. `PKG-VIEW-BINDING-EXTENSION-001` (Habilitação de interface)
