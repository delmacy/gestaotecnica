# Fase 23 — Process Candidate Data Model

## Objetivo
Implementar o modelo físico Drizzle para suportar Process Candidates.

## Contexto
Após definir a ontologia e a UI, materializamos o schema lógico PostgreSQL no diretório do platform/builder.

## Arquivos permitidos
- `src/db/platform/schema/candidates.ts`
- `src/db/platform/schema/index.ts`

## Arquivos proibidos
- Repositories e Services.
- Execução de `db:push` no ambiente (apenas definição de código).

## Regras
- Exigir `workspaceId` em todas as tabelas para Tenant Isolation.
- Tabelas: `process_candidates`, `process_candidate_states`, etc.

## Etapas
1. Desenvolver o arquivo `candidates.ts` no Drizzle.
2. Referenciar FKs para `workspaces` adequadamente.
3. Exportar no `index.ts` central.

## Validações
- `npm run db:generate` passa com sucesso localmente.

## Relatório final esperado
- Definições Drizzle exportadas e alinhadas aos tipos do bloco 21.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 23 — Process Candidate Data Model

Objetivo:
Implementar o modelo físico Drizzle para suportar Process Candidates.

Escopo:
Restrito à pasta `src/db/platform/schema/`.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Crie o schema Drizzle mapeando a entidade ProcessCandidate.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Process Candidate Data Model. Pare e solicite review.
```
