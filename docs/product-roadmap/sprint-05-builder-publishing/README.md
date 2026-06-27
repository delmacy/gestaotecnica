# Sprint 05 — Builder e publicação

## SB-S05-T21 — Contrato de draft e publicação
Planejamento. Definir draft, validação, versão publicada, rollback e concorrência.

## SB-S05-T22 — Editor de processo em draft
Desenvolvimento após T21. Editar etapas, estados, transições, forms e actions. Aceite: autosave versionado e conflito detectado.

## SB-S05-T23 — Validador e simulador de processo
Desenvolvimento paralelo após T21. Detectar estados inalcançáveis, keys duplicadas, transições inválidas e referências ausentes. Preview não altera runtime.

## SB-S05-T24 — Publicação atômica e rollback
Desenvolvimento após T22 e T23. Publicar versão validada e preservar a anterior. Falha mantém o runtime atual intacto.

## SB-S05-T25 — Golden path do Builder
Teste e review após T24. Cobrir draft, validação, preview, publish, diff e rollback por fixture reproduzível.

## Prompt Jules
Busque a task `<ID>` em `docs/product-roadmap/sprint-05-builder-publishing/README.md` e publique PR isolado.