# Phase 1: Environment & Bootstrap Inventory

**Date:** 2026-06-25
**Executor:** Jules Doc Core Environment Validation
**Task:** TASK-SB-PHASE-1-ENV-BOOTSTRAP-INVENTORY-001 (Issue #293)

## 1. Objetivo
Inventariar o estado real de ambiente, scripts, ferramentas de bootstrap e comandos base necessários para rodar e testar o projeto no estado atual.

## 2. Inventário de Ambiente

*   **Node.js:** `v22.22.1` (Versão reportada no ambiente local/sandbox).
*   **Gerenciador de Pacotes:** `npm v11.11.0` (Reportado no ambiente local/sandbox).
*   **Frameworks Base:**
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

### Dependem de Ambiente/Bootstrap (Parcialmente Seguros/Validados)
| Comando | Descrição | Status |
|---|---|---|
| `npm run dev` | Inicia o servidor `next dev` | Seguro em sandbox isolada; requer banco para fluxo completo. |
| `npm run db:bootstrap` | Setup inicial de schemas do banco | Seguro para criar bancos de teste/dev. |
| `npm run db:generate` | Gera migrations do Drizzle | Seguro. |
| `npm run test:e2e` | Roda testes E2E do Playwright | Requer ambiente instalado (`npx playwright install`). |

### Destrutivos ou Inseguros (Não Executados/Apenas Observados)
| Comando | Descrição | Risco / Motivo de Não Execução |
|---|---|---|
| `npm run db:migrate` | Roda bootstrap e empurra mudanças para o banco | Destrutivo em ambiente produtivo sem backup/review. Utiliza o método \`push\`. |
| `npm run db:push` | Faz \`push\` das mudanças com Drizzle | Risco de perda de dados se o schema não for 100% compátivel. |

## 4. Variáveis de Ambiente Esperadas

A partir da análise do projeto (uso de banco Postgres, Next.js, etc), presume-se a existência destas variáveis:

*   `DATABASE_URL` / `PLATFORM_DATABASE_URL` / `RUNTIME_DATABASE_URL` (Conexão com PostgreSQL, referenciadas no `AGENTS.md`)
*   `NODE_ENV` (development, test, production)

*(Nenhum valor real de produção ou dev foi lido ou exposto nesta etapa para preservar o escopo de segurança).*

## 5. Conclusão e Limitações
A infraestrutura está madura em termos de scripts e separação de concerns. Os comandos de validação (`test`, `check:architecture`) são seguros. Os comandos de banco baseados no Drizzle usam `drizzle-kit push`, indicando uma abordagem que exige cautela (sempre prefira `migrate` seguro e evite forçar `push` para evitar perda de dados).
