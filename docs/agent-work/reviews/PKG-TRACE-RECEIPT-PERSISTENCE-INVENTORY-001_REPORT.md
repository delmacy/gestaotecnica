# Report: PKG-TRACE-RECEIPT-PERSISTENCE-INVENTORY-001

## Identificação
- **Package ID**: PKG-TRACE-RECEIPT-PERSISTENCE-INVENTORY-001
- **Status**: Concluído
- **Data**: 2024-05-23
- **Base SHA**: d747fff7398c6be62bf5f347410934d940695368

## Resumo Executivo
O inventário mapeou a infraestrutura atual de persistência e identificou que, embora existam padrões de repositório e isolamento de workspace consolidados, a tabela de `trace_receipts` atual é limitada e acoplada ao domínio de documentos. É necessária a criação de uma infraestrutura genérica para suportar o contrato `TraceReceipt` em toda a plataforma.

## Evidências Encontradas
- **Contrato Canônico**: `TraceReceiptSchema` em `src/platform/documents/traceability/contracts.ts`.
- **Implementação Parcial**: Tabela `trace_receipts` em `src/db/runtime/schema/documents.ts` (limitada).
- **Padrões de Isolamento**: Uso consistente de `workspace_id` e índices em `src/db/runtime/schema/*.ts`.
- **Infraestrutura de Workflow**: Event Store (`events`) e Repository Pattern (`WorkflowRepository`) como referências de implementação.

## Lacunas Identificadas
- Falta de campos de rastreabilidade (`correlationId`, `causationId`, `previousReceiptId`) na tabela atual.
- Necessidade de um schema Drizzle dedicado fora do domínio de documentos.
- Inexistência de serviço de consulta recursiva para cadeias de recibos.

## Modelo Proposto
Proposta de tabela `traceability.receipts` com uso de `jsonb` para o payload completo e colunas normalizadas para indexação de rastro (correlation/causation/previous).

## Riscos
- **Isolamento**: O risco é baixo desde que o padrão de `workspace_id` seja estritamente seguido e verificado em nível de Repository.
- **Append-only**: Exige disciplina na implementação do Repository e, idealmente, restrições em nível de banco de dados (Trigger ou REVOKE).

## Próximos Passos
1. PKG-TRACE-RECEIPT-DB-SCHEMA-001
2. PKG-TRACE-RECEIPT-REPOSITORY-PORT-001
3. PKG-TRACE-RECEIPT-APPEND-SERVICE-001
