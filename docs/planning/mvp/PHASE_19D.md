# Fase 19D — Trace receipt mínimo

## Objetivo
- criar estrutura simples de comprovante/rastreio do log;
- vincular eventos básicos à UI ou em log endpoint;
- não gerar PDF, nem doc real.

## Contexto
Temos que visualizar a rastreabilidade capturada (Fase 19B/19C). Um "Trace Receipt" é um resumo estático em JSON ou View que atesta a linha temporal imutável de um processo concluído ou andamento.

## Arquivos permitidos
- `src/features/workflow/runtime/runtime.actions.ts` (Exportando consulta do receipt)
- Novo Componente na UI do Builder ou Process Viewer (Se cabível num painel Timeline já existente do MVP).

## Arquivos proibidos
- Manipulação pesada do DOM com bibliotecas gráficas avançadas não mapeadas.

## Regras
- Renderização limpa da lista de logs por Process Instance ID.

## Etapas
1. Server action `getProcessInstanceReceiptAction` listando `listEventsByInstance`.
2. Mostrar um simples `<pre>` tag json ou timeline list html.

## Validações
- Teste ponta a ponta na UI.

## Relatório final esperado
Print/Descritivo da exibição visual.

## Regra de parada
Após exibição raw dos eventos no UI, finalize a fase 19.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/context-packs/runtime-events.md

Fase 19D — Trace receipt mínimo

Objetivo:
Permitir a visualização rápida e in-app dos logs coletados de rastreabilidade (eventos) provando o valor do tracking gerado durante o runtime.

Escopo:
- Arquivos: `src/features/workflow/runtime/runtime.actions.ts` e UI correspondente de Timeline/Logs do Processo.

Não alterar:
Core Engine (Service já faz os emits corretamente).

Regras:
1. Action lê os logs, Front-end exibe num loop (React map).
2. Sem relatórios em PDF. Foco total num design minimalista.

Etapas:
1. Exponha o Server action com `use server`.
2. Crie ou atrele num panel de Timeline/Rastreamento da Instância ativa.

Validações:
Nenhum crash visual quando array de eventos é zero ou massivo.

Relatório final:
Relate o componente visual modificado/criado.

Regra de parada:
Fechou o PR com os visual components acoplados ao Trace, pare.
```