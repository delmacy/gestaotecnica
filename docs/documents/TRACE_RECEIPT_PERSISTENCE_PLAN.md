# Plano de Persistência - Trace Receipts

## Respostas Obrigatórias

1. **Existe tabela canônica para Trace Receipt?**
   Não. Existe apenas a tabela `documents.trace_receipts` que é específica para documentos e não atende ao contrato genérico `TraceReceiptSchema`.

2. **Existe padrão Definition/Version aplicável?**
   Não para o recibo em si. O modelo de persistência deve ser um armazenamento de recibos (receipt storage) append-only com encadeamento opcional via `previousReceiptId`.

3. **Existe Event Store reutilizável?**
   Sim, em `src/db/runtime/schema/workflow.ts` (tabela `events`), mas ele é semanticamente diferente (fatos de domínio vs. evidências de rastro). O padrão de inserção pode ser reaproveitado.

4. **Como workspaceId é isolado atualmente?**
   Através de uma coluna `workspace_id` UUID obrigatória em tabelas como `process_definitions`, `process_instances` e `documents`, referenciando `workspaces.id`.

5. **Quais índices seriam necessários?**
   `workspace_id`, `previous_receipt_id`, `correlation_id`, `causation_id`, e o par `(subject_type, subject_id)`. Todos são PROPOSED.

6. **Como consultar cadeia por previousReceiptId?**
   Usando consultas recursivas (Common Table Expressions - CTE) no PostgreSQL para navegar na hierarquia de links `previous_receipt_id`.

7. **Como consultar por correlationId e causationId?**
   Consultas filtradas por estas colunas, que devem ser indexadas para suportar rastreabilidade transversal.

8. **Hashes devem ficar normalizados ou no receipt?**
   No receipt (dentro de uma estrutura `jsonb` ou colunas dedicadas) para garantir que a evidência persistida corresponda exatamente ao que foi verificado/calculado.

9. **Como impedir IDs duplicados?**
   Utilizando PK `uuid` no banco de dados e garantindo unicidade no campo `id` canônico do recibo via restrições `UNIQUE` (PROPOSED).

10. **Como garantir append-only?**
    O Repository API deve expor apenas métodos de adição. A garantia definitiva deve ser implementada em nível de banco de dados (ex: Triggers para bloquear UPDATE/DELETE ou políticas de privilégios de usuário).

11. **O banco atual suporta transação adequada?**
    Sim. O uso de `runtimeDb.transaction` (Drizzle/Postgres) permite garantir atomicidade na persistência do recibo e atualização de links relacionados.

12. **Quais lacunas impedem implementação imediata?**
    Inexistência de um schema Drizzle para o módulo de rastreabilidade (traceability) e falta de uma abstração de Repository Port consolidada para este fim.

## Modelo Proposto (PROPOSED)

### TraceReceiptRecord (PROPOSED Schema)
```typescript
// Nome do schema, tabela e campos são PROPOSED
export const receipts = pgSchema("traceability").table("receipts", {
  id: text("id").primaryKey(), // ID canônico
  workspaceId: uuid("workspace_id").notNull(),
  subjectType: text("subject_type").notNull(),
  subjectId: text("subject_id").notNull(),
  correlationId: text("correlation_id"), // Nullability conforme contrato canônico
  previousReceiptId: text("previous_receipt_id"),
  causationId: text("causation_id"),
  data: jsonb("data").notNull(), // Payload completo validado
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### TraceReceiptRepositoryPort (PROPOSED)
- `append(receipt: TraceReceipt): Promise<void>`
- `findById(id: string): Promise<TraceReceipt | null>`
- `findChain(tailId: string): Promise<TraceReceipt[]>`
- `findByCorrelationId(correlationId: string): Promise<TraceReceipt[]>`

## Sequência de Pacotes (Roadmap)

1. **PKG-TRACE-RECEIPT-DB-SCHEMA-001**: Definição da tabela genérica e índices.
2. **PKG-TRACE-RECEIPT-REPOSITORY-PORT-001**: Interface e implementação do repositório.
3. **PKG-TRACE-RECEIPT-APPEND-SERVICE-001**: Serviço com lógica de validação de rastro.
4. **PKG-TRACE-RECEIPT-QUERY-SERVICE-001**: API para consulta e verificação de cadeias.
