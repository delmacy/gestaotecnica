# Sprint 08 — Promoção para persistência tipada

## SB-S08-T36 — Readiness de persistência tipada
Planejamento sequencial. Avaliar Case Management, Approval e Inventory quanto a campos, relações, enums, constraints, índices, volume e estabilidade de contrato. Aceite: cada piloto recebe status ready, blocked ou deferred com evidências.

## SB-S08-T37 — Framework de profiling e quarentena
Desenvolvimento após T36. Criar profiling read-only, validação de payload versionado e relatórios de inválidos, ambíguos e órfãos. Aceite: nenhuma mutação durante profiling.

## SB-S08-T38 — Backfill idempotente e dry-run
Desenvolvimento paralelo após T36. Criar runner com dry-run, preserve/remap de IDs, checkpoints e reconciliação de contagens. Aceite: repetição não duplica dados.

## SB-S08-T39 — Auditoria de cutover e rollback
Review após T37 e T38. Revisar dual-read/adapter, concorrência, critérios de cutover, rollback e evidências. Aceite: plano por etapa com precondição e abort criteria.

## SB-S08-T40 — Ensaio de promoção dos pilotos
Teste após T39. Executar ambiente isolado, backfill, validação, troca de leitura e rollback. Aceite: contagens, relacionamentos e tenant ownership reconciliados.

## Prompt Jules
Busque a task `<ID>` em `docs/product-roadmap/sprint-08-typed-persistence/README.md`; nenhuma migração destrutiva fora do ambiente autorizado.