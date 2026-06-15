# Relatório de Inventário e Reconciliação Contratual: Process Definitions

- **ID**: PKG-PROCESS-DEFINITION-CONTRACT-INVENTORY-001
- **Módulo**: workflow-definitions
- **Data**: 2024-05-24
- **Status**: Auditado

## Sumário Executivo

A auditoria identificou que a implementação de Process Definitions está funcional, mas possui acoplamento excessivo entre a UI do Builder e o Core de Workflow. A persistência utiliza um modelo híbrido onde o draft completo é armazenado em um JSONB, enquanto partes do grafo são (ou deveriam ser) normalizadas em tabelas como `states`, `transitions` e `actions`. A falta de contratos canônicos baseados em Zod na camada de `src/platform/workflows` impede a interoperabilidade segura e a validação rigorosa.

## Achados Principais

### 1. Falta de Atomicidade na Criação (HIGH)
O `process-definition.service.ts` cria a definição e a versão em chamadas sequenciais ao banco sem uma transação explícita. Se a criação da versão falhar, uma definição órfã sem versão pode ser criada.

### 2. Acoplamento Bidirecional com Builder (MEDIUM)
A feature de workflow importa validadores e serializadores diretamente de `src/features/builder/process-editor`. Isso dificulta a evolução do motor de workflow independentemente da UI do editor.

### 3. Inconsistência de Status no Banco (MEDIUM)
O campo `isActive` nas tabelas é tratado como string ("true"/"false") em vez de boolean, e coexiste com um campo `status` ("draft", "published"). Essa redundância pode levar a estados inconsistentes (ex: status "published" mas isActive "false").

### 4. Ausência de Validação Zod em Runtime (HIGH)
As definições são lidas do banco e mapeadas para tipos TypeScript via `any` ou casting manual, sem validação estrutural via Zod no momento da leitura ou antes da execução.

### 5. Identidade e Multi-tenancy (INFORMATIONAL)
O `workspaceId` está bem propagado em todas as camadas de query e serviço, garantindo o isolamento básico necessário.

## Classificação de Riscos

1. **Risco de Inconsistência (HIGH)**: Falha em transações de publicação ou criação pode corromper o estado do processo.
2. **Risco de Evolução (MEDIUM)**: Mudar a estrutura do Builder quebrará o workflow silenciosamente se os mappers não forem robustos.
3. **Risco de Segurança (LOW)**: Embora o workspace esteja isolado, o `createdBy` está hardcoded em algumas ações de servidor.
4. **Risco de Performance (LOW)**: O carregamento de versões grandes via JSONB pode impactar a memória se não houver projeção de campos.
5. **Risco de Manutenibilidade (MEDIUM)**: Duplicação de schemas entre `src/db/platform` e `src/db/runtime` (embora idênticos agora).

## Proposta de Pacotes Futuros

### 1. PKG-PROCESS-DEFINITION-SCHEMA-001
- **Objetivo**: Definir o contrato canônico Zod para `ProcessDefinition` e `ProcessVersion` em `src/platform/workflows/contracts`.
- **Owned paths**: `src/platform/workflows/contracts/definition.ts`
- **Risco**: Baixo (apenas novos contratos).

### 2. PKG-PROCESS-NODE-EDGE-SCHEMA-001
- **Objetivo**: Definir schemas Zod para Nodes e Edges, separando a preocupação visual da lógica de execução.
- **Owned paths**: `src/platform/workflows/contracts/nodes.ts`, `src/platform/workflows/contracts/edges.ts`
- **Risco**: Médio (requer alinhamento com o que o motor de execução suporta).

### 3. PKG-PROCESS-DEFINITION-VALIDATION-001
- **Objetivo**: Implementar validação pura em `src/platform` que não dependa do Builder.
- **Owned paths**: `src/platform/workflows/domain/validation/`
- **Risco**: Médio (pode expor erros em drafts legados).

### 4. PKG-PROCESS-DEFINITION-MAPPER-001
- **Objetivo**: Implementar mappers robustos entre DB, Builder e tipos Canônicos.
- **Owned paths**: `src/platform/workflows/mappers/definition.mapper.ts`
- **Risco**: Médio (crucial para round-trip integrity).

### 5. PKG-PROCESS-PUBLICATION-CONTRACT-001
- **Objetivo**: Formalizar o contrato de publicação e garantir atomicidade (transação) na persistência.
- **Owned paths**: `src/features/workflow/definitions/process-definition-publication.service.ts`
- **Risco**: Alto (altera lógica de persistência e estados).

### 6. PKG-PROCESS-DEFINITION-BOUNDARY-001
- **Objetivo**: Refatorar a feature de workflow para usar exclusivamente os contratos de `src/platform`, eliminando imports diretos do Builder em serviços de backend.
- **Owned paths**: `src/features/workflow/definitions/`
- **Risco**: Médio (refatoração de imports).

## Conclusão

Nenhum código de produção foi alterado nesta tarefa. O inventário está completo e serve como base para a normalização contratual do módulo de workflow.
