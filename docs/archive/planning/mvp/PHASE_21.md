# Fase 21 — Sprint de Correção do System Builder

## Objetivo

Corrigir os problemas críticos, altos e médios identificados na auditoria técnica do System Builder. Esta sprint foca exclusivamente em hardening, segurança, performance, build/CI, qualidade de código e observabilidade.

**Escopo excluído:** Nenhuma implementação do System Trading. O System Trading é tenant do System Builder e não deve ser alterado.

## Contexto

A auditoria técnica (`AUDIT_REPORT.md`) identificou 10 riscos graves no System Builder, incluindo vazamento de dados multi-tenant, chaves de API hardcoded, processamento síncrono de outbox, N+1 queries, ausência de testes e timeouts de build. Esta sprint materializa o plano de ação da auditoria em tasks executáveis.

## Regras

1. Toda correção de backend deve declarar impacto no frontend (paridade obrigatória — AGENTS.md §5).
2. Nenhuma task deve alterar arquivos do System Trading (`system-building/`).
3. O diretório `pr903-fix/` deve ser removido no início da sprint.
4. Cada task deve incluir testes unitários ou de integração.
5. Migrations devem ser rastreáveis (não usar `drizzle-kit push --force` em produção).

## Arquivos permitidos

- `src/platform/**`
- `src/modules/**`
- `src/db/**`
- `src/app/**`
- `src/scripts/**`
- `tests/**`
- `package.json`, `package-lock.json`
- `docs/**`
- `.github/workflows/**`

## Arquivos proibidos

- `system-building/**`
- `pr903-fix/**`

---

## Sprint Backlog — 50 Tasks

### Grupo A: Segurança Crítica (Tasks 1–10)

| ID | Título | Prioridade | Effort |
|---:|---|---|---|
| SB-CR-01 | Remover diretório `pr903-fix` (3.121 arquivos duplicados) | 🔴 Crítica | S |
| SB-CR-02 | Adicionar filtro `workspaceId` em `getWorkItems()` | 🔴 Crítica | M |
| SB-CR-03 | Adicionar filtro `workspaceId` em `getWorkItemById()` | 🔴 Crítica | M |
| SB-CR-04 | Adicionar filtro `workspaceId` em `getWorkItemSummary()` | 🔴 Crítica | M |
| SB-CR-05 | Adicionar filtro `workspaceId` em `getWorkItemEvents()` | 🔴 Crítica | M |
| SB-CR-06 | Exigir `workspaceId` como parâmetro obrigatório em todas as queries de `src/modules/work-items/queries.ts` | 🔴 Crítica | M |
| SB-CR-07 | Substituir validação de API Key global por JWT com claims de workspace em `src/platform/integrations/auth.ts` | 🔴 Crítica | L |
| SB-CR-08 | Auditoria e correção de todas as queries em `src/modules/` que não filtram por `workspaceId` | 🔴 Crítica | XL |
| SB-CR-09 | Implementar Row-Level Security (RLS) no PostgreSQL para tabelas críticas | 🔴 Crítica | XL |
| SB-CR-10 | Remover `GESTAOTECNICA_API_KEY` hardcoded e migrar para auth por tenant | 🔴 Crítica | L |

### Grupo B: Performance e Escalabilidade (Tasks 11–20)

| ID | Título | Prioridade | Effort |
|---:|---|---|---|
| SB-PF-01 | Substituir `revalidatePath("/")` por `revalidateTag(workspaceId)` em `src/modules/service-orders/actions.ts` | 🟠 Alta | M |
| SB-PF-02 | Substituir `revalidatePath("/")` por `revalidateTag(workspaceId)` em `src/modules/workforce/actions.ts` | 🟠 Alta | M |
| SB-PF-03 | Substituir `revalidatePath("/")` por `revalidateTag(workspaceId)` em `src/modules/strategy/actions.ts` | 🟠 Alta | M |
| SB-PF-04 | Substituir `revalidatePath("/")` por `revalidateTag(workspaceId)` nos módulos restantes (16 arquivos) | 🟠 Alta | L |
| SB-PF-05 | Resolver N+1 em `src/app/admin/lab/workflow/page.tsx` (Promise.all com timeline por instância) | 🟠 Alta | M |
| SB-PF-06 | Resolver N+1 em queries de `src/modules/evidences/queries.ts` (Promise.all com count) | 🟠 Alta | M |
| SB-PF-07 | Resolver N+1 em queries de `src/modules/reports/actions.ts` (Promise.all com count) | 🟠 Alta | M |
| SB-PF-08 | Adicionar paginação cursor-based nas queries com `.limit(80)` e `.limit(100)` | 🟠 Alta | L |
| SB-PF-09 | Adicionar índices em `workspaceId` em todas as tabelas do schema runtime | 🔴 Crítica | M |
| SB-PF-10 | Migrar processamento síncrono do outbox para `res.waitUntil()` ou worker background | 🔴 Crítica | XL |

