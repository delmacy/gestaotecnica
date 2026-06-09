# Fase 17B — Runtime repository

## Objetivo
- criar repository para processInstances, processPayloads e actionExecutions;
- usar schema existente;
- não criar service, server action ou UI;
- não criar events.

## Contexto
Com os contratos de tipos estabilizados na 17A, agora precisamos de uma camada agnóstica para transacionar com o banco PostgreSQL.

## Arquivos permitidos
- `src/features/workflow/runtime/runtime.repository.ts`
- `src/features/workflow/runtime/runtime.queries.ts` (Opcional, se a arquitetura exigir separação)

## Arquivos proibidos
- `src/features/workflow/runtime/runtime.service.ts`
- Server actions
- Frontend / UI

## Regras
- O Repository recebe um DB Drizzle por Injeção de Dependências (como um client) e não invoca diretamente a factory interna exceto se especificado no padrão do projeto.
- Filtro obrigatório de isolamento por `workspace_id`.

## Etapas
1. Crie funções de inserção e busca para `processInstances`, `processPayloads` e `actionExecutions` no `runtime.repository.ts`.

## Validações
- Compilação sem falhas baseando-se nos tipos do bloco 17A.

## Relatório final esperado
Listagem dos métodos de query isoladas.

## Regra de parada
Após fechar `runtime.repository.ts`, termine.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/context-packs/persistence.md
docs/context-packs/runtime.md

Fase 17B — Runtime repository

Objetivo:
Criar e estabilizar as funções de leitura/escrita do banco para o Runtime, providenciando interface transacional limpa e isolada via isolamento de workspace (tenant).

Escopo:
- Arquivos a criar:
  src/features/workflow/runtime/runtime.repository.ts

Não alterar:
Não crie UI, server actions ou services de regra de negócio.

Regras:
Receba a instância de DB por parâmetro (Injeção) para suportar transações atômicas `db.transaction(...)` quando no Service futuramente. Forçar `workspaceId` nas queries.

Etapas:
1. Construa e tipifique `createProcessInstance`, `getProcessInstanceById`, etc., usando os tipos da 17A.

Validações:
Nenhum any, 100% de type compliance.

Relatório final:
Liste as funções expostas pelo repository e não inclua testes integrados reais de backend.

Regra de parada:
Apenas o Repository.
```