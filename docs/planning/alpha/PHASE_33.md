# Fase 33 — Document Agent and Living Procedures

## Objetivo
Suportar a documentação baseada em processo (Living Procedures) gerada pelo Document Agent.

## Contexto
O System Builder não quer manuais estáticos. Ele deve permitir anexar 'Documentation Nodes' ou resumos autogerados ligados a uma versão do Workflow.

## Arquivos permitidos
- `src/features/builder/documentation/documentation.types.ts`

## Arquivos proibidos
- Motor de Geração via OpenAI API.

## Regras
- O Documento (procedimento operacional) é uma view do Processo, não um arquivo no Google Drive.

## Etapas
1. Criar modelo para `LivingProcedure` atrelado a um `ProcessVersionId`.
2. Inserir suporte de metadados no schema de Workflow.

## Validações
- TypeScript compila perfeitamente com os novos metadados atrelados às Definições de Processo.

## Relatório final esperado
- Suporte a metadados de Procedimentos vivos adicionados.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 33 — Document Agent and Living Procedures

Objetivo:
Suportar a documentação baseada em processo (Living Procedures) gerada pelo Document Agent.

Escopo:
Modelagem local dos metadados de Documentação Viva atrelados a processos.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Crie o modelo para armazenar resumos descritivos de Procedimentos Operacionais vinculados à Versão de um Processo.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Document Agent and Living Procedures. Pare e solicite review.
```
