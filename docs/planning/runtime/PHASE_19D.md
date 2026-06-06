# Fase 19D — Eventos: Trace Receipt

## Objetivo
Estrutura de rastreio/comprovante simples

## Contexto
Criar Server Action que expõe uma timeline serializável para a UI demonstrando o comprovante histórico da execução de um Processo.

## Arquivos permitidos
- `src/features/workflow/runtime/events/events.server.ts`
- `src/features/workflow/runtime/events/events.actions.ts`

## Arquivos proibidos
- Frontend complexo.

## Regras
- Os comprovantes devem ser blindados por `workspaceId`.

## Etapas
1. Criar `events.server.ts` invocando o repository.
2. Expor a função `getTimelineForInstanceAction` em `events.actions.ts`.

## Validações
- Compilação do TypeScript sem erros (`npm run typecheck` / npx tsc --noEmit).
- Lint correto.

## Relatório final esperado
- Lista dos arquivos alterados e confirmados.

## Regra de parada
- Não inicie a implementação da fase seguinte. Entregue apenas o escopo atual.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 19D — Eventos: Trace Receipt

Objetivo:
Estrutura de rastreio/comprovante simples

Escopo:
- Arquivos permitidos: `src/features/workflow/runtime/events/events.server.ts`
- `src/features/workflow/runtime/events/events.actions.ts`

Não alterar:
Frontend complexo.

Regras:
Os comprovantes devem ser blindados por `workspaceId`.

Etapas:
1. Criar `events.server.ts` invocando o repository.
2. Expor a função `getTimelineForInstanceAction` em `events.actions.ts`.

Validações:
Typescript e Lint sem erros.

Relatório final:
Liste os arquivos criados ou modificados.

Regra de parada:
Entregue o código e declare conclusão para revisão.
```
