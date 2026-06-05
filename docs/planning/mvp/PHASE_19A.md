# Fase 19A — Contratos de eventos

## Objetivo
- criar tipos de eventos mínimos: `process.started`, `step.completed`, `process.completed`;
- não criar event bus complexo, outbox, ou n8n.

## Contexto
O primeiro passo para garantir rastreabilidade. Em vez de acoplar o banco legado desde o início, definimos um vocabulário TypeScript imutável de eventos base.

## Arquivos permitidos
- `src/features/workflow/runtime/events/event.types.ts` ou agrupar com `runtime.types.ts` dependendo da organização.

## Arquivos proibidos
- Services e persistências físicas.

## Regras
- Contrato baseado em enum ou string literal unificada e Zod payload seguro.

## Etapas
1. Mapeie os tipos TypeScript.

## Validações
- Compilador TypeScript ok.

## Relatório final esperado
Listagem dos tipos literais.

## Regra de parada
Tipos mapeados e aprovados.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/context-packs/runtime-events.md

Fase 19A — Contratos de eventos

Objetivo:
Criar um catálogo/tipagem unificada para registrar trilhas de execução de workflows em formatos imutáveis (`process.started`, `step.completed`, etc).

Escopo:
- Arquivos: `src/features/workflow/runtime/events.types.ts` ou local adjacente.

Não alterar:
Repositories e Services físicos do banco. Sem integração legacy.

Regras:
1. Trabalhe em tipos TS genéricos que recebam um `Payload` agnóstico mas com nome do Evento estrito.

Etapas:
1. Declare e exporte os tipos base.

Validações:
Isolamento em Type files (não conter runtime JS execution complexa).

Relatório final:
O Type signature do EventBase e variações construídas.

Regra de parada:
Fechou os tipos em TypeScript.
```