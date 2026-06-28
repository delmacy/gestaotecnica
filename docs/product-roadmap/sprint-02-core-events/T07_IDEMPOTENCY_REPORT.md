# Relatório de Implementação — T07 Idempotência Concorrente de Eventos (Atualizado)

## 1. Resumo Executivo
Implementação de garantia determinística de idempotência para o sistema canônico de eventos. A solução utiliza restrições nativas do banco de dados PostgreSQL para garantir atomicidade, mesmo sob carga concorrente de múltiplas instâncias da aplicação. Foram adicionados erros tipados e comprovação direta via banco de dados conforme solicitado.

## 2. Implementação Anterior Encontrada
O `EventWriter` possuía uma verificação de idempotência baseada em consulta prévia (`SELECT` seguido de `INSERT`). Esta abordagem era vulnerável a condições de corrida (*race conditions*).

## 3. Decisão Arquitetural
Optou-se por mover a garantia de unicidade para a camada de persistência.
- **Vantagem**: Atomicidade garantida pelo motor do banco de dados.
- **Consistência**: Impossibilidade física de duplicidade para a chave `(workspace_id, idempotency_key)`.

## 4. Constraint Criada ou Reutilizada
Foi criada uma nova coluna `idempotency_key` na tabela `workflow.events` e um índice único parcial:
```sql
CREATE UNIQUE INDEX "events_workspace_idempotency_uidx"
ON "workflow"."events" ("workspace_id", "idempotency_key")
WHERE "idempotency_key" IS NOT NULL;
```

## 5. Contrato do Writer
O método `appendDomainEvent` foi estendido para aceitar e validar a `idempotencyKey`.
Validações implementadas (com erros tipados):
- `MISSING_WORKSPACE_CONTEXT`: Workspace ausente no contexto.
- `INVALID_IDEMPOTENCY_KEY_TYPE`: Chave não é uma string.
- `EMPTY_IDEMPOTENCY_KEY`: Chave vazia ou apenas espaços.
- `IDEMPOTENCY_KEY_TOO_LONG`: Chave acima de 255 caracteres.

## 6. Política de Payload Divergente
Caso uma requisição tente persistir um payload diferente usando uma chave de idempotência já utilizada no mesmo workspace:
- O novo evento **não** é persistido.
- O evento **original** é retornado.

## 7. Política Cross-tenant
A restrição de unicidade é composta por `(workspace_id, idempotency_key)`. Isso permite que diferentes workspaces utilizem a mesma chave sem conflito.

## 8. Estratégia Transacional
Utilizou-se a instrução `INSERT ... ON CONFLICT (...) DO NOTHING`.
Se houver conflito, o banco ignora a inserção e o `EventWriter` realiza um `SELECT` determinístico para recuperar o evento original.

## 9. Migração
Migração versionada em `drizzle/0026_add_event_idempotency_key.sql`.

## 10. Testes e Comprovação Direta (DB Proven)
Os testes foram atualizados para consultar diretamente a tabela `workflow.events` usando `count(*)` após operações concorrentes.

## 11. Teste Concorrente
Executado via `Promise.all` simulando disparos simultâneos.

## 12. Quantidade de Tentativas
10 tentativas simultâneas.

## 13. Quantidade Persistida (Comprovado no DB)
**Exatamente 1 único registro na tabela `workflow.events`.**

## 14. Resultado Cross-workspace (Comprovado no DB)
**Aprovado.** Chaves idênticas em workspaces diferentes resultam em 2 registros totais no banco (1 por workspace).
Consultas filtradas por `workspace_id` retornam apenas o registro pertencente àquele tenant.

## 15. Comandos
```bash
npx tsx --test tests/platform/events/event-writer-idempotency.test.ts
npx tsx --test tests/platform/events/event-writer.test.ts
```

## 16. Exit Codes
`0` (Sucesso).

## 17. Erros Tipados
Implementados na classe `EventStoreError` em `src/platform/events/errors/event-errors.ts`.

## 18. Decisão Final
**T07_PROVEN**
