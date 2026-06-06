# Fase 34 — Feature Agent and Controlled Change

## Objetivo
Modelar o fluxo de propostas de alteração de sistema guiado pelo Feature Agent.

## Contexto
Quando um candidato altera uma action ou módulo existente, ele aciona o fluxo de Change Request. Esse processo visa controlar a alteração estrutural da Plataforma.

## Arquivos permitidos
- `src/features/platform/change-management/change.types.ts`

## Arquivos proibidos
- Código dinâmico em produção (Eval/CodeGen).

## Regras
- O Feature Agent propõe 'planos técnicos'. O Humano revisa. O Dev implementa.

## Etapas
1. Definir estrutura de `FeatureProposal` contendo `ProcessAffected`, `ExpectedImpact`, `TechnicalPlan`.

## Validações
- Estruturas TS imutáveis validadas.

## Relatório final esperado
- Contratos de Gestão de Mudança implementados.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 34 — Feature Agent and Controlled Change

Objetivo:
Modelar o fluxo de propostas de alteração de sistema guiado pelo Feature Agent.

Escopo:
Tipagens de Change Management no System Builder.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Crie a interface em TypeScript modelando uma Feature Proposal de acordo com a tese de agentes limitados.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Feature Agent and Controlled Change. Pare e solicite review.
```
