# TASK_SB_PHASE_2_SCHEMA_CI_004_REPORT

## Objetivo
Adicionar verificação determinística de schema para CI que valide se as tabelas `builder.agent_gateway_submissions` e `workspace.workspaces` estão presentes no banco de dados, sem depender de scripts interativos que mascaram falhas ou destroem o histórico de migrações.

## Arquivos Alterados

- `package.json`: Adicionado o script `"db:verify-ci": "npx tsx src/scripts/db/verify-schema-ci.ts"` para expor o comando na pipeline CI.
- `src/scripts/db/verify-schema-ci.ts`: Novo script que utiliza `postgres` diretamente. Isso evita importações de nível superior (`top-level`) do ORM que quebram caso a `DATABASE_URL` esteja ausente antes do bloco try/catch. O script agora verifica determinísticamente (`information_schema`) a existência das tabelas, executa o `client.end()` limpo, e retorna saída coerente via `process.exitCode = 1`.
- `.github/workflows/schema-ci-gate.yml`: Pipeline do GitHub Actions adicionada. Levanta um container real de PostgreSQL 15, executa a seed/migrations via `npm run db:migrate` e em seguida roda a verificação `npm run db:verify-ci`.

_Nenhuma migration nova foi criada, pois as tabelas já estavam declaradas nos arquivos de export do schema TypeScript e a necessidade inicial não demandava correções lógicas nos exports. O diretório drizzle/ foi mantido intacto._

## Comandos Executados e Resultados Reais

1. `npm run check:architecture`: **SUCESSO** (`✅ Validação de arquitetura aprovada!`).
2. `npm run db:validate` (com dummy `DATABASE_URL`): **SUCESSO** (`Nenhuma operação com --force permitida. Migrações validadas e seguras para prosseguir.`).
3. `unset DATABASE_URL PLATFORM_DATABASE_URL RUNTIME_DATABASE_URL AGENT_WORK_TEST_DATABASE_URL && npm run db:verify-ci`: **FALHOU CORRETAMENTE** logando `ERRO: DATABASE_URL, PLATFORM_DATABASE_URL ou RUNTIME_DATABASE_URL is not set.` pois não há banco configurado.
4. `DATABASE_URL="postgres://dummy" npm run db:verify-ci` (Simulando banco não existente/acessível): **FALHOU CORRETAMENTE** com exit code `1` lidando com o fato das tabelas obrigatórias não existirem.

## Riscos

A execução da ferramenta de verify na pipeline CI não mascara erros. O workflow `.github/workflows/schema-ci-gate.yml` garante que um container real do banco é gerado e preenchido antes da validação. Sem o container ou sem `DATABASE_URL`, o processo falha por padrão com erro `1` em vez de ignorar e passar.

_Status de Gate:_ **Gate Não Concluído** - candidato para revisão.
