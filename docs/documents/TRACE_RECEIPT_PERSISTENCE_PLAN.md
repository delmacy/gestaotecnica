# Plano de Persistência - Trace Receipts

## Respostas Obrigatórias

1. **Existe tabela canônica para Trace Receipt?**
   Não. Existe apenas a tabela `documents.trace_receipts` que é específica para documentos e não atende ao contrato genérico `TraceReceiptSchema`.

2. **Existe padrão Definition/Version aplicável?**
   Não para o recibo em si, que deve ser imutável e append-only. O padrão Definition/Version é usado em Workflows, mas para Trace Receipts o modelo é de "Event Stream" ou "Audit Chain".

3. **Existe Event Store reutilizável?**
   Sim, em `src/db/runtime/schema/workflow.ts` (tabela `events`), mas ele é semanticamente diferente (fatos de domínio vs. evidências documentais). O padrão de implementação pode ser reutilizado.

4. **Como workspaceId é isolado atualmente?**
   Através de uma coluna `workspace_id` obrigatória em todas as tabelas, referenciando `workspaces.id`, frequentemente acompanhada de índices.

5. **Quais índices seriam necessários?**
   `workspace_id`, `previous_receipt_id`, `correlation_id`, `causation_id`, e o par `(subject_type, subject_id)`.

6. **Como consultar cadeia por previousReceiptId?**
   Usando consultas recursivas (CTE) no Postgres para navegar do último para o primeiro (ou vice-versa) através da coluna `previous_receipt_id`.

7. **Como consultar por correlationId e causationId?**
   Consultas simples indexadas. O `correlationId` agrupa todos os recibos de um mesmo fluxo, enquanto o `causationId` identifica o predecessor imediato na lógica de causalidade.

8. **Hashes devem ficar normalizados ou no receipt?**
   Devem ficar no receipt (preferencialmente em uma coluna `jsonb` chamada `data` ou campos normalizados para `hashes` e `artifacts`) para garantir que o que foi assinado é o que está persistido.

9. **Como impedir IDs duplicados?**
   Utilizando PK `uuid` gerada pelo banco ou cliente e restrição `UNIQUE` no campo `id` (string) do contrato se este for diferente do UUID do banco.

10. **Como garantir append-only?**
    Via política de banco (REVOKE UPDATE/DELETE) ou via Repository Port que exponha apenas o método `append`.

11. **O banco atual suporta transação adequada?**
    Sim. Drizzle + Postgres (via `postgres.js`) suportam transações ACID completas.

12. **Quais lacunas impedem implementação imediata?**
    Inexistência de um schema Drizzle genérico para Traceability e a falta de uma infraestrutura de Repository dedicada.

## Modelo Proposto (Conceitual)

### TraceReceiptRecord (Drizzle)
```typescript
export const receipts = pgSchema("traceability").table("receipts", {
  id: text("id").primaryKey(), // ID canônico do TraceReceipt
  workspaceId: uuid("workspace_id").notNull(),
  subjectType: text("subject_type").notNull(),
  subjectId: text("subject_id").notNull(),
  correlationId: text("correlation_id").notNull(),
  previousReceiptId: text("previous_receipt_id"),
  causationId: text("causation_id"),
  data: jsonb("data").notNull(), // Payload completo validado pelo TraceReceiptSchema
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### TraceReceiptRepositoryPort
- `append(receipt: TraceReceipt): Promise<void>`
- `findById(id: string): Promise<TraceReceipt | null>`
- `findChain(tailId: string): Promise<TraceReceipt[]>`
- `findByCorrelationId(correlationId: string): Promise<TraceReceipt[]>`

## Sequência de Pacotes (Roadmap)

1. **PKG-TRACE-RECEIPT-DB-SCHEMA-001**: Definição da tabela genérica e índices.
2. **PKG-TRACE-RECEIPT-REPOSITORY-PORT-001**: Interface e implementação do repositório.
3. **PKG-TRACE-RECEIPT-APPEND-SERVICE-001**: Serviço com lógica de validação de hash antes da persistência.
4. **PKG-TRACE-RECEIPT-QUERY-SERVICE-001**: API para consulta de cadeias e rastreabilidade.
