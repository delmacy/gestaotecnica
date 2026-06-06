# Fase 27 — Business Rules and Approval Policies

## Objetivo
Estabelecer motor de regras condicionais e políticas de aprovação automáticas (como timeouts).

## Contexto
O Builder deve permitir que o arquiteto humano defina regras para o runtime (ex: aprovação tácita em 24h). Isso é guardado como regra no Candidate/Workflow.

## Arquivos permitidos
- `src/features/builder/rules/rules.types.ts`
- `src/features/builder/rules/rules.engine.ts`

## Arquivos proibidos
- Não implementar Workers em background para executar os timeouts ainda.

## Regras
- A regra é apenas declarativa nesta fase. A execução real fica delegada a sistemas de cron/workers futuros.

## Etapas
1. Declarar a interface de RuleDefinition.
2. Configurar a engine que processará essas regras de negócio abstratamente.

## Validações
- Zod Validation.

## Relatório final esperado
- Regras de Negócio e Políticas modeladas.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 27 — Business Rules and Approval Policies

Objetivo:
Estabelecer motor de regras condicionais e políticas de aprovação automáticas (como timeouts).

Escopo:
Apenas definição declarativa de business rules.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Implemente o contrato TS/Zod para políticas de timeout, restrições e cargos na abstração de workflows.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Business Rules and Approval Policies. Pare e solicite review.
```
