@jules

Corrija a PR #365 na mesma branch.

O typecheck falha porque `tests/platform/events/event-batch.test.ts` usa `crypto.randomUUID` sem importar o namespace `crypto`. Não resolva com declaração global nem mantenha monkeypatch de `crypto.randomUUID`.

Substitua integralmente o teste `should rollback all events if a database failure occurs mid-batch` por uma prova real e determinística usando trigger temporário do PostgreSQL:

- gere `traceType`, nome de função e nome de trigger únicos e seguros;
- consulte a contagem inicial diretamente em `workflow.events` filtrando `workspace_id` e `event_type`;
- crie função PL/pgSQL que execute `RAISE EXCEPTION` quando `NEW.event_type = traceType` e `NEW.payload->>'n' = '2'`;
- crie trigger `BEFORE INSERT` em `workflow.events` usando essa função;
- execute lote com dois eventos do mesmo `traceType`, payloads `{ n: 1 }` e `{ n: 2 }`;
- valide `EventStoreError.code === "TRANSACTION_FAILURE"`;
- use `try/finally` para sempre executar `DROP TRIGGER IF EXISTS` e `DROP FUNCTION IF EXISTS`;
- consulte a contagem final diretamente e comprove igualdade com a contagem inicial;
- remova comentários exploratórios, variáveis não usadas e qualquer alteração global de `crypto`;
- mantenha apenas imports utilizados;
- atualize `T08_TRANSACTIONAL_BATCH_REPORT.md` para descrever trigger, contagem antes/depois e limpeza em `finally`;
- execute typecheck, testes T07/T08 e build;
- remova este arquivo `T08_FIX_REQUEST.md` no mesmo commit final.

Não altere schema, migration ou artefatos da T07.