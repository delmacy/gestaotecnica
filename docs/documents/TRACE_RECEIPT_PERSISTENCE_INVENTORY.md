# Inventário de Persistência - Trace Receipts

Este documento mapeia os ativos reais no repositório `delmacy/gestaotecnica` que podem ser utilizados ou que servem de evidência para a persistência e consulta de Trace Receipts.

## Tabela de Evidências

| Ativo | Caminho | Símbolo/Tabela | Comportamento | Reutilização Possível | Limitação | Confiança |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TraceReceipt (Contract)** | `src/platform/documents/traceability/contracts.ts` | `TraceReceiptSchema` | Validação Zod completa do recibo. | Definição de colunas da tabela. | Apenas contrato, sem suporte nativo a assinatura digital (JWS). | **CONFIRMED** |
| **trace_receipts (Table)** | `src/db/runtime/schema/documents.ts` | `traceReceipts` | Tabela Drizzle para recibos de documentos. | Modelo inicial de tabela. | Acoplada a `documentId` e `documentVersionId`. | **CONFIRMED** |
| **Event Store (Workflow)** | `src/db/runtime/schema/workflow.ts` | `events` | Armazenamento de fatos de domínio. | Padrão de inserção indexada por workspace. | Específico para transições de estado de workflow. | **CONFIRMED** |
| **Workspace Isolation** | `src/db/runtime/schema/workspace.ts` | `workspaces` | Tabela central de workspaces. | Referência para FK em novas tabelas. | Exige aplicação manual de filtros em queries. | **CONFIRMED** |
| **Correlation Context** | `src/platform/contracts/correlation.ts` | `CorrelationIdSchema` | Definição de rastro de correlação. | Tipagem de colunas de rastro. | `causationId` é opcional no contrato. | **CONFIRMED** |
| **Repository Pattern** | `src/platform/workflow-engine/infra/workflow.repository.ts` | `WorkflowRepository` | Abstração de persistência via Drizzle. | Estrutura de classe Repository. | Atualmente acoplado ao schema de workflow. | **CONFIRMED** |
| **Transaction Helper** | `src/db/index.ts` | `runtimeDb.transaction` | Exposição do método de transação do Drizzle. | Atomicidade em operações complexas. | Depende da exportação correta da instância da DB. | **CONFIRMED** |
| **Hashing Logic** | `src/platform/documents/traceability/hashing.ts` | `verifyTraceHash` | Verificação de integridade determinística. | Validação de rastro antes/após persistência. | Não garante não-repúdio sem assinatura digital. | **CONFIRMED** |
| **PreviousReceiptId** | `src/platform/documents/traceability/contracts.ts` | `previousReceiptId` | Campo opcional no contrato para encadeamento. | Coluna de encadeamento na DB. | Não existe na tabela `trace_receipts` atual. | **PROPOSED** |

## Análise de Lacunas

1. **Inexistência de Tabela Genérica**: A tabela `trace_receipts` atual é restrita ao domínio de documentos. É necessária uma tabela genérica capaz de referenciar qualquer `subject` (conforme `TraceReceiptSubjectTypeSchema`).
2. **Desalinhamento de Esquema**: A tabela atual não contempla campos fundamentais do rastro de evidência, como `previous_receipt_id`, `correlation_id` e `causation_id`.
3. **Persistência de Estruturas Complexas**: O rastro canônico inclui arrays de `artifacts` e `hashes`. Recomenda-se o uso de `jsonb` para evitar normalização prematura e manter a fidelidade ao contrato verificado.

## Índices Recomendados (PROPOSED)

Para suportar as consultas de rastreabilidade:
- `idx_trace_receipts_workspace_id`: Isolamento de tenant (obrigatório).
- `idx_trace_receipts_previous_id`: Navegação em cadeias de evidência.
- `idx_trace_receipts_correlation_id`: Agrupamento por fluxo de execução.
- `idx_trace_receipts_causation_id`: Rastreabilidade de causa imediata.
- `idx_trace_receipts_subject_lookup`: Busca por `subject_type` e `subject_id`.

## Definições e Distinções

Para garantir a clareza arquitetural, distinguimos os seguintes conceitos:

- **Trace Receipt**: Uma evidência documental imutável por política e verificável por hash de que uma ação ocorreu. Serve para rastreabilidade e auditoria de integridade.
- **Domain Event**: Um fato que ocorreu no domínio do negócio (ex: `OrderPlaced`). É usado para comunicação entre componentes e efeitos colaterais.
- **Event Store**: O armazenamento persistente de todos os eventos de domínio, permitindo reconstruir o estado de uma entidade (Event Sourcing).
- **Audit Log**: Um registro operacional de "quem fez o quê e quando" para fins de conformidade e suporte, geralmente menos formal que um Trace Receipt.
