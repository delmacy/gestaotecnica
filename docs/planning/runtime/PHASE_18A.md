# Fase 18A — Contratos de execução de etapa

## Objetivo
- criar tipos para avançar etapa;
- definir input/output de step;
- definir resultado de avanço;
- não implementar engine, UI, ou events.

## Contexto
Uma instância em andamento baseia sua transição na resolução de steps individuais. É necessário criar em Typescript o modelo de input, execução, erro e output da passagem entre o estado Active para Completed em um Node da topologia do processo.

## Arquivos permitidos
- `src/features/workflow/runtime/step-execution.types.ts` (ou acoplado em `runtime.types.ts`)

## Arquivos proibidos
- Códigos executáveis (services, loops de transição).
- UI/Server actions.

## Regras
- Contratos TypeScript robustos (interfaces estritas e schemas Zod) validando estados.

## Etapas
1. Mapeie `StepInput`, `StepOutput` e `StepResult`.

## Validações
- Compilação typescript perfeitamente aprovada.

## Relatório final esperado
Modelagem de estado em formato de texto para análise e verificação.

## Regra de parada
Criação dos tipos finalizada, pare.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/context-packs/runtime.md

Fase 18A — Contratos de execução de etapa

Objetivo:
Definir em TS e Zod o fluxo de dados transitando em um passo do Workflow Runtime sem implementar engine operacional (o service loop).

Escopo:
- Arquivos: Modifique `src/features/workflow/runtime/runtime.types.ts` ou crie equivalente para lidar estritamente com os Steps.

Não alterar:
- Serviços reais e UI.

Regras:
1. Pense em `input` e `output` como JSONBs tipados genéricos ou Zod AnyRecord.

Etapas:
1. Exporte Modelos como `StepExecutionInput`, `StepExecutionOutput`, e as Flags dos possíveis status (`active`, `pending`, `completed`).

Validações:
Typescript compliace test.

Relatório final:
Informe as estruturas finais consolidadas.

Regra de parada:
Fechou tipos, finalizou fase.
```