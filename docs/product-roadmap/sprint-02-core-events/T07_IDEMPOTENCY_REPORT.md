# Relatório de Implementação — T07 Idempotência Concorrente de Eventos

## 1. Resumo Executivo
Implementação de garantia determinística de idempotência para o sistema canônico de eventos. A solução utiliza restrições nativas do banco de dados PostgreSQL para garantir atomicidade, mesmo sob carga concorrente de múltiplas instâncias da aplicação.

## 2. Implementação Anterior Encontrada
O `EventWriter` possuía uma verificação de idempotência baseada em consulta prévia (`SELECT` seguido de `INSERT`). Esta abordagem era vulnerável a condições de corrida (*race conditions*) em ambientes concorrentes, permitindo a persistência de eventos duplicados caso duas requisições chegassem quase simultaneamente.

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
Validações implementadas:
- Tipo: `string`
- Limpeza: `trim()`
- Tamanho: Mínimo 1, Máximo 255 caracteres.
- Rejeição de valores vazios ou apenas espaços.

## 6. Política de Payload Divergente
Caso uma requisição tente persistir um payload diferente usando uma chave de idempotência já utilizada no mesmo workspace:
- O novo evento **não** é persistido.
- O evento **original** (já persistido) é retornado ao chamador.
- Nenhuma alteração é feita no registro existente (Append-only).

## 7. Política Cross-tenant
A restrição de unicidade é composta por `(workspace_id, idempotency_key)`. Isso permite que diferentes workspaces utilizem a mesma chave sem conflito entre si, mantendo o isolamento total dos dados.

## 8. Estratégia Transacional
Utilizou-se a instrução `INSERT ... ON CONFLICT (...) DO NOTHING`.
Fluxo:
1. Tentativa de inserção atômica.
2. Se houver conflito, o banco ignora a inserção silenciosamente.
3. O `EventWriter` realiza um `SELECT` determinístico filtrado por `workspace_id` e `idempotency_key` para recuperar e retornar o evento original.

## 9. Migração
Migração versionada criada em `drizzle/0026_add_event_idempotency_key.sql`.
Aplicada com sucesso no ambiente de integração.

## 10. Testes Executados
Foram executados testes sequenciais e concorrentes contra o banco de dados real.

## 11. Teste Concorrente
Executado via `Promise.all` simulando disparos simultâneos.

## 12. Quantidade de Tentativas
10 tentativas simultâneas.

## 13. Quantidade Persistida
**1 único registro.**

## 14. Resultado Sequencial
Aprovado. Chamadas subsequentes retornam o primeiro evento criado.

## 15. Resultado Cross-workspace
Aprovado. Chaves idênticas em workspaces diferentes resultam em eventos distintos.

## 16. Comandos
```bash
npx tsx --test tests/platform/events/event-writer-idempotency.test.ts
npx tsx --test tests/platform/events/event-writer.test.ts
```

## 17. Exit Codes
`0` (Sucesso em todos os testes).

## 18. Limitações
A idempotência é garantida apenas se a `idempotency_key` for fornecida. Eventos sem chave continuam sendo persistidos normalmente a cada chamada.

## 19. Riscos Remanescentes
Nenhum identificado para este escopo.

## 20. Decisão Final
**T07_PROVEN**
