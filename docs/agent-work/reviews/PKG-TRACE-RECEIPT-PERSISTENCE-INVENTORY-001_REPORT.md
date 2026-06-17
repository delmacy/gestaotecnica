# Report: PKG-TRACE-RECEIPT-PERSISTENCE-INVENTORY-001

## Identificação
- **Package ID**: PKG-TRACE-RECEIPT-PERSISTENCE-INVENTORY-001
- **Status**: Concluído (Revisão Final)
- **Base SHA**: d747fff7398c6be62bf5f347410934d940695368

## Resumo Executivo
O inventário mapeou a infraestrutura atual de persistência e identificou ativos reutilizáveis para o rastro de evidências. Foram consolidados os conceitos sobre a natureza do Trace Receipt (imutável por política e verificável por hash) e identificada a separação entre a definição do contrato (`TraceReceiptSchema`) e a lógica de integridade (`hashing.ts`).

## Evidências Encontradas (CONFIRMED)
- **Contrato Canônico**: `TraceReceiptSchema` em `src/platform/documents/traceability/contracts.ts`, definindo o formato e os campos de hash.
- **Lógica de Integridade**: `hashing.ts` e `signable-payload.ts`, implementando o cálculo e verificação de hashes determinísticos.
- **Implementação Parcial**: Tabela `trace_receipts` em `src/db/runtime/schema/documents.ts`.
- **Padrões de Isolamento**: Uso de `workspace_id` UUID em `src/db/runtime/schema/*.ts`.
- **Infraestrutura**: `WorkflowRepository` (`src/platform/workflow-engine/infra/workflow.repository.ts`) e suporte a transações ACID via Drizzle.

## Lacunas Identificadas
- Falta de campos de rastreabilidade transversal na tabela atual de recibos (específica de documentos).
- Proposta de criação de um schema Drizzle genérico (`traceability`) para suportar o rastro de outros sujeitos da plataforma.
- Necessidade de políticas de banco de dados para garantir comportamento append-only real.

## Modelo Proposto (PROPOSED)
Proposta de tabela genérica com suporte a `jsonb` para o rastro canônico e colunas indexadas para navegação em cadeias via `previousReceiptId`.

## Riscos
- **Isolamento**: Baixo, seguindo o padrão de multi-tenancy do repositório.
- **Append-only**: Médio, exige garantias além da camada de aplicação (Triggers/Policies) para evitar violações de integridade do rastro histórico.

## Próximos Passos (PROPOSED)
1. PKG-TRACE-RECEIPT-DB-SCHEMA-001
2. PKG-TRACE-RECEIPT-REPOSITORY-PORT-001
3. PKG-TRACE-RECEIPT-APPEND-SERVICE-001
