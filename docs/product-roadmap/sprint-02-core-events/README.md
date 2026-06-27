# Sprint 02 — Contratos centrais e eventos

Objetivo: estabilizar a infraestrutura canônica de eventos antes das integrações comerciais.

## SB-S02-T06 — Finalizar Canonical Event Contract
Tipo: desenvolvimento. Modo: sequencial. Escopo: `src/platform/events/**` e testes próprios. Entrega: contrato versionado, writer central e queries tenant-aware. Aceite: workspace e actor vêm do contexto; eventos são append-only; payload e versão são validados.

## SB-S02-T07 — Idempotência concorrente de eventos
Tipo: desenvolvimento. Depende: T06. Entrega: garantia transacional ou constraint por workspace e idempotency key. Aceite: duas gravações simultâneas persistem um único evento.

## SB-S02-T08 — Lotes transacionais de eventos
Tipo: desenvolvimento. Modo: paralelo após T06. Entrega: append batch atômico. Aceite: falha intermediária não deixa lote parcial e a ordem é preservada.

## SB-S02-T09 — Revisão de isolamento e append-only
Tipo: review. Depende: T07 e T08. Entrega: auditoria independente de queries, constraints, updates/deletes e leaks. Aceite: nenhum update/delete operacional e nenhum histórico cross-tenant.

## SB-S02-T10 — Suite integrada de eventos
Tipo: teste. Depende: T09. Entrega: testes de idempotência, batch, ordering, correlation, causation, paginação e falhas em banco isolado.

## Prompt Jules
Busque a task `<ID>` em `docs/product-roadmap/sprint-02-core-events/README.md` e execute somente essa task em branch limpa baseada na main.