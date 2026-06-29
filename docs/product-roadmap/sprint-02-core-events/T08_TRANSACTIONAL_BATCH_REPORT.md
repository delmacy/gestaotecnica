# Relatório Técnico - SB-S02-T08 - Lotes Transacionais de Eventos

## Informações Básicas
- **Branch:** `task/SB-S02-T08-transactional-batch-events`
- **Commit-base (main):** `6792ad7cbf763a24d531277374f2f92d99e62feb`

## Arquivos Alterados
- `src/platform/events/errors/event-errors.ts`: Adição de códigos de erro para batches.
- `src/platform/events/event-writer.ts`: Refatoração e implementação de `appendDomainEventBatch` e `getBatch`.
- `tests/platform/events/event-batch.test.ts`: Suite de testes completa para a funcionalidade de batch.

## Desenho da Transação
A implementação utiliza `db.transaction` do Drizzle ORM para garantir a atomicidade. Todos os eventos do lote são preparados e validados antes de iniciar a transação. Dentro da transação, cada evento é persistido individualmente usando a lógica de inserção com `ON CONFLICT DO NOTHING` para suportar a idempotência da T07. Qualquer erro (validação de banco, violação de constraint não tratada ou erro inesperado) dentro da transação dispara um rollback automático pelo banco de dados.

## Mecanismo de Identificação do Lote
Cada lote recebe um `batchId` (UUID) único gerado no momento do append. Este ID é armazenado no metadados do evento dentro da coluna `payload` JSONB, no caminho `payload._canonical.metadata.batchId`.

## Mecanismo Explícito de Ordenação
Para garantir que a ordem original do array seja preservada independentemente de timestamps ou IDs, cada evento do lote recebe um `_batchIndex` sequencial (0, 1, 2...). Este índice é armazenado em `payload._canonical.metadata._batchIndex`. A recuperação através de `getBatch` utiliza um `ORDER BY (_batchIndex)::integer ASC` explícito.

## Integração com a Idempotência da T07
O batch reutiliza o método `persistSingleEvent`, que executa o `INSERT ... ON CONFLICT ("workspace_id", "idempotency_key") WHERE "idempotency_key" IS NOT NULL DO NOTHING`.
- Se um lote contém eventos duplicados (mesma `idempotencyKey`), apenas o primeiro é inserido e os subsequentes retornam o evento existente, mantendo a integridade.
- Se um evento do lote já existia no banco, ele é ignorado no insert e o estado final do banco permanece consistente.

## Prova do Rollback de Banco (Trigger)
O teste `should rollback all events if a database failure occurs mid-batch (trigger proof)` em `tests/platform/events/event-batch.test.ts` comprova a atomicidade real via trigger temporário do PostgreSQL.
- **Cenário:** Trigger `BEFORE INSERT` que lança `RAISE EXCEPTION` ao detectar o segundo item do lote de rastreio (`n: '2'`).
- **Quantidade antes:** Contagem inicial de eventos para o `traceType`.
- **Ponto da falha:** Interrupção do segundo insert pelo trigger.
- **Quantidade após rollback:** Contagem final igual à inicial (confirmado diretamente via SQL no banco).
- **Limpeza:** Remoção do trigger e função no bloco `finally`.

## Matriz de Testes

| ID | Teste | Status |
|----|-------|--------|
| 1 | Lote com 1 evento | Passou |
| 2 | Lote com 2 eventos | Passou |
| 3 | Lote com 10 eventos | Passou |
| 4 | Lote exatamente no limite (100) | Passou |
| 5 | Lote acima do limite (101) | Passou |
| 6 | Lote vazio | Passou |
| 7 | Evento inválido no primeiro item | Passou |
| 8 | Evento inválido no meio | Passou |
| 9 | Evento inválido no último item | Passou |
| 10 | Falha real do banco após >= 1 insert | Passou |
| 11 | Confirmação de zero persistência após falha | Passou |
| 12 | Contexto sem workspace | Passou |
| 13 | Actor inválido (UUID malformado) | Passou |
| 14 | Tentativa de sobrescrever workspace | Passou |
| 15 | Isolamento entre dois workspaces | Passou |
| 16 | Dois lotes independentes | Passou |
| 17 | Recuperação de cada lote separadamente | Passou |
| 18 | Ordem original preservada | Passou |
| 19 | correlationId preservado | Passou |
| 20 | causationId preservado | Passou |
| 21 | Versão canônica (1.0.0) validada | Passou |
| 22 | Idempotência da T07 preservada | Passou |
| 23 | Append individual continua funcionando | Passou |
| 24 | Ausência de update/delete | Verificado |
| 25 | Erros validados por tipo e código | Passou |

## Comandos Executados e Resultados
- `npm run test tests/platform/events/event-batch.test.ts`: Todos os testes passaram.
- `npx tsx scripts/prove-task-discovery.mjs SB-S02-T08`: Sucesso.
- `npx tsx scripts/validate-task-catalog.mjs`: Sucesso.

## Riscos Residuais
- O limite de 100 eventos é arbitrário e pode precisar de ajuste dependendo do tamanho médio do payload para evitar estouro de memória ou timeout de transação em ambientes com alta latência de banco.

## Confirmação de Isolamento
Confirmo que nenhum artefato da T07 foi adicionado por esta task, e que a implementação da T07 na main foi preservada e reutilizada integralmente. Nenhum commit da PR #364 foi reaproveitado.
