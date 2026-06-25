# TASK_SB_PHASE_2_SCHEMA_CI_004_REPORT

## Objetivo
Adicionar verificação determinística de schema para CI que valide se as tabelas `builder.agent_gateway_submissions` e `workspace.workspaces` estão presentes no banco de dados, sem depender de scripts interativos que mascaram falhas ou destroem o histórico de migrações.

## Arquivos Alterados

- `package.json`: Adicionado o script `"db:verify-ci": "npx tsx src/scripts/db/verify-schema-ci.ts"` para expor o comando na pipeline CI sem comandos interativos.
- `src/scripts/db/verify-schema-ci.ts`: Novo script criado para conectar ao banco, via `getPlatformDb()` e `getRuntimeDb()`, e verificar de forma determinística via `information_schema` a existência das tabelas obrigatórias. Retorna erro de saída com `process.exit(1)` em caso de banco ausente ou tabelas faltantes.
- Nenhuma migration nova foi criada, pois as tabelas já estavam declaradas nos arquivos de export do schema TypeScript e a necessidade inicial não demandava correções lógicas nos exports (o schema `builder` e `workspace` já as incluem).

## Comandos Executados e Resultados Reais

1. `npm run check:architecture`: **SUCESSO** (`✅ Validação de arquitetura aprovada!`).
2. `npm run db:validate` (com `DATABASE_URL` local dummy): **SUCESSO** (`Nenhuma operação com --force permitida. Migrações validadas e seguras para prosseguir.`).
3. `DATABASE_URL="postgres://postgres:postgres@localhost:5432/postgres" npm run db:verify-ci`: **FALHOU CORRETAMENTE** como o esperado localmente, retornando código de saída `1` devido à falta de tabelas no banco de desenvolvimento (simulando um cenário onde as migrações não haviam sido devidamente processadas).
4. `npm run test:unit`: **EXECUTADO/FALHOU** - O teste falhou em dois casos devido a precondições ambientais da sandbox: `collectHistoricalDiff rejects mismatched files` falhou devido a falta de escopo real do git para `HEAD~1` na verificação de branches isoladas locais, e o `Operational Proof Logic Unit Test` devido a falta da env variável `AGENT_WORK_TEST_DATABASE_URL` no runtime (banco de testes não provisionado). Nenhuma falha está associada às mudanças efetuadas pela task atual.

## Riscos

A execução da ferramenta de verify na pipeline CI não mascara erros, então um banco de dados temporário devidamente provisionado ou credenciais de banco reais em fase de teste e2e são cruciais antes de chamar o `db:verify-ci`. O script exige `DATABASE_URL` no escopo, caso contrário, falha por padrão com erro 1 em vez de ignorar e passar.

_Status de Gate:_ **Gate Não Concluído** - candidato para revisão do CI flow.