### Grupo C: Build, CI e Tooling (Tasks 21–30)

| ID | Título | Prioridade | Effort |
|---:|---|---|---|
| SB-BI-01 | Adicionar script `typecheck` (`tsc --noEmit`) ao `package.json` | 🟠 Alta | S |
| SB-BI-02 | Diagnosticar e resolver timeout de `npm run lint` (>120s) | 🟠 Alta | M |
| SB-BI-03 | Diagnosticar e resolver timeout de `npx tsc --noEmit` (>120s) | 🟠 Alta | M |
| SB-BI-04 | Corrigir versão do `drizzle-kit` (downgrade de ^0.31.10 para ^0.18.1 foi acidental) | 🟠 Alta | S |
| SB-BI-05 | Corrigir versão do `next` (bump de 16.2.6 para ^16.3.0 precisa de validação) | 🟡 Média | S |
| SB-BI-06 | Configurar CI/CD com gates: lint, typecheck, test, build | 🟠 Alta | L |
| SB-BI-07 | Adicionar `.gitignore` para logs do orquestrador (`system-building/orchestration/**/*.log`, `health.json`, `state.json`) | 🟡 Média | S |
| SB-BI-08 | Substituir `drizzle-kit push --force` por migrations rastreáveis em scripts de produção | 🟠 Alta | L |
| SB-BI-09 | Configurar ESLint para ignorar `pr903-fix/` e `node_modules/` explicitamente | 🟡 Média | S |
| SB-BI-10 | Adicionar script `npm run validate:all` que executa lint + typecheck + test + build em sequência | 🟡 Média | M |

### Grupo D: Qualidade de Código e Testes (Tasks 31–40)

| ID | Título | Prioridade | Effort |
|---:|---|---|---|
| SB-QT-01 | Refatorar `src/modules/service-orders/actions.ts` (882 linhas) em CQRS (Commands e Handlers) | 🟠 Alta | XL |
| SB-QT-02 | Refatorar `src/modules/workforce/actions.ts` em CQRS | 🟡 Média | L |
| SB-QT-03 | Refatorar `src/modules/strategy/actions.ts` em CQRS | 🟡 Média | L |
| SB-QT-04 | Eliminar uso de `any` em `src/platform/kernel.ts` | 🟡 Média | M |
| SB-QT-05 | Eliminar uso de `any` em `src/db/legacy/schema.ts` | 🟡 Média | M |
| SB-QT-06 | Adicionar testes unitários para `src/platform/actions/runAction()` | 🟠 Alta | M |
| SB-QT-07 | Adicionar testes unitários para `src/platform/events/event-log-service.ts` | 🟠 Alta | M |
| SB-QT-08 | Adicionar testes de integração para pipeline REST de work-items | 🟠 Alta | M |
| SB-QT-09 | Adicionar testes E2E com Playwright para fluxo de criação de work-item → service-order | 🟠 Alta | L |
| SB-QT-10 | Resolver TODOs pendentes em `src/app/api/` (validação de escopos em route.ts) | 🟡 Média | M |

### Grupo E: Observabilidade e Infraestrutura (Tasks 41–50)

