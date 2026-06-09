# Fase 19B — Eventos: Repository

## Objetivo
Schema e repository base de registro (append)

## Contexto
Implementar a persistência do Event Log no banco de dados (schema workflow).

## Arquivos permitidos
- `src/features/workflow/runtime/events/events.repository.ts`
- `src/features/workflow/runtime/events/index.ts`

## Arquivos proibidos
- Uso de eventos que não sejam persistidos no PostgreSQL. Não crie interface de usuário.

## Regras
- A escrita do evento deve suportar Injeção de Dependência do DB para que possa ser salva atrelada à mesma transação do Runtime Service.

## Etapas
1. Criar a função de logEvent(db, input) usando as tipagens construídas na 19A.
2. Criar função getEventsByInstanceId(db, workspaceId, instanceId).

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

Fase 19B — Eventos: Repository

Objetivo:
Schema e repository base de registro (append)

Escopo:
- Arquivos permitidos: `src/features/workflow/runtime/events/events.repository.ts`
- `src/features/workflow/runtime/events/index.ts`

Não alterar:
Uso de eventos que não sejam persistidos no PostgreSQL. Não crie interface de usuário.

Regras:
A escrita do evento deve suportar Injeção de Dependência do DB para que possa ser salva atrelada à mesma transação do Runtime Service.

Etapas:
1. Criar a função de logEvent(db, input) usando as tipagens construídas na 19A.
2. Criar função getEventsByInstanceId(db, workspaceId, instanceId).

Validações:
Typescript e Lint sem erros.

Relatório final:
Liste os arquivos criados ou modificados.

Regra de parada:
Entregue o código e declare conclusão para revisão.
```
