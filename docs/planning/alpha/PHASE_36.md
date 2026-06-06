# Fase 36 — Process Improvement Proposals

## Objetivo
Estabelecer o framework para submissão e avaliação de melhorias de processo.

## Contexto
Para evitar caos, agentes e humanos não editam diretamente um processo ativo; eles sugerem um 'Process Improvement Proposal' ligado àquele Processo.

## Arquivos permitidos
- `src/features/builder/improvements/proposal.types.ts`

## Arquivos proibidos
- Alteração destrutiva em versões ativas de `workflow.process_versions`.

## Regras
- Uma melhoria é fundamentalmente um Process Candidate derivado (forked) de um workflow existente.

## Etapas
1. Modelar a extensão `ImprovementProposal` herdando a estrutura do `ProcessCandidate`, adicionando o campo `originalProcessDefinitionId`.
2. Definir campos para `expectedImpact` e `risk`.

## Validações
- Tipagem Typescript estrita.

## Relatório final esperado
- Tipos base da extensão de melhorias concluídos.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 36 — Process Improvement Proposals

Objetivo:
Estabelecer o framework para submissão e avaliação de melhorias de processo.

Escopo:
Modelagem de propostas de melhoria (Tipos TS).

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Desenvolva as interfaces TS que acoplam a tese de propostas de melhoria a Processos previamente publicados.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Process Improvement Proposals. Pare e solicite review.
```
