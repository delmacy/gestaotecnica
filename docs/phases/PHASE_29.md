# Fase 29 — Process Builder Agent Specification

## 1. Identificação

| Campo | Valor |
|---|---|
| Fase | 29 |
| Status | Planejada |
| Tipo | Produto alfa / Blueprint / Módulo |
| Responsável principal | Jules Dev / Jules Documental |
| Revisor | ChatGPT |
| Data de abertura | YYYY-MM-DD |
| Data de aprovação | — |

## 2. Objetivo

Process Builder Agent Specification

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
- `docs/planning/alpha/PHASE_29.md`

Resumo:
- —

## 8. Execuções

### Execução 001 — Jules Dev — YYYY-MM-DD

Status: Pendente

Arquivos criados:
- —

Arquivos alterados:
- —

Comandos executados:
- —

Resultado do lint:
- —

Resultado do build:
- —

Git status:
- —

Bloqueios:
- —

Observações:
- —

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

### Execução 001 — Jules Dev — 2026-06-08

Status: READY FOR REVIEW
Arquivos criados:
- src/features/platform/gateway/contracts/agent-payload.contract.ts
- src/features/platform/gateway/contracts/agent-payload.schema.ts
- src/features/platform/gateway/contracts/agent-payload.mapper.ts
- src/features/platform/gateway/contracts/index.ts
- src/features/platform/gateway/mocks/agent-payload.mock.ts
- tests/unit/agent-payload-contract.test.ts
Arquivos alterados:
- src/app/api/agent/route.ts
- src/features/platform/gateway/agent-gateway.test.ts
- docs/00-current/NEXT_PHASE.md
- docs/phases/PHASE_29.md
Comandos executados:
npm run lint
npm run build
npm run test:unit
npm run test:integration
git diff --check
Resultado do lint: Ok
Resultado do build: Ok
Resultado dos testes: Ok
Bloqueios: Nenhum
Observações: Foi implementada a política de backward compatibility (Opção A) mantendo o schema antigo também válido.
Frontend impact:
- Área afetada: Agent Payload Contract / Gateway Backend
- Rota(s): /api/agent
- Usuário/persona: System / Agent
- Workspace/global: Global com payload workspace-scoped
- Estados cobertos: payload válido, payload inválido, payload legacy se mantido
- Teste visual/E2E: Não aplicável nesta fase
- Gap frontend pendente: Fase 29B exibirá melhor origem, evidências, formulários e estados sugeridos na UI de Candidate
Decisão: Manter compatibilidade do payload legacy para garantir que testes anteriores passem