| ID | Título | Prioridade | Effort |
|---:|---|---|---|
| SB-OI-01 | Integrar Sentry ou Datadog APM para logs de erro centralizados | 🟠 Alta | L |
| SB-OI-02 | Substituir `console.log()` pontuais por logger estruturado no código de Flow | 🟡 Média | M |
| SB-OI-03 | Implementar rate limiting nas APIs e Server Actions | 🟠 Alta | L |
| SB-OI-04 | Aumentar connection pool de `max: 10` para valor adequado à carga | 🟡 Média | S |
| SB-OI-05 | Configurar PgBouncer ou Supabase Pooling para gerenciar conexões | 🟡 Média | L |
| SB-OI-06 | Adicionar `ON DELETE CASCADE` nas tabelas com FK para evitar dados órfãos | 🟡 Média | M |
| SB-OI-07 | Implementar backups automatizados do banco com scripts de restore | 🟠 Alta | L |
| SB-OI-08 | Adicionar health check endpoint (`/api/health`) com status do DB e filas | 🟡 Média | M |
| SB-OI-09 | Corrigir erro `[WinError 2]` no orquestrador (PATH do Node.js/npm) | 🟡 Média | S |
| SB-OI-10 | Commitar trabalho pendente de work-items REST API ou descartar | 🟡 Média | S |

---

## Dependências entre Grupos

```
Grupo A (Segurança) → Grupo B (Performance) → Grupo C (Build/CI) → Grupo D (Testes) → Grupo E (Observabilidade)
```

- **Grupo A** é pré-requisito para todos os demais (segurança primeiro).
- **Grupo B** depende de A (queries com workspaceId são pré-requisito para otimização).
- **Grupo C** pode rodar em paralelo com B, mas depende de A (remover pr903-fix melhora lint/typecheck).
- **Grupo D** depende de C (CI funcionando para rodar testes).
- **Grupo E** pode rodar em paralelo com D.

## Ordem de Execução Recomendada

1. **SB-CR-01** (remover pr903-fix) — desbloqueia lint/typecheck
2. **SB-CR-02 a SB-CR-06** (filtro workspaceId em work-items) — vazamento ativo
3. **SB-CR-07 e SB-CR-10** (auth por tenant) — segurança do gateway
4. **SB-CR-08** (auditoria geral de workspaceId) — segurança de todas as queries
5. **SB-CR-09** (RLS no PostgreSQL) — segurança no nível do banco
6. **SB-PF-09** (índices em workspaceId) — performance do banco
7. **SB-PF-10** (outbox assíncrono) — escalabilidade
8. **SB-PF-01 a SB-PF-04** (revalidateTag) — performance do cache
9. **SB-PF-05 a SB-PF-08** (N+1 e paginação) — performance das queries
10. **SB-BI-01 a SB-BI-10** (build/CI) — gates de qualidade
11. **SB-QT-01 a SB-QT-10** (qualidade e testes) — cobertura e manutenibilidade
12. **SB-OI-01 a SB-OI-10** (observabilidade) — monitoramento em produção

## Validações

- `npm run lint` deve completar em <60s
- `npm run typecheck` deve completar sem erros
- `npm test` deve ter cobertura mínima de 60%
- `npm run build` deve completar sem warnings críticos
- Nenhuma query deve retornar dados de workspace não autorizado

## Regra de Parada

Todas as 50 tasks marcadas como `done` no `docs/00-current/WORK_BOARD.md` e no `docs/GLOBAL_WORK_BOARD.md`.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/archive/planning/mvp/PHASE_21.md
AUDIT_REPORT.md

Fase 21 — Sprint de Correção do System Builder

Objetivo:
Executar as 50 tasks de correção do System Builder listadas no backlog da Fase 21, priorizando segurança crítica (Grupo A) antes de qualquer outra task.

Escopo:
- Arquivos permitidos: src/platform/**, src/modules/**, src/db/**, src/app/**, src/scripts/**, tests/**, package.json, docs/**
- Arquivos proibidos: system-building/**, pr903-fix/**

Regras:
1. Execute as tasks em ordem de prioridade: Grupo A → Grupo B → Grupo C → Grupo D → Grupo E.
2. Toda correção de backend deve declarar impacto no frontend (paridade obrigatória).
3. Nenhuma task deve alterar arquivos do System Trading.
4. Cada task deve incluir testes unitários ou de integração.
5. Não amplie escopo além das 50 tasks definidas.

Primeira task: SB-CR-01 — Remover diretório pr903-fix (3.121 arquivos duplicados).
```
