# Fase UX-NAV-04 — Builder identity, organização, portfólio e seleção durável de workspace

## 1. Identificação

| Campo | Valor |
|---|---|
| Fase | UX-NAV-04 |
| Task ID | `UX-NAV-04-001-platform-admin-boundary-database` |
| Lane | UX/Access and Tenancy |
| Etapa | Database/persistence foundation |
| Responsável | OpenCode worker (implementação) |
| Base SHA (origin/main) | `d6c0206aebdbf93142b38867a454651df5243923` |
| Data | 2026-08-04 |

## 2. Objetivo

Fundação de persistência para a jornada autorizada: identidade autenticada do
Builder, portfólio de workspaces agrupado por organização e seleção durável de
workspace. A seleção de qualquer um dos três workspaces do probe deve persistir
no banco e sobreviver a recarregamentos nas rotas Builder, admin e runtime.

Esta etapa entrega **somente a fundação de banco/persistência** (schema,
migração, seed idempotente e use cases de persistência com enforcement de
membership). A camada de UI/API (`src/app/**`, `src/modules/**`, `src/platform/**`)
está **fora do allowlist desta task** e é registrada como gap exato na seção 8.

## 3. Escopo permitido (aplicado)

- `src/db/**`
- `drizzle/**`
- `src/lib/**`
- `tests/**`
- `docs/**`

## 4. Fora de escopo

- `src/app/**` (rotas UI e rotas API)
- `src/modules/**`, `src/platform/**`
- `package.json`, lockfiles, versões de Node/TS, auth, proteção de rota
- `drizzle-agent-work/**` (conjunto de migrações independente do agente)

## 5. Arquivos planejados

- `src/db/runtime/schema/builder.ts` — schema `builder.workspace_selections`
- `drizzle/0028_builder_workspace_selections.sql` + journal entry
- `src/db/seeds/builder-seed/constants.ts` — fixture canônica do probe
- `src/db/seeds/builder-seed/seed.ts` — seed idempotente do probe
- `src/lib/builder-persistence.ts` — use cases de persistência
- `tests/integration/ux-nav-04-001-builder-persistence.integration.test.ts`
- `docs/archive/phases/UX_NAV_04.md` — este documento

## 6. Critérios de aceite (desta etapa)

- Migração real criando `builder.workspace_selections` com índice único por usuário.
- Seed idempotente: 1 organização probe + exatamente 3 workspaces + usuário
  `access_profile='builder'` + membership nos 3 workspaces + seleção inicial.
- Persistência de seleção apenas com membership verificado no servidor.
- Leitura sempre em nova query (recarregamento do banco), sem cache em memória.
- Sem `any` explícito novo e build limpo.

## 7. Plano aprovado

Referência:
- `docs/archive/planning/JULES_AGENT_BOUNDARIES.md`
- `docs/archive/planning/FRONTEND_PARITY_GATE.md`
- `docs/archive/database/SCHEMA_STRATEGY.md`

## 8. Execuções

### Execução 001 — OpenCode worker — 2026-08-04

Status: Concluída

Arquivos criados:
- `src/db/runtime/schema/builder.ts` — tabela `workspace.workspace_selections` no
  schema `builder`, `user_id` com índice único, FKs para `workspace.workspaces` e
  `workspace.organizations`.
- `drizzle/0028_builder_workspace_selections.sql` — migração (schema `builder`,
  tabela, índice único `builder_workspace_selections_user_uidx` e índices).
- `src/db/seeds/builder-seed/constants.ts` — constante canônica `BUILDER_PROBE`
  (org `org_builder_probe`, workspaces `ws_builder_probe_core|support|field`,
  usuário `builder.probe@system-builder.local`, perfil `builder`).
- `src/db/seeds/builder-seed/seed.ts` — seed idempotente (upsert por
  key/email), membership por select-then-insert com `and()`, seleção inicial
  default `core`. Corrige o `where` de membership que estava com boolean `&&`
  inválido em vez de `and()`.
