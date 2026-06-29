# SB-S02-T08 — Correção final da PR #365

Este arquivo registra a correção necessária para tornar a prova de rollback determinística e remover o erro de typecheck.

## Teste de rollback

No arquivo `tests/platform/events/event-batch.test.ts`, substituir o teste `should rollback all events if a database failure occurs mid-batch` por uma prova baseada em trigger temporário do PostgreSQL:

1. gerar um `traceType` único;
2. consultar e registrar a contagem inicial diretamente em `workflow.events` para o workspace e event type;
3. criar uma função de trigger com nome único que execute `RAISE EXCEPTION` quando `NEW.event_type = traceType` e `NEW.payload->>'n' = '2'`;
4. criar trigger `BEFORE INSERT` em `workflow.events` usando essa função;
5. executar `appendDomainEventBatch` com dois eventos, `n: 1` e `n: 2`;
6. validar `EventStoreError.code === "TRANSACTION_FAILURE"`;
7. em bloco `finally`, executar `DROP TRIGGER IF EXISTS` e `DROP FUNCTION IF EXISTS`;
8. consultar a contagem final diretamente e comprovar que ela é igual à contagem inicial.

Não sobrescrever `crypto.randomUUID`. Remover todas as variáveis, comentários exploratórios e transações vazias relacionados à tentativa anterior.

## Imports

Manter apenas imports realmente utilizados. O teste atual usa `crypto.randomUUID` sem importar o namespace `crypto`, causando falha de TypeScript. Com a trigger, nenhum import adicional de `crypto` é necessário.

## Relatório

Atualizar `T08_TRANSACTIONAL_BATCH_REPORT.md` para descrever a trigger temporária, a contagem direta antes/depois e a limpeza em `finally`. Remover a afirmação de colisão de PK por mock de UUID.

Após a correção, executar typecheck, testes da T07/T08 e build. Este arquivo deve ser removido antes do merge final.