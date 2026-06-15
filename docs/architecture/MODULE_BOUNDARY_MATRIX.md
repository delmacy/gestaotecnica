# Module Boundary Matrix

Esta matriz define as regras de acoplamento e dependência entre os módulos do System Builder.

## Matriz de Dependências

| Módulo | Pode depender de | NÃO pode depender de | Riscos de Acoplamento |
|---|---|---|---|
| **Shared Contracts** | Bibliotecas utilitárias (zod, etc) | Runtime, Events, UI, Banco, Next.js | Acoplamento circular, vazamento de infraestrutura para o domínio. |
| **Events (Types/Mappers)** | Shared Contracts | Runtime, UI, Banco, Next.js | Dependência de lógica de negócio volátil. |
| **Runtime (Types/Mappers)** | Shared Contracts | Event Services, UI, Banco, Next.js | Bloqueio de execução por dependência de infraestrutura. |
| **Form Builder Contracts** | Shared Contracts | Runtime, Events, Banco, Next.js | Rigidez na definição de formulários. |
| **Form Builder Adapters** | Form Builder Contracts | Persistência concreta, Runtime, Banco | Dependência de tecnologia de storage específica. |
| **Registry Capabilities** | Schemas/Utils autorizados | UI, Runtime, Banco | Fragmentação do catálogo. |
| **Tests** | APIs públicas dos módulos | Imports internos profundos (quando index existe) | Fragilidade dos testes a refatorações internas. |

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
- **Path:** `src/platform/workflows/runtime/**` (Nota: No estado atual, mapeado para `src/platform/workflows/runtime.ts` e arquivos relacionados)
- **Responsabilidade:** Contratos de execução e estados.
- **API Pública:** `src/platform/workflows/runtime.ts`

### Form Builder
- **Path:** `src/components/builder/form-builder/**`
- **Responsabilidade:** Definição e renderização de formulários dinâmicos.
- **API Pública:** `src/components/builder/form-builder/contracts/index.ts` (ou similar)

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
- Nenhuma exceção autorizada até o momento. Toda violação encontrada deve ser tratada como débito técnico.
