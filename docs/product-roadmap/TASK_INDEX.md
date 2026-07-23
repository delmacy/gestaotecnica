# Índice das 50 tasks

| ID | Sprint | Tipo | Título | Modo |
|---|---:|---|---|---|
| SB-S01-T00 | 01 | planejamento preparatório | Preparar fontes e modelo verificável do inventário | antes da T01 |
| SB-S01-T01 | 01 | planejamento | Inventariar backlog e PRs existentes | sequencial |
| SB-S01-T02 | 01 | planejamento | Normalizar IDs, estados e dependências | paralelo após T01 |
| SB-S01-T03 | 01 | desenvolvimento | Criar validador do catálogo de tasks | paralelo após T01 |
| SB-S01-T04 | 01 | review | Auditar escopo e duplicidades | após T02–T03 |
| SB-S01-T05 | 01 | teste | Provar fluxo de descoberta pelo Jules | após T04 |
| SB-S02-T06 | 02 | desenvolvimento | Finalizar Canonical Event Contract | sequencial |
| SB-S02-T07 | 02 | desenvolvimento | Idempotência concorrente de eventos | após T06 |
| SB-S02-T08 | 02 | desenvolvimento | Lotes transacionais de eventos | paralelo após T06 |
| SB-S02-T09 | 02 | review | Revisão de isolamento e append-only | após T07–T08 |
| SB-S02-T10 | 02 | teste | Suite integrada de eventos | após T09 |
| SB-S03-T11 | 03 | planejamento | Contrato de onboarding comercial | sequencial |
| SB-S03-T12 | 03 | desenvolvimento | Wizard de workspace | após T11 |
| SB-S03-T13 | 03 | desenvolvimento | Membership, convites e estados | paralelo após T11 |
| SB-S03-T14 | 03 | review | Revisão tenant-aware de administração | após T12–T13 |
| SB-S03-T15 | 03 | teste | E2E de onboarding | após T14 |
| SB-S04-T16 | 04 | planejamento | Consolidar contrato de manifests | sequencial |
| SB-S04-T17 | 04 | desenvolvimento | Resolver dependências de capabilities | após T16 |
| SB-S04-T18 | 04 | desenvolvimento | Instalar, ativar e desativar módulos | paralelo após T16 |
| SB-S04-T19 | 04 | review | Auditar registry e ciclos | após T17–T18 |
| SB-S04-T20 | 04 | teste | Suite de instalação e rollback | após T19 |
| SB-S05-T21 | 05 | planejamento | Contrato de draft e publicação | sequencial |
| SB-S05-T22 | 05 | desenvolvimento | Editor de processo em draft | após T21 |
| SB-S05-T23 | 05 | desenvolvimento | Validador e simulador de processo | paralelo após T21 |
| SB-S05-T24 | 05 | desenvolvimento | Publicação atômica e rollback | após T22–T23 |
| SB-S05-T25 | 05 | teste/review | Golden path do Builder | após T24 |
| SB-S06-T26 | 06 | desenvolvimento | Workforce clean rebuild | paralelo |
| SB-S06-T27 | 06 | desenvolvimento | Inventory clean rebuild | paralelo |
| SB-S06-T28 | 06 | desenvolvimento | Approval Workflow clean rebuild | paralelo |
| SB-S06-T29 | 06 | review | Revisão cruzada dos módulos | após T26–T28 |
| SB-S06-T30 | 06 | teste | Suite multi-tenant dos módulos | após T29 |
| SB-S07-T31 | 07 | planejamento | Contrato da vertical comercial | sequencial |
| SB-S07-T32 | 07 | desenvolvimento | Integração Workforce + Scheduling | após T31 |
| SB-S07-T33 | 07 | desenvolvimento | Integração Cases + Approval | paralelo após T31 |
| SB-S07-T34 | 07 | desenvolvimento | Timeline correlacionada e dashboard | após T32–T33 |
| SB-S07-T35 | 07 | teste/review | E2E comercial completo | após T34 |
| SB-S08-T36 | 08 | planejamento | Readiness de persistência tipada | sequencial |
| SB-S08-T37 | 08 | desenvolvimento | Framework de profiling e quarentena | após T36 |
| SB-S08-T38 | 08 | desenvolvimento | Backfill idempotente e dry-run | paralelo após T36 |
| SB-S08-T39 | 08 | review | Auditoria de cutover e rollback | após T37–T38 |
| SB-S08-T40 | 08 | teste | Ensaio de promoção dos pilotos | após T39 |
| SB-S09-T41 | 09 | desenvolvimento | Logging estruturado e redaction | paralelo |
| SB-S09-T42 | 09 | desenvolvimento | Health, readiness e métricas | paralelo |
| SB-S09-T43 | 09 | desenvolvimento | Auditoria e diagnóstico de suporte | após T41 |
| SB-S09-T44 | 09 | review | Threat model e revisão de segurança | após T41–T43 |
| SB-S09-T45 | 09 | teste | Testes de falha e incidentes | após T44 |
| SB-S10-T46 | 10 | planejamento | Topologia e release contract | sequencial |
| SB-S10-T47 | 10 | desenvolvimento | Backup e restore verificável | após T46 |
| SB-S10-T48 | 10 | desenvolvimento | Deploy reproduzível e rollback | paralelo após T46 |
| SB-S10-T49 | 10 | review/teste | Readiness comercial e LGPD | após T47–T48 |
| SB-S10-T50 | 10 | teste/entrega | Release candidate comercial | após T49 |
## Observações

- O catálogo possui 50 tasks principais (T01–T50).
- "SB-S01-T00" é uma task preparatória adicional necessária para a integridade das dependências da Sprint 01.
- Sua presença não altera a numeração original das 50 tasks.
- A trilha futura `FED-*` está projetada em `FEDERATED_INSTANCE_SCOPE.md` e cobre federação de instâncias, distribuição de blueprints, suporte remoto, emancipação e observabilidade multi-instância. Ela ainda não altera a numeração das 50 tasks principais.
- A extensão `UX_NAVIGATION_EXTENSION_TASKS.md` adiciona `UX-NAV-06` e `UX-NAV-07`, cada uma com 50 tasks seriais. Essas sprints aumentam o plano de UI/UX sem alterar a numeração `SB-S01` a `SB-S10`.
- `REAL_DATA_PATH_POST_UX_REMODEL.md` registra que `RD-03` a `RD-06` devem ser remodeladas, mantendo IDs existentes, para consumir os contratos de UX e federacao antes de demonstrar o caminho de dados reais completo.
