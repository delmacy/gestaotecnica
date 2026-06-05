# Fase 18C — Service simples de avançar etapa

## Objetivo
- implementar regra mínima de avanço:
  - validar instância ativa;
  - concluir step atual;
  - avançar para próximo node simples;
  - concluir processo se chegar no end;
- não implementar branches complexos, decision avançada ou events.

## Contexto
Onde o verdadeiro Runner/Engine básico reside. Pega o estado via repository (18B), cruza com o tipo canônico (18A) e aplica as mutações lógicas na árvore processual (buscando Edges ativas) e alterando a instância global.

## Arquivos permitidos
- `src/features/workflow/runtime/step.service.ts` ou no `runtime.service.ts`

## Arquivos proibidos
- APIs Next.js e UI components.

## Regras
- Logicamente simples: Sem workers paralelos, sem assincronia cronometrada, sem delays lógicos pesados. Apenas uma engine manual síncrona "step by step".

## Etapas
1. Construir `advanceStep` e conectá-lo via dependency injection nos repositórios.
2. Calcular o next Node via Edge connections existentes no JSONB do Definition Published.

## Validações
- Teste lógico de isolamento de tenant.

## Relatório final esperado
Explicação do path-finding do Step (Como ele entende qual o próximo node).

## Regra de parada
Service escrito, finalizado.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/context-packs/runtime.md

Fase 18C — Service simples de avançar etapa

Objetivo:
Orquestrar uma engine síncrona que aplica a transição de um "process_instance_step" para "completed" e instancia o Node adjacente na tabela como o novo passo "active".

Escopo:
- Arquivos: Edite `src/features/workflow/runtime/runtime.service.ts`

Não alterar:
- UI ou Server Actions.

Regras:
1. Respeite `{ok, data} | {ok, error}` padrão de devolução de Service.
2. Lógica mínima de avanço linear ignorando splits complexos e gate-ways se inviáveis no momento. Se chegar ao final do Diagrama (End node), marque a `process_instances` como Completed.

Etapas:
1. Implemente a lógica combinando repositories.
2. Encapsule regras em try-catch seguro.

Validações:
Sem chamadas cruzadas com Frontend.

Relatório final:
Descreva o algoritmo linear adotado na lógica de Service.

Regra de parada:
Service implementado.
```