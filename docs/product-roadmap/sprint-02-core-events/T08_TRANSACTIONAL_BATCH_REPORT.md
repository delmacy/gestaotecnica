# T08 — Lotes Transacionais de Eventos - Report

## 1. Resumo Executivo
Implementação de append transacional para múltiplos eventos canônicos, garantindo atomicidade (all-or-nothing), preservação de ordem e isolamento por workspace.

## 2. Arquitetura Anterior
- **Writer:** `EventWriter` em `src/platform/events/event-writer.ts`.
- **Append Individual:** `appendDomainEvent` realiza a persistência de um único evento.
- **Batch Atual:** `appendDomainEvents` realizava um loop chamando `appendDomainEvent`, sem garantia transacional entre os eventos do lote.
- **Contexto:** Utiliza `WorkspaceContext` para resolver `workspaceId`, `actorId` e `correlationId`.
- **Persistência:** Drizzle ORM mapeando para a tabela `workflow.events`.
- **Ordenação:** Baseada em `createdAt`.

## 3. Writer Reutilizado
O `EventWriter` original foi refatorado para extrair a lógica de normalização (`prepareCanonicalEvent`) e persistência (`persistEvent`), permitindo que tanto o append individual quanto o batch utilizem a mesma lógica base.

## 4. Estratégia Transacional
Utilização de `db.transaction` do Drizzle ORM. O método `appendDomainEventBatch` abre uma transação e passa o cliente transacional para o método interno de persistência para cada evento do lote.

## 5. Estratégia de Ordenação
A ordem de entrada no lote é preservada. Para garantir ordenação determinística em recuperações futuras onde múltiplos eventos podem ter o mesmo `createdAt`, a ordenação de busca foi atualizada para incluir `id DESC` como critério de desempate (assumindo que o banco preserva ordem de inserção na transação). Além disso, um `_batchIndex` foi adicionado aos metadados internos de cada evento durante a normalização do lote para permitir reconstrução exata se necessário.

## 6. Limite de Lote
Limite máximo de 100 eventos por lote.

## 7. Contrato Público
```typescript
static async appendDomainEventBatch(
  events: Omit<CanonicalEvent, "id" | "workspaceId" | "actorId" | "occurredAt" | "schemaVersion">[],
  context: WorkspaceContext
): Promise<CanonicalEvent[]>
```

## 8. Resultado Tipado
Retorna um array de `CanonicalEvent[]` contendo os eventos persistidos, incluindo IDs gerados e metadados canônicos, na mesma ordem da entrada.

## 9. Validações
- Lote não vazio.
- Lote não excede 100 eventos.
- Validação de cada evento contra `CanonicalEventSchema` via Zod.
- Workspace e Actor consistentes com o contexto.
- Prevenção de sobrescrita de campos protegidos pelo payload.

## 10. Comportamento em Falha
Se qualquer evento falhar na validação ou na persistência, uma exceção é lançada e a transação do banco de dados é revertida integralmente.

## 11. Prova de Rollback
Comprovada via teste `should rollback the entire batch if an intermediate event is invalid`. O teste insere um evento inválido no meio de um lote e verifica que o contador de eventos no banco permanece inalterado e a história da entidade permanece vazia.

## 12. Banco Real Utilizado
PostgreSQL (tec_db).

## 13. Teste com Falha Intermediária
Executado com sucesso. Erro de validação Zod no segundo evento de três causou reversão total.

## 14. Quantidade Antes
0 eventos para a entidade de teste.

## 15. Quantidade Depois
0 eventos para a entidade de teste após falha no lote.

## 16. Prova de Ordem
Comprovada via metadados `_batchIndex` e retorno do método preservando a ordem do array de entrada.

## 17. Teste Cross-tenant
Comprovado via teste `should maintain workspace isolation in batch appends`, verificando que eventos de um workspace não aparecem na história de outro após escrita em lote.

## 18. Compatibilidade com Append Individual
O método `appendDomainEvent` foi mantido e refatorado para usar a mesma lógica interna, com 100% de sucesso nos testes de regressão.

## 19. Confirmação de T07 não Implementada
Confirmado. Nenhuma funcionalidade de idempotência concorrente, `idempotency_key` no nível de banco (apenas a lógica de busca manual da T06) ou tratamento de conflitos da T07 foi incluída.

## 20. Comandos
- `npx tsx --test tests/platform/events/event-batch.test.ts`
- `npx tsx --test tests/platform/events/event-writer.test.ts`
- `node scripts/validate-task-catalog.mjs`
- `node scripts/prove-task-discovery.mjs SB-S02-T08`

## 21. Exit Codes
- Testes: 0
- Validador: 0
- Descoberta: 0

## 22. Limitações
- O limite de 100 eventos é uma salvaguarda.
- A ordenação fina em buscas depende de `createdAt` e ID.

## 23. Riscos
- Retenção de locks em transações muito longas se o limite de 100 for atingido com payloads grandes.

## 24. Decisão Final
T08_PROVEN
