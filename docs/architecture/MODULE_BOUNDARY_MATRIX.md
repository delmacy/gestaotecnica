# Module Boundary Matrix

Esta matriz define as regras de acoplamento e dependência entre os módulos do System Builder.

## Matriz de Dependências

| Módulo | Pode depender de | NÃO pode depender de | Riscos de Acoplamento |
|---|---|---|---|
| **Shared Contracts** | Bibliotecas utilitárias (zod, etc) | Runtime, Events, UI, Banco, Next.js | Acoplamento circular, vazamento de infraestrutura para o domínio. |
| **Events (Types/Mappers)** | Shared Contracts | Runtime, UI, Banco, Next.js | Dependência de lógica de negócio volátil. |
| **Runtime (Types/Mappers)** | Shared Contracts, Event Types | Event Services, UI, Banco, Next.js | Bloqueio de execução por dependência de infraestrutura. |
| **Form Builder Contracts** | Shared Contracts | Runtime, Events, Banco, Next.js | Rigidez na definição de formulários. |
| **Form Builder Adapters** | Form Builder Contracts, Schema, View-Model | Persistência concreta, Runtime, Banco, React, Next.js | Dependência de tecnologia de storage específica ou vazamento de UI. |
| **Form Builder Persistence** | Form Builder Contracts | UI Components, Runtime, Código concreto de banco no pacote | Quebra de isolamento da camada de dados. |
| **Registry Capabilities** | Schemas/Utils autorizados | UI, Runtime, Banco | Fragmentação do catálogo. |
| **Tests** | APIs públicas dos módulos | Imports internos profundos (quando index público existe) | Fragilidade dos testes a refatorações internas. |

## Detalhes por Módulo

### Shared Contracts
- **Path:** `src/platform/contracts/**`
- **Responsabilidade:** Definir tipos e esquemas básicos universais.
- **API Pública:** `src/platform/contracts/index.ts`

### Events
- **Path:** `src/platform/events/**`
- **Responsabilidade:** Definir eventos canônicos e mappers.
- **API Pública:** `src/platform/events/index.ts`

### Runtime
- **Path:** `src/platform/workflows/**` (foco em contratos e tipos de execução)
- **Responsabilidade:** Contratos de execução e estados.
- **API Pública:** `src/platform/workflows/runtime.ts`

### Form Builder
- **Path:** `src/components/builder/form-builder/**`
- **Responsabilidade:** Definição e renderização de formulários dinâmicos.
- **Sub-módulos:**
  - `contracts/`: Definições puras.
  - `adapters/`: Transformações de modelo (isolado de persistência).
  - `persistence/`: Portas de persistência.

### Registry
- **Path:** `src/platform/registry/**`
- **Responsabilidade:** Indexação de capabilities.

### UI
- **Path:** `src/components/**` (exceto builder), `src/app/**`
- **Responsabilidade:** Interface com o usuário.

### Database
- **Path:** `src/db/**`, `drizzle/**`
- **Responsabilidade:** Persistência de dados.

## Exceções Temporárias Documentadas
- Violações legadas de acoplamento com banco de dados em `platform/events`, `platform/registry` e `platform/workflows` estão registradas no baseline do auditor e devem ser tratadas em pacotes corretivos específicos.
