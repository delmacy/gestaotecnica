# Phase 1: Environment & Bootstrap Inventory

**Date:** 2026-06-25
**Executor:** Jules Doc Core Environment Validation
**Task:** TASK-SB-PHASE-1-ENV-BOOTSTRAP-INVENTORY-001 (Issue #293)

## 1. Objetivo
Inventariar o estado real de ambiente, scripts, ferramentas de bootstrap e comandos base necessários para rodar e testar o projeto no estado atual.

## 2. Inventário de Ambiente

*   **Node.js:** `v22.22.1` (Versão reportada no ambiente local/sandbox).
*   **Gerenciador de Pacotes:** `npm v11.11.0` (Reportado no ambiente local/sandbox).
*   **Frameworks Base (Baseados explícitamente no `package.json`):**
    *   Next.js (v16.2.6)
    *   React (v19.2.4)
    *   Tailwind CSS (v4)
    *   Drizzle ORM (v0.45.2)

## 3. Inventário de Scripts (package.json)

Foram identificados os seguintes scripts organizados por categoria de uso e segurança de execução na fase atual:

### Seguros para Execução (Comprovados / Validados)
| Comando | Descrição | Status |
|---|---|---|
| `npm run build` | Compila o projeto via `next build` | Pode ser executado para verificar erros de build. |
| `npm run lint` | Executa o linter (`eslint`) | Seguro. |
| `npm run check:architecture` | Validação de regras arquiteturais | Seguro, utilizado ativamente em CI. |
| `npm run test` | Roda suíte completa de testes | Seguro. Chama unit, integration, E2E. |
| `npm run test:unit` | Roda testes unitários | Seguro. |
| `npm run test:integration` | Roda testes de integração | Seguro. |
| `npm run test:agent-work:*` | Roda testes segmentados de agentes | Seguro (inclui `unit`, `integration`, `launch`). |
| `npm run test:golden-e2e` | Roda o ciclo Golden E2E | Seguro. |

### Dependem de Ambiente/Bootstrap (Parcialmente Seguros/Validados)
| Comando | Descrição | Status |
|---|---|---|
| `npm run dev` | Inicia o servidor `next dev` | Seguro em sandbox isolada; requer banco para fluxo completo. |
| `npm run db:bootstrap` | Setup inicial de schemas do banco | Seguro para criar bancos de teste/dev. |
| `npm run db:generate` | Gera migrations do Drizzle | Seguro. |
| `npm run db:setup:unified-test` | Configura o banco unificado de testes | Seguro em dev/sandbox, requer Postgres rodando. |
| `npm run db:validate` | Valida as migrations | Seguro. |
| `npm run test:e2e` | Roda testes E2E do Playwright | Requer ambiente instalado (`npx playwright install`). |

### Exigem Atenção (Alvo Crítico)
| Comando | Descrição | Risco / Motivo de Atenção |
|---|---|---|
| `npm run db:migrate` | Roda bootstrap, validação e faz o deploy do Drizzle | Este comando encadeia `db:bootstrap`, `db:validate` e `drizzle-kit push`. Portanto, exige configuração correta do ambiente (dev/test) e **revisão do alvo** antes da execução, não devendo ser apontado cegamente contra prod. |
| `npm run db:push` | Faz \`push\` das mudanças com Drizzle | Encadeia bootstrap e push direto. Requer mesma atenção que o migrate devido ao push. |

## 4. Variáveis de Ambiente Esperadas

A partir da análise do projeto (uso de banco Postgres, Next.js, etc), presume-se a existência destas variáveis:

*   `DATABASE_URL` / `PLATFORM_DATABASE_URL` / `RUNTIME_DATABASE_URL` (Conexão com PostgreSQL, referenciadas no `AGENTS.md`)
*   `NODE_ENV` (development, test, production)

*(Nenhum valor real de produção ou dev foi lido ou exposto nesta etapa para preservar o escopo de segurança).*

## 5. Conclusão e Limitações
A infraestrutura está madura em termos de scripts e separação de concerns. Os comandos de validação (`test`, `check:architecture`) são seguros. Os fluxos de banco de dados usam encadeamento eficiente de bootstrap, validação e aplicação das migrations (`push`), exigindo apenas clara demarcação do banco alvo nas variáveis de ambiente.
