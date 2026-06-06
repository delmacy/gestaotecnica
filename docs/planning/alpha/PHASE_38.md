# Fase 38 — Security, Privacy and Consent for Observation

## Objetivo
Adicionar escopo de consentimento nos níveis de Workspace.

## Contexto
Para ler Slack ou E-mail via n8n, o Workspace precisa autorizar explicitamente a coleta de sinais (Opt-in).

## Arquivos permitidos
- `src/features/platform/workspaces/workspace.types.ts`
- `src/db/runtime/schema/workspaces.ts`

## Arquivos proibidos
- Migrations automáticas do Drizzle no banco de dados de produção.

## Regras
- A autorização é um JSONB dentro do Workspace definindo `dataCollectionOptIn: true | false`.

## Etapas
1. Atualizar schema local de `workspaces.ts` para suportar as flags de consentimento de observação.
2. Atualizar contratos TS.

## Validações
- Drizzle TS validation.

## Relatório final esperado
- Schema preparado para a governança de privacidade.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 38 — Security, Privacy and Consent for Observation

Objetivo:
Adicionar escopo de consentimento nos níveis de Workspace.

Escopo:
Modificação do Schema do Workspace para Flags de consentimento.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Introduza no Drizzle Schema do Workspace as diretivas e configurações ativas de privacidade e coleta de dados agênticos.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Security, Privacy and Consent for Observation. Pare e solicite review.
```
