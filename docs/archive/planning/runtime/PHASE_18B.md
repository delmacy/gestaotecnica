# Fase 18B — Repository de steps

## Objetivo
- criar funções de leitura/escrita para steps;
- buscar step ativo;
- marcar step como completed;
- criar próximo step como active/pending, conforme regra simples;
- não criar service complexo;
- não criar events.

## Contexto
Camada persistente para isolar o Drizzle ao manipular a entidade `process_instance_steps` individualmente.

## Arquivos permitidos
- `src/features/workflow/runtime/step.repository.ts` ou expandir o `runtime.repository.ts`

## Arquivos proibidos
- Não construa os Services nem UI.

## Regras
- Apenas SQL genérico traduzido via Drizzle (e.g. Update de flag status).

## Etapas
1. Implementar `getActiveStep`.
2. Implementar `updateStepStatus`.

## Validações
- Compilação sem problemas, isolamento DB assegurado.

## Relatório final esperado
Listagem dos novos repositórios disponíveis.

## Regra de parada
Após fechar o Repositório, encerre a fase.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/context-packs/runtime.md

Fase 18B — Repository de steps

Objetivo:
Criar camada agnóstica de banco de dados baseada em Drizzle para realizar buscas, updates e inserts exclusivos a `process_instance_steps`.

Escopo:
- Arquivos: Modifique ou adicione em `src/features/workflow/runtime/runtime.repository.ts` as diretrizes.

Não alterar:
- Frontend ou Server Actions.

Regras:
1. Permita alterar os dados do JsonB de Output.

Etapas:
1. Exporte queries básicas focadas no controle transacional da etapa.

Validações:
Typescript compliace test.

Relatório final:
Assinaturas exportadas pelo arquivo repository.

Regra de parada:
Fechou os métodos, finalizou fase.
```