# Inventário de Persistência - Trace Receipts

Este documento mapeia os ativos reais no repositório `delmacy/gestaotecnica` que podem ser utilizados ou que servem de evidência para a persistência e consulta de Trace Receipts.

## Tabela de Evidências

| Ativo | Caminho | Símbolo/Tabela | Comportamento | Reutilização Possível | Limitação | Confiança |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TraceReceipt (Contract)** | `src/platform/documents/traceability/contracts.ts` | `TraceReceiptSchema` | Validação Zod completa do recibo. | Definição de colunas da tabela. | Apenas contrato, sem persistência. | **CONFIRMED** |
| **trace_receipts (Table)** | `src/db/runtime/schema/documents.ts` | `traceReceipts` | Tabela Drizzle para recibos de documentos. | Modelo inicial de tabela. | Acoplada a `documentId`; faltam campos de rastreabilidade (correlation/causation). | **CONFIRMED** |
| **Event Store** | `src/db/runtime/schema/workflow.ts` | `events` | Armazenamento de eventos de domínio. | Padrão de append-only e colunas de correlação. | Focado em workflow, não em evidência documental. | **CONFIRMED** |
| **Workspace Isolation** | `src/db/runtime/schema/*.ts` | `workspaceId` | Coluna obrigatória com FK e índices. | Padrão obrigatório para multi-tenancy. | Nenhuma. | **CONFIRMED** |
| **Correlation/Causation** | `src/platform/contracts/correlation.ts` | `CorrelationIdSchema` | Definição de tipos para IDs de rastro. | Uso obrigatório na nova tabela. | Nenhuma. | **CONFIRMED** |
| **Repository Pattern** | `src/platform/workflow-engine/infra/workflow.repository.ts` | `WorkflowRepository` | Abstração de acesso ao banco usando Drizzle. | Padrão para `TraceReceiptRepository`. | Implementação atual é acoplada. | **CONFIRMED** |
| **Transaction Helper** | `src/db/index.ts` | `runtimeDb.transaction` | Suporte a transações ACID via Drizzle/Postgres. | Garantir atomicidade no append e link. | Nenhuma. | **CONFIRMED** |
| **Hashing Logic** | `src/platform/documents/traceability/hashing.ts` | `verifyTraceHash` | Verificação de integridade. | Validação antes da persistência. | Nenhuma. | **CONFIRMED** |
| **PreviousReceiptId** | `src/platform/documents/traceability/contracts.ts` | `previousReceiptId` | Campo opcional no contrato para encadeamento. | Coluna de encadeamento na DB. | Não existe na tabela `trace_receipts` atual. | **PROPOSED** |

## Análise de Lacunas

1. **Inexistência de Tabela Canônica**: A tabela `trace_receipts` atual é específica para o módulo de documentos. Uma tabela genérica (ex: `traceability.receipts`) é necessária para suportar outros sujeitos (processos, ações, assets).
2. **Desalinhamento de Campos**: A tabela atual não possui `previous_receipt_id`, `correlation_id`, `causation_id`, `actor_type`, `subject_type`, etc., que constam no `TraceReceiptSchema`.
3. **Persistência de Arrays**: O contrato utiliza arrays para `artifacts` e `hashes`. O banco atual utiliza colunas simples para checksums. Recomenda-se o uso de `jsonb` para manter a fidelidade ao contrato sem complexidade excessiva de normalização imediata.

## Índices Recomendados

Para suportar as consultas exigidas:
- `idx_trace_receipts_workspace_id`: Isolamento (obrigatório).
- `idx_trace_receipts_previous_id`: Consulta de cadeias e verificação de link.
- `idx_trace_receipts_correlation_id`: Rastreabilidade transversal.
- `idx_trace_receipts_causation_id`: Rastreabilidade de causa.
- `idx_trace_receipts_subject`: Busca por `subject_type` e `subject_id`.

## Definições e Distinções

Para garantir a clareza arquitetural, distinguimos os seguintes conceitos:

- **Trace Receipt**: Uma evidência documental imutável e assinada de que uma ação ocorreu. Serve para rastreabilidade externa e auditoria de integridade.
- **Domain Event**: Um fato que ocorreu no domínio do negócio (ex: `OrderPlaced`). É usado para comunicação entre componentes e efeitos colaterais.
- **Event Store**: O armazenamento persistente de todos os eventos de domínio, permitindo reconstruir o estado de uma entidade (Event Sourcing).
- **Audit Log**: Um registro operacional de "quem fez o quê e quando" para fins de conformidade e suporte, geralmente mais detalhado e menos formal que um Trace Receipt.
