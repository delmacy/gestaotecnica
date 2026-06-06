# Fase 19A — Eventos: Contratos

## Objetivo
Tipos mínimos de eventos (`started`, `completed`)

## Contexto
Criar os contratos e tipagens Zod para registro de eventos (event log) associados à execução de instâncias.

## Arquivos permitidos
- `src/features/workflow/runtime/events/events.types.ts`
- `src/features/workflow/runtime/events/events.validation.ts`
- `src/features/workflow/runtime/events/index.ts`

## Arquivos proibidos
- Implementação de lógica de fila pub/sub ou services assíncronos.

## Regras
- Criar enums estritos para os eventos que suportaremos neste MVP (`process.started`, `process.completed`, `step.started`, `step.completed`). A payload deve ser tipada como Record<string, unknown>.

## Etapas
1. Definir os tipos TypeScript.
2. Definir esquemas Zod.
3. Exportar as definições em index.ts.

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

Fase 19A — Eventos: Contratos

Objetivo:
Tipos mínimos de eventos (`started`, `completed`)

Escopo:
- Arquivos permitidos: `src/features/workflow/runtime/events/events.types.ts`
- `src/features/workflow/runtime/events/events.validation.ts`
- `src/features/workflow/runtime/events/index.ts`

Não alterar:
Implementação de lógica de fila pub/sub ou services assíncronos.

Regras:
Criar enums estritos para os eventos que suportaremos neste MVP (`process.started`, `process.completed`, `step.started`, `step.completed`). A payload deve ser tipada como Record<string, unknown>.

Etapas:
1. Definir os tipos TypeScript.
2. Definir esquemas Zod.
3. Exportar as definições em index.ts.

Validações:
Typescript e Lint sem erros.

Relatório final:
Liste os arquivos criados ou modificados.

Regra de parada:
Entregue o código e declare conclusão para revisão.
```
