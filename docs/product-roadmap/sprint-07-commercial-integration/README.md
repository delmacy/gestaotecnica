# Sprint 07 — Integração da vertical comercial

## SB-S07-T31 — Contrato da vertical comercial
Planejamento sequencial. Definir o fluxo onboarding → capabilities → workforce → scheduling → case → approval → histórico. Entrega: contratos, ownership, eventos, compensações e fixtures.

## SB-S07-T32 — Integração Workforce + Scheduling
Desenvolvimento após T31. Alocar somente membros ativos, pertencentes ao workspace e disponíveis no intervalo. Aceite: indisponibilidade e colisão cross-tenant bloqueiam alocação.

## SB-S07-T33 — Integração Cases + Approval
Desenvolvimento paralelo após T31. Criar solicitação genérica de aprovação vinculada por subjectType e subjectId, sem acoplar internals. Aceite: decisão não altera entidade de outro tenant.

## SB-S07-T34 — Timeline correlacionada e dashboard
Desenvolvimento após T32 e T33. Exibir histórico completo por correlationId, estado atual e próximos passos. Aceite: timeline não usa events como fonte primária da entidade.

## SB-S07-T35 — E2E comercial completo
Teste e review após T34. Cobrir happy path, rejeição, retry, capability desativada, falha parcial e compensação. Entrega: demo path e runbook reproduzível.

## Prompt Jules
Busque a task `<ID>` em `docs/product-roadmap/sprint-07-commercial-integration/README.md`, execute-a conforme dependências e publique evidências.