- `src/lib/builder-persistence.ts` — `resolveBuilderIdentity`,
  `resolveWorkspacePortfolio`, `resolveSelectedWorkspace`, `resolveBuilderPortfolio`
  (retorna `null` quando a identidade não existe — sem identidade sintética
  "unknown") e `persistWorkspaceSelection` (valida workspace + membership antes
  do upsert `onConflictDoUpdate` por `user_id`). O `userId` é sempre resolvido
  do servidor; o módulo só impõe membership.
- `tests/integration/ux-nav-04-001-builder-persistence.integration.test.ts` —
  prova E2E de persistência: identity → portfolio agrupado por organização →
  seleção do 3º workspace → recarregamento em nova query (tabela + use case) →
  seleção refletida no portfólio → rejeição de workspace sem membership →
  seed idempotente.

Arquivos alterados:
- `src/db/index.ts` — registra `runtime/schema/builder` no `fullSchema` (mesmo
  padrão dos demais módulos) e marca os 2 `any` preexistentes do singleton de DB
  com `explicit-any-ok` (shim de borda documentado, sem `any` novo).
- `drizzle/meta/_journal.json` — entry idx 25 `0028_builder_workspace_selections`.

Comandos executados:
- `npm run check:no-explicit-any` — responsabilidade do supervisor (execução
  serial pós-deliverable). Verificação manual no diff: nenhum `any` novo.
- `npm run build` — responsabilidade do supervisor.
- `npm run test:integration` (arquivo novo) — responsabilidade do supervisor.

Resultado do lint: pendente da validação do supervisor (sem node_modules no checkout).
Resultado do build: pendente da validação do supervisor.
Resultado dos testes: pendente da validação do supervisor.

Evidência de persistência:
- Rota visível alvo (stage posterior): `/builder`.
- Tabelas: `builder.workspace_selections`, `workspace.organizations`,
  `workspace.workspaces`, `workspace.workspace_members`, `users`
  (identidade, `access_profile='builder'`).
- Use case/API: `src/lib/builder-persistence.ts` (`persistWorkspaceSelection`,
  `resolveBuilderPortfolio`, `resolveSelectedWorkspace`).
- O teste relê do banco em nova query após cada escrita (nada em memória/localStorage).

Comando de verificação reproduzível:
```bash
npx tsx --test tests/integration/ux-nav-04-001-builder-persistence.integration.test.ts
```

Bloqueio/gap exato para a próxima etapa (frontend/API):
- A API de descoberta atual em
  `src/app/api/builder/navigation/workspace-switching/route.ts` +
  `resolve-workspace-switching.ts` ainda lista workspaces ativos de forma
  **anônima** (sem `userId` autenticado, com fallback dummy) e o `/builder`
  (`src/app/(builder)/builder/layout.tsx` + `src/platform/workspace`) ainda
  resolve contexto sem identidade/seleção durável. Substituir por:
  1. Novo endpoint que resolva o `userId` da sessão e chame
     `resolveBuilderPortfolio(userId)` para renderizar identidade + portfólio
     agrupado por organização em `/builder`;
  2. Endpoint POST que chame `persistWorkspaceSelection(userId, workspaceId)`
     no clique de seleção e recarregue via `resolveSelectedWorkspace`;
  3. Uso do `selectedWorkspaceId` persistido no contexto de Builder, admin e runtime.
- Esses arquivos estão fora do allowlist desta task
  (`src/app/**`, `src/platform/**`, `src/modules/**`), portanto o gap é
  registrado para a etapa de UI/navegação/actions da sprint UX-NAV-04.

Observações:
- O probe reutiliza deliberadamente uma organização probe única com exatamente 3
  workspaces, mapeando 1:1 para o critério "selecionar qualquer um dos três
  workspaces criados".
- Nenhum dado sintético rotulado como real; a única fixture é o seed oficial
  `builder-seed`, criado nesta etapa.
