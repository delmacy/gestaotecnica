# Phase 1: Actions & Checks Baseline

**Date:** Thu Jun 25 10:29:00 UTC 2026
**Executor:** Jules Doc Core CI Validation
**Task:** TASK-SB-PHASE-1-ACTIONS-BASELINE-001 (Issue #292)

## 1. Objetivo
Mapear o estado real dos GitHub Actions e checks do repositório, classificando sua obrigatoriedade, gatilhos (push, PR) e identificando lacunas para a Fase 1.

## 2. Inventário de Workflows Existentes

Os seguintes workflows foram encontrados em `.github/workflows/`:

| Arquivo | Nome do Workflow | Gatilhos | Objetivo Principal | Status |
|---|---|---|---|---|
| `agent-work-governance.yml` | Agent Work Governance | PRs (abertura, sync, edição) em `src/**` e `docs/**` | Validar formato do PR e portões de CI. | Confirmado |
| `agent-work-integration.yml` | Agent Work Operational Proof | PRs em `src/agent-work/**`, `tests/**`, etc. Push em `integration/**` | Executa testes, seed de BD, prova de operação e verificação de prontidão. | Confirmado |
| `architecture-check.yml` | Architecture Check | PRs em `src/**`, `scripts/validate-architecture-rules.ts` | Validação estrita das regras de arquitetura. | Confirmado |

## 3. Estado Atual dos Checks

### 3.1 Em Pull Requests
*   **Architecture Check:** Obrigatório para alterações no core (`src/**`). Roda `npm run check:architecture -- --strict`.
*   **Agent Work Governance:** Requer "Package ID" e "Base SHA" na descrição.
*   **Agent Work Operational Proof:** Disparado em áreas específicas, roda DB test com Postgres, executa suites de testes e validações.

### 3.2 Em Branches (Push)
*   Push em `integration/**` engatilha testes operacionais pesados.
*   Não foram encontrados workflows que disparem para todos os pushes em `main`.

## 4. Limitações e Observações Técnicas
*   **Acesso ao Histórico:** A CLI `gh` não está disponível no ambiente atual, impedindo a listagem direta via comando de falhas recentes nos runs.
*   **API GitHub:** O acesso à API restrita para listar status de checks de commits específicos esbarra em falta de credenciais do app atual no escopo do repositório.

## 5. Lacunas e Recomendações
*   **Gatilho Abrangente:** Considerar um workflow genérico de CI (Lint/Test) para todo push em `main` caso as branches principais fiquem sujeitas a quebras.
*   **Visibilidade de Runs:** Manter monitoramento dos logs do `agent-work-integration.yml` pois inclui testes E2E e validações pesadas sujeitas a timeout.

## 6. Conclusão
O baseline de workflows de CI/CD atuais está focado no controle de qualidade arquitetural (`architecture-check.yml`) e governança de agentes (`agent-work-*`). Estão operacionais via Actions, embora os logs do histórico de sucessos dependam do controle manual no PR.
