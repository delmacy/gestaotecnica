# Fase 32 — Signal Inbox and Observation Pipeline

## Objetivo
Modelar a conversão de Sinais brutos da Inbox para Observações Agênticas.

## Contexto
Os sinais coletados do n8n (e.g., mensagem de solicitação repetida no Slack) precisam de uma fila de observação onde os agentes futuros agirão.

## Arquivos permitidos
- `src/features/platform/signals/signals.types.ts`
- `src/features/platform/signals/observation.service.ts`

## Arquivos proibidos
- UI do Builder.

## Regras
- O Signal não vira Processo automaticamente. Ele vira 'Observation', agrupado em evidências para montar um Candidate.

## Etapas
1. Criar os contratos TypeScript de Sinais, Ocorrências e Evidências agrupadas.
2. Criar função local `groupSignalsIntoObservation()`.

## Validações
- Estruturas TypeScript validadas.

## Relatório final esperado
- Tipos do Observation Pipeline prontos.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 32 — Signal Inbox and Observation Pipeline

Objetivo:
Modelar a conversão de Sinais brutos da Inbox para Observações Agênticas.

Escopo:
Contratos Typescript de Sinais e Evidências.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Defina como um 'Signal' cru é convertido em 'Observation' e 'Evidence' na linguagem de Typescript.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Signal Inbox and Observation Pipeline. Pare e solicite review.
```
