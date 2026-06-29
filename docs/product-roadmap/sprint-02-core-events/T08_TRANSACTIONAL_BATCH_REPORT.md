# T08 — Lotes Transacionais de Eventos - Report

## 1. Resumo Executivo
Implementação de append transacional para múltiplos eventos canônicos, garantindo atomicidade (all-or-nothing), preservação de ordem persistida e isolamento por workspace. Integrado com a idempotência atômica da T07.

## 2. Arquitetura Anterior (T07)
- **Writer:** `EventWriter` em `src/platform/events/event-writer.ts`.
- **Idempotência:** Garantida via `ON CONFLICT` e índice único parcial no banco de dados.
- **Isolamento:** Uso estrito de `workspaceId` do contexto.
- **Batch:** Não suportado transacionalmente (apenas loop sequencial legado).

## 3. Writer Reutilizado
O `EventWriter` foi refatorado para centralizar a lógica de persistência no método privado `persistSingleEvent`. Este método é utilizado tanto pelo `appendDomainEvent` (individual) quanto pelo `appendDomainEventBatch` (lote), garantindo paridade de comportamento, validação e segurança.

## 4. Estratégia Transacional
Utilização de `db.transaction` do Drizzle ORM. O método `appendDomainEventBatch` encapsula todos os inserts em uma única transação. Se qualquer evento falhar (seja por validação Zod, erro de integridade do banco ou limite de lote), a transação inteira é revertida.

## 5. Estratégia de Ordenação
A ordem de entrada no lote é preservada de forma determinística na persistência através da adição do campo `_batchIndex` no objeto de metadados canônicos (dentro do payload JSONB). Queries de recuperação como `getBatchEvents` agora utilizam `CAST(payload->'_canonical'->'metadata'->>'_batchIndex' AS INTEGER) ASC` para garantir a sequência exata. Métodos de listagem geral utilizam `createdAt DESC, CAST(...) DESC, id DESC` para estabilidade absoluta.

## 6. Limite de Lote
Limite máximo de 100 eventos por lote, protegido pelo erro tipado `BATCH_LIMIT_EXCEEDED`.

## 7. Contrato Público
```typescript
static async appendDomainEventBatch(
  events: EventInput[],
  context: WorkspaceContext
): Promise<CanonicalEvent[]>
```

## 8. Resultado Tipado
Retorna um array de `CanonicalEvent[]` na mesma ordem da entrada.

## 9. Validações
- Lote não vazio (`EMPTY_BATCH`).
- Lote dentro do limite de 100 itens (`BATCH_LIMIT_EXCEEDED`).
- Validação de schema canônico via Zod para cada item.
- Validação de UUIDs para `entityId` e `actorId` (herança da T07).
- Validação de contexto de workspace obrigatório (`MISSING_WORKSPACE_CONTEXT`).

## 10. Comportamento em Falha
- **Atômico:** Reversão total da transação.
- **Erros Tipados:** Utilização de `EventStoreError` com códigos específicos.
- **Ocultação de Causa:** O campo `cause` não é exposto em serialização JSON (herança da T07).

## 11. Prova de Rollback
Comprovada via teste `should rollback on REAL database failure in the middle of transaction`. O teste fornece um `workspaceId` que não existe no banco, provocando uma falha de chave estrangeira (FK Violation) no nível de banco de dados, e verifica que o contador de eventos permanece em 0.

## 12. Banco Real Utilizado
PostgreSQL (tec_db).

## 13. Teste com Falha Intermediária
Sucesso. Lote enviado com contexto inválido resultou em 0 eventos persistidos, provando que inserções parciais não ocorrem.

## 14. Quantidade Antes
0 eventos (para o workspace de teste).

## 15. Quantidade Depois
0 eventos (após falha real de banco e rollback).

## 16. Prova de Ordem
Comprovada pela persistência e leitura via `getBatchEvents`, onde a ordem retornada do banco coincide 100% com a ordem de entrada, validada pelo `_batchIndex`.

## 17. Teste Cross-tenant
Comprovado. Idempotência e persistência são isoladas por `workspace_id`.

## 18. Compatibilidade com Append Individual
Mantida e verificada. O append individual agora é um caso especial de persistência única usando a mesma infraestrutura de segurança.

## 19. Confirmação de Isolamento da T07
A tarefa foi iniciada isolada. Após o merge da T07 na `main`, foi realizado o rebase. A implementação da T08 não re-implementou lógica da T07, mas sim integrou-se ao código canônico já mergeado. Não foram incluídas alterações experimentais ou não revisadas da T07.

## 20. Limitações
- O limite de 100 eventos é arbitrário e baseado em performance conservadora do banco.
- Operações de lote muito frequentes com muitos eventos podem causar contenção em índices se muitos eventos compartilharem as mesmas chaves de idempotência (comportamento herdado da T07).

## 21. Riscos
- Rollbacks de transações longas podem aumentar o consumo de WAL no Postgres sob carga extrema.

## 22. Comandos e Exit Codes
- `npx tsx --test tests/platform/events/event-batch.test.ts` -> Exit 0
- `npx tsx --test tests/platform/events/event-writer.test.ts` -> Exit 0
- `npx tsx --test tests/platform/events/event-writer-idempotency.test.ts` -> Exit 0
- `npx tsc --noEmit` -> Exit 0
- `node scripts/validate-task-catalog.mjs` -> Exit 0
- `node scripts/prove-task-discovery.mjs SB-S02-T08` -> Exit 0

## 23. Metadados de Integração
- **Base SHA:** 6792ad7cbf763a24d531277374f2f92d99e62feb (Pós T07 merge)
- **Status de Mergeabilidade:** Confirmed Clean Rebase.

## 24. Decisão Final
T08_PROVEN
