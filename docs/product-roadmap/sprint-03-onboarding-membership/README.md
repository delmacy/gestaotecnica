# Sprint 03 — Onboarding e membership

Objetivo: permitir a criação e administração segura de um novo cliente.

## SB-S03-T11 — Contrato de onboarding comercial
Tipo: planejamento. Modo: sequencial. Entrega: estados, pré-requisitos, dados obrigatórios, eventos e rollback do onboarding. Aceite: fluxo completo sem depender de dados hardcoded.

## SB-S03-T12 — Wizard de workspace
Tipo: desenvolvimento. Depende: T11. Entrega: criação de workspace, organização, locale, timezone, branding e progresso. Aceite: contexto autenticado e retomada segura de onboarding incompleto.

## SB-S03-T13 — Membership, convites e estados
Tipo: desenvolvimento. Modo: paralelo após T11. Entrega: convite, aceite, ativação, desativação, roles e capabilities tenant-aware. Aceite: usuário global sem membership não opera o workspace.

## SB-S03-T14 — Revisão tenant-aware de administração
Tipo: review. Depende: T12 e T13. Entrega: auditoria de inputs forjados, ownership, roles e histórico. Aceite: nenhum acesso administrativo cross-tenant.

## SB-S03-T15 — E2E de onboarding
Tipo: teste. Depende: T14. Entrega: teste do workspace vazio até primeiro administrador e capability habilitada. Aceite: duplicate invite, inactive membership, forged workspace e audit trail cobertos.

## Prompt Jules
Busque a task `<ID>` em `docs/product-roadmap/sprint-03-onboarding-membership/README.md` e publique um PR isolado.