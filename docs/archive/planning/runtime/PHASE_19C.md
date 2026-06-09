# Fase 19C — Eventos: Integração

## Objetivo
Injetar disparo no Runtime service

## Contexto
Integrar o disparo dos eventos no Runtime Service para os fluxos de instanciação e avanço de etapa.

## Arquivos permitidos
- `src/features/workflow/runtime/runtime.service.ts`
- `src/features/workflow/runtime/runtime-step.service.ts` (se existir)

## Arquivos proibidos
- Refatorações massivas ou quebras de contrato das interfaces expostas.

## Regras
- Garantir que a gravação do evento ocorra atrelada ao mesmo commit de alteração da instância/passo.

## Etapas
1. Em `startProcessInstance`, adicione a chamada para `logEvent(db, { type: 'process.started', ... })`.
2. Em `advanceStep`, adicione logs de início e término de ação.

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

Fase 19C — Eventos: Integração

Objetivo:
Injetar disparo no Runtime service

Escopo:
- Arquivos permitidos: `src/features/workflow/runtime/runtime.service.ts`
- `src/features/workflow/runtime/runtime-step.service.ts` (se existir)

Não alterar:
Refatorações massivas ou quebras de contrato das interfaces expostas.

Regras:
Garantir que a gravação do evento ocorra atrelada ao mesmo commit de alteração da instância/passo.

Etapas:
1. Em `startProcessInstance`, adicione a chamada para `logEvent(db, { type: 'process.started', ... })`.
2. Em `advanceStep`, adicione logs de início e término de ação.

Validações:
Typescript e Lint sem erros.

Relatório final:
Liste os arquivos criados ou modificados.

Regra de parada:
Entregue o código e declare conclusão para revisão.
```
