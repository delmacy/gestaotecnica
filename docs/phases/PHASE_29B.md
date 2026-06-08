# Fase 29B — Candidate Origin and Evidence UI

## 1. Identificação

| Campo | Valor |
|---|---|
| Fase | 29B |
| Status | Planejada |
| Tipo | Técnica/Documental |
| Responsável principal | Jules Dev / Jules Documental |
| Revisor | ChatGPT |
| Data de abertura | YYYY-MM-DD |
| Data de aprovação | — |

## 2. Objetivo

Candidate Origin and Evidence UI

## 3. Escopo permitido

- —

## 4. Fora de escopo

- —

## 5. Arquivos planejados

- —

## 6. Critérios de aceite

- —

## 7. Plano aprovado

Referência:
- `docs/planning/alpha/PHASE_29B.md`

Resumo:
- —

## 8. Execuções

### Execução 001 — Jules Dev — 2026-06-08

Status: Concluído

Arquivos criados:
- `src/components/builder/candidates/candidate-evidence-view-model.ts`
- `src/components/builder/candidates/CandidateAgentSummary.tsx`
- `src/components/builder/candidates/CandidateSuggestedStates.tsx`
- `src/components/builder/candidates/CandidateSuggestedForms.tsx`
- `src/components/builder/candidates/CandidateObservedSignals.tsx`
- `src/components/builder/candidates/CandidateAttachments.tsx`
- `tests/unit/candidate-evidence-view-model.test.ts`
- `tests/e2e/candidate-evidence.spec.ts`

Arquivos alterados:
- `src/components/builder/candidates/CandidateDetail.tsx`

Comandos executados:
- `npm run lint`
- `npm run build`
- `npx tsx --test tests/unit/candidate-evidence-view-model.test.ts`
- `npx playwright test tests/e2e/candidate-evidence.spec.ts --project=chromium`
- `npm run test:e2e`
- `npm run test:integration`

Resultado do lint: Passou sem erros adicionais
Resultado do build: Passou com sucesso
Resultado dos testes: Unit tests e E2E tests executados com sucesso
Bloqueios: Nenhum

Observações: Refatorado `CandidateDetail` para renderizar visualmente a evidência estruturada advinda do payload estendido (agente, origem, confiança, estados sugeridos, formulários sugeridos, sinais observados, anexos e metadados) enquanto mantém compatibilidade reversa via fallback técnico para formato legacy.

Frontend impact:
- Área afetada: Process Candidate Detail / Candidate Evidence UI
- Rota(s): /candidates
- Usuário/persona: Process Owner / Gestor Operacional / Admin da Plataforma
- Workspace/global: Workspace
- Estados cobertos: sem evidência, evidência legacy, evidência canônica de agente, suggested states, suggested forms, observed signals, attachments, metadata, raw JSON fallback
- Teste visual/E2E: Candidate Detail renderizando dados estruturados do payload da Fase 29
- Gap frontend pendente: Nenhum para Fase 29. Receipts/correlation/idempotency permanecem para Fase 30/30B.

Decisão: Pronto para revisão e PR.

## 9. Revisões

### Revisão 001 — ChatGPT — YYYY-MM-DD

Resultado: Pendente

Observações:
- —

Ressalvas:
- —

Decisão:
- —

## 10. Decisões específicas da fase

- —

## 11. Histórico de correções

- —
