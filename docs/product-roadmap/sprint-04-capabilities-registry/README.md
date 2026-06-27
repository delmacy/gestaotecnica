# Sprint 04 — Capabilities e manifests

## SB-S04-T16 — Consolidar contrato de manifests
Planejamento sequencial. Criar schema único com key, version, routes, actions, events, dependencies e persistence mode. Aceite: manifest validado e sem duplicidade.

## SB-S04-T17 — Resolver dependências de capabilities
Desenvolvimento após T16. Implementar dependências obrigatórias, opcionais, incompatibilidades e ciclos. Aceite: instalação inválida falha antes de mutações.

## SB-S04-T18 — Instalar, ativar e desativar módulos
Desenvolvimento paralelo após T16. Implementar lifecycle tenant-aware com histórico e configuração versionada. Aceite: módulo desativado sai da navegação e permissões sem apagar histórico.

## SB-S04-T19 — Auditar registry e ciclos
Review após T17 e T18. Auditar keys duplicadas, imports, ciclos e acoplamentos. Aceite: nenhum manifest inválido chega ao runtime.

## SB-S04-T20 — Suite de instalação e rollback
Teste após T19. Cobrir instalação, dependência ausente, ciclo, incompatibilidade, cross-tenant e rollback. Aceite: falha não deixa estado parcial.

## Prompt Jules
Busque a task `<ID>` em `docs/product-roadmap/sprint-04-capabilities-registry/README.md` e execute somente esse contrato.