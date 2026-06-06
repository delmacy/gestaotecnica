# Fase 35 — Metrics and Process Intelligence

## Objetivo
Criar os stubs e funções de leitura agregada para Métricas do Runtime.

## Contexto
Sem métricas, o agente não propõe melhorias baseadas em dados. Precisamos extrair Lead Time e Taxa de Rejeição das Action Executions.

## Arquivos permitidos
- `src/features/workflow/runtime/metrics/metrics.queries.ts`

## Arquivos proibidos
- UI de Dashboard complexa ou Bibliotecas Gráficas externas.

## Regras
- Focar exclusivamente na agregação de dados via queries do banco PostgreSQL.

## Etapas
1. Criar função `getProcessLeadTimeAverage()` agregando `action_executions`.
2. Criar função `getApprovalRejectionRates()`.

## Validações
- Queries válidas utilizando Drizzle ORM.

## Relatório final esperado
- Camada de leitura agregada de métricas do runtime prontas.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 35 — Metrics and Process Intelligence

Objetivo:
Criar os stubs e funções de leitura agregada para Métricas do Runtime.

Escopo:
Queries de extração de relatórios base em `metrics.queries.ts`.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Crie as consultas SQL (via Drizzle) focadas em extrair inteligência a partir da tabela de eventos de execução e passos.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Metrics and Process Intelligence. Pare e solicite review.
```
