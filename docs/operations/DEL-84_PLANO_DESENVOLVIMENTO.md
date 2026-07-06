# Plano de Desenvolvimento — System Builder / Gestão Técnica

**Issue:** DEL-84
**Autor:** Codex Governor
**Data:** 2026-07-06
**Revisão:** 1.0
**Status:** aguardando aprovação humana

---

## 1. Diagnóstico do Estado Atual

### 1.1 O que existe e funciona

| Camada | Estado | Evidência |
|--------|--------|-----------|
| Platform Core (events, workflows, actions, forms, registry) | Implementado | `src/platform/` com 22 submódulos |
| Schema de banco (Drizzle) | 26+ migrations | `drizzle/0000` até `0026` |
| Módulos multi-tenant | 30+ módulos | `src/modules/` e `src/app/` |
| Autenticação | Local funcional | `/auth/login`, `/auth/setup` |
| Admin | Área básica | `/admin` |
| Testes unitários | Parciais | ~30 arquivos de teste |
| Testes integração | Parciais | ~10 arquivos de teste |
| Testes e2e | Playwright configurado | `playwright.config.ts` |
| GitHub Actions | 5 workflows | `.github/workflows/` |
| Agent Company | Bootstrap completo | `TEAM.md`, 9 agents configurados |
| Issue/PR Templates | Configurados | `.github/ISSUE_TEMPLATE/` |

### 1.2 Gaps identificados

| Gap | Impacto | Prioridade |
|-----|---------|------------|
| Modelo GitHub-first não mergeado em `main` | Bloqueia operação agent-first | P0 |
| CI/CD incompleto (env validation blocked) | Sem pipeline de deploy | P0 |
| Workflow engine imaturo | Core do produto incompleto | P0 |
| Action registry sem remote actions | Limita integrações | P1 |
| Blueprints não implementados | Diferencial do produto ausente | P1 |
| Agent Gateway não existe | Orquestração por agentes impossível | P1 |
| Builder UI incompleto | Usuário não opera o sistema | P0 |
| Gaps de paridade frontend | Features backend sem UI | P1 |
| Deploy produção inexistente | Sem caminho para produção | P0 |
| Observabilidade baseline | Sem métricas/alertas | P1 |
| Integrações externas (n8n, webhooks) | Sem sinais de entrada/saída | P2 |
| Security hardening | Sem auditoria de segurança | P1 |
| Performance testing | Sem baseline de performance | P2 |
| Documentação de API | Swagger existe mas incompleto | P2 |

### 1.3 Riscos técnicos

1. **Zod v4**: Projeto usa Zod v4 (breaking changes vs v3) — risco de compatibilidade com libs
2. **Next.js 16**: Versão muito recente — risco de bugs e ecossistema imaturo
3. **Drizzle ORM**: Migrations unificadas em schema único `tec_db` — risco de colisão
4. **Sem CI verde**: Não há evidência de build/teste passando em `main`
5. **Token GitHub limitado**: Projects v2 bloqueado — limita gestão visual

---

## 2. Estrutura de Fases Aprovada (referência)

O plano mestre existente define 9 fases. Este plano operacionaliza essas fases em tarefas executáveis.

| Fase | Nome | Objetivo |
|------|------|----------|
| 1 | Consolidação do Estado Real | Diagnóstico e baseline |
| 2 | Persistência | Schema e migrations estáveis |
| 3 | Vertical Mínimo | End-to-end de uma feature core |
| 4 | Actions / Workflow Engine | Núcleo de automações |
| 5 | Gestão Técnica | Primeiro cliente interno |
| 6 | Blueprints | Moldes reutilizáveis |
| 7 | Governança | Controle e auditoria |
| 8 | Integrações | Conexões externas |
| 9 | Produto Operável | Validação final e produção |

---

## 3. Plano de Execução — Fases 1-2 (Consolidação + Persistência)

### Frente: Fundação / GitHub-First Operating Model

#### Tarefa F1-T01: Merge do GitHub-First Operating Model em `main`

- **ID:** F1-T01
- **Frente:** Fundação
- **Fase:** 1
- **Titulo:** Merge do modelo GitHub-first em main
- **Objetivo:** Trazer o operating model da branch `codex/github-first-agent-company` para `main` com resolução de conflitos
- **Contexto:** O commit e0a3ee6 contém COMPANY.md, PROJECT.md, TASK.md, issue templates, CODEOWNERS atualizado, docs de operating model e pilot. Está na branch `codex/github-first-agent-company` e não foi mergeado.
- **GitHub Issue:** A criar (label: front/foundation, type/task, risk/low)
- **Paperclip Task:** A criar
- **Branch esperada:** `task/F1-T01-merge-github-first-model`
- **Arquivos permitidos:** `.github/**`, `COMPANY.md`, `PROJECT.md`, `TASK.md`, `TEAM.md`, `docs/operations/**`, `skills/**`
- **Arquivos proibidos:** `src/**`, `tests/**`, `drizzle/**`
- **Escopo incluido:** Cherry-pick ou merge da branch, resolução de conflitos, validação de templates
- **Escopo excluido:** Qualquer alteração de código ou schema
- **Dependencias:** Nenhuma
- **Contratos consumidos:** Nenhum
- **Contratos alteraveis:** Nenhum
- **Criterios de aceite:**
  - `main` contém COMPANY.md, PROJECT.md, TASK.md
  - Issue templates funcionam (agent-task.yml, blocker-report.yml)
  - CODEOWNERS atualizado
  - Docs de operating model e pilot acessíveis em `main`
- **Testes obrigatorios:** Nenhum (apenas docs/config)
- **Evidencias obrigatorias:** PR merged em `main`, lista de arquivos confirmados
- **Riscos:** Conflitos com arquivos existentes em `main`
- **Gate de revisao:** Git Manager + Codex Governor
- **Proximo responsavel:** Git Manager

---

#### Tarefa F1-T02: Baseline de CI — Build e Typecheck verdes em `main`

- **ID:** F1-T02
- **Frente:** Fundação
- **Fase:** 1
- **Titulo:** CI baseline — build e typecheck verdes
- **Objetivo:** Garantir que `npm run build` e `npx tsc --noEmit` passam em `main` sem erros
- **Contexto:** Não há evidência de CI verde. O workflow `phase-2-env-validation.yml` está blocked. É necessário um workflow básico de build/typecheck.
- **GitHub Issue:** A criar (label: front/foundation, type/ci, risk/medium)
- **Paperclip Task:** A criar
- **Branch esperada:** `task/F1-T02-ci-baseline`
- **Arquivos permitidos:** `.github/workflows/ci-baseline.yml`, `package.json` (scripts), `tsconfig.json`
- **Arquivos proibidos:** `src/app/**`, `src/modules/**`, `drizzle/**`
- **Escopo incluido:** Workflow CI básico, correção de erros de tipo que impedem build
- **Escopo excluido:** Novas features, refatoração de arquitetura
- **Dependencias:** F1-T01
- **Contratos consumidos:** Nenhum
- **Contratos alteraveis:** Nenhum
- **Criterios de aceite:**
  - Workflow `ci-baseline.yml` existe e roda em push para `main`
  - `npm run build` passa sem erros
  - `npx tsc --noEmit` passa sem erros
  - `npm run lint` passa sem erros críticos
- **Testes obrigatorios:** `npm run test:unit` deve rodar (pode ter falhas conhecidas documentadas)
- **Evidencias obrigatorias:** Screenshot/log do CI verde, lista de correções de tipo aplicadas
- **Riscos:** Erros de tipo podem ser extensos; limitar escopo a correções não-arquiteturais
- **Gate de revisao:** DevOps Manager + Reviewer + Codex Governor
- **Proximo responsavel:** DevOps Manager

---

#### Tarefa F1-T03: Auditoria de Schema e Migrations

- **ID:** F1-T03
- **Frente:** Persistência
- **Fase:** 2
- **Titulo:** Auditoria completa do schema e migrations
- **Objetivo:** Documentar o estado real do schema, identificar tabelas órfãs, migrations faltantes, e inconsistências
- **Contexto:** 26+ migrations existem mas não há documentação consolidada do schema atual. Risco de drift entre Drizzle e banco real.
- **GitHub Issue:** A criar (label: front/persistence, type/audit, risk/medium)
- **Paperclip Task:** A criar
- **Branch esperada:** `task/F1-T03-schema-audit`
- **Arquivos permitidos:** `docs/**`, `src/db/**` (leitura), `drizzle/**` (leitura)
- **Arquivos proibidos:** `src/app/**`, `src/modules/**` (exceto leitura)
- **Escopo incluido:** Gerar schema consolidado, identificar gaps, documentar relacionamentos
- **Escopo excluido:** Alterar schema, criar novas migrations
- **Dependencias:** F1-T01
- **Contratos consumidos:** `docs/contracts/` (se existir)
- **Contratos alteraveis:** `docs/contracts/schema-audit.md` (novo)
- **Criterios de aceite:**
  - Documento `docs/contracts/SCHEMA_AUDIT.md` com todas as tabelas
  - Lista de tabelas órfãs ou sem uso
  - Mapa de relacionamentos platform vs runtime
  - Lista de migrations que precisam de correção
- **Testes obrigatorios:** `npm run db:verify-ci` deve rodar
- **Evidencias obrigatorias:** Schema diagram (texto ou mermaid), lista de gaps
- **Riscos:** Schema pode estar significativamente driftado
- **Gate de revisao:** Reviewer + DevOps Manager + Codex Governor
- **Proximo responsavel:** Reviewer

---

#### Tarefa F2-T01: Stabilização do Schema Platform

- **ID:** F2-T01
- **Frente:** Persistência
- **Fase:** 2
- **Titulo:** Stabilização do schema platform
- **Objetivo:** Consolidar o schema da platform em um estado estável e versionado
- **Contexto:** Após auditoria (F1-T03), corrigir inconsistências e criar migrations de reconciliação.
- **GitHub Issue:** A criar (label: front/persistence, type/schema, risk/high)
- **Paperclip Task:** A criar
- **Branch esperada:** `task/F2-T01-stabilize-platform-schema`
- **Arquivos permitidos:** `src/db/platform/**`, `drizzle/**`, `src/platform/contracts/**`
- **Arquivos proibidos:** `src/app/**`, `src/modules/**` (exceto ajustes de import)
- **Escopo incluido:** Correção de migrations, reconciliação de schemas, validação de relacionamentos
- **Escopo excluido:** Novas tabelas de negócio, alterações de runtime
- **Dependencias:** F1-T03
- **Contratos consumidos:** `SCHEMA_AUDIT.md`
- **Contratos alteraveis:** `src/db/platform/**`, `drizzle/**`
- **Criterios de aceite:**
  - `drizzle-kit generate` produz diff limpo
  - `drizzle-kit push` aplica sem erros em banco limpo
  - Todas as tabelas platform têm `workspace_id` onde aplicável
  - Separação lógica platform/runtime preservada
- **Testes obrigatorios:** `npm run db:verify-ci`, testes de migração em banco limpo
- **Evidencias obrigatorias:** Log de migração limpa, diff do drizzle-kit
- **Riscos:** Alterações podem quebrar módulos runtime
- **Gate de revisao:** DevOps Manager + Reviewer + Codex Governor
- **Proximo responsavel:** Jules Executor

---

#### Tarefa F2-T02: Stabilização do Schema Runtime

- **ID:** F2-T02
- **Frente:** Persistência
- **Fase:** 2
- **Titulo:** Stabilização do schema runtime
- **Objetivo:** Consolidar o schema runtime (módulos de negócio) em estado estável
- **Contexto:** Módulos como work-intake, work-items, assets, workforce, etc. têm tabelas que precisam de validação de isolamento multi-tenant.
- **GitHub Issue:** A criar (label: front/persistence, type/schema, risk/high)
- **Paperclip Task:** A criar
- **Branch esperada:** `task/F2-T02-stabilize-runtime-schema`
- **Arquivos permitidos:** `src/db/runtime/**`, `drizzle/**`, `src/modules/**` (schema only)
- **Arquivos proibidos:** `src/app/**` (UI), `src/platform/**`
- **Escopo incluido:** Validação de `workspace_id` em todas as tabelas, índices de isolamento, constraints
- **Escopo excluido:** Novas features de negócio, alterações de platform
- **Dependencias:** F2-T01
- **Contratos consumidos:** `SCHEMA_AUDIT.md`
- **Contratos alteraveis:** `src/db/runtime/**`, `drizzle/**`
- **Criterios de aceite:**
  - Todas as tabelas runtime têm `workspace_id`
  - Testes de isolamento multi-tenant passam
  - `drizzle-kit generate` limpo após alterações
  - Constraints de FK válidas
- **Testes obrigatorios:** Testes de isolamento em `tests/multi-tenant/`
- **Evidencias obrigatorias:** Log de testes de isolamento, diff do drizzle-kit
- **Riscos:** Tabelas sem workspace_id podem precisar de migração de dados
- **Gate de revisao:** DevOps Manager + Tester + Reviewer + Codex Governor
- **Proximo responsavel:** Jules Executor

---

### Frente: Vertical Mínimo (Fase 3)

#### Tarefa F3-T01: Vertical End-to-End — Process Candidate

- **ID:** F3-T01
- **Frente:** Vertical Mínimo
- **Fase:** 3
- **Titulo:** Vertical end-to-end: criar, visualizar e publicar um Process Candidate
- **Objetivo:** Implementar um fluxo completo de UI → API → DB → UI para Process Candidates
- **Contexto:** O sistema precisa provar que consegue levar uma feature do discovery à produção com aprovação humana. Process Candidates são a ponte central.
- **GitHub Issue:** A criar (label: front/vertical, type/feature, risk/high)
- **Paperclip Task:** A criar
- **Branch esperada:** `task/F3-T01-vertical-process-candidate`
- **Arquivos permitidos:** `src/platform/blueprints/**`, `src/app/(builder)/candidates/**`, `src/db/**` (candidates), `src/components/**` (candidate-related)
- **Arquivos proibidos:** `src/modules/**` (módulos de negócio), `src/adaptations/**`
- **Escopo incluido:** CRUD de candidates, UI de listagem/detail, fluxo de publicação com aprovação
- **Escopo excluido:** Workflow engine, actions, integrações
- **Dependencias:** F2-T01, F2-T02
- **Contratos consumidos:** Schema de candidates (migration 0019, 0020)
- **Contratos alteraveis:** `src/platform/blueprints/contracts/candidate.ts`
- **Criterios de aceite:**
  - Usuário logado pode criar um Process Candidate via UI
  - Candidate aparece na listagem do builder
  - Candidate pode ser submetido para aprovação
  - Aprovador pode aprovar/rejeitar com comentário
  - Candidate aprovado é publicado (flag/status change)
  - Todas as operações são por `workspace_id`
- **Testes obrigatorios:** Teste de integração do fluxo completo, teste de isolamento multi-tenant
- **Evidencias obrigatorias:** Screenshots do fluxo, log de teste de integração, evidência de isolamento
- **Riscos:** UI do builder pode estar incompleta; pode precisar de componentes novos
- **Gate de revisao:** Reviewer + Tester + Codex Governor
- **Proximo responsavel:** Jules Executor

---

### Frente: Workflow Engine (Fase 4)

#### Tarefa F4-T01: Action Registry — Registro e Execução Local

- **ID:** F4-T01
- **Frente:** Workflow Engine
- **Fase:** 4
- **Titulo:** Action registry funcional com execução local
- **Objetivo:** Action registry capaz de registrar, listar e executar actions locais com validação de contrato
- **Contexto:** `src/platform/actions/` existe mas precisa de maturação. Remote actions estão listadas mas não implementadas.
- **GitHub Issue:** A criar (label: front/workflow, type/feature, risk/medium)
- **Paperclip Task:** A criar
- **Branch esperada:** `task/F4-T01-action-registry-local`
- **Arquivos permitidos:** `src/platform/actions/**`, `src/platform/registry/**`, `tests/platform/actions/**`
- **Arquivos proibidos:** `src/app/**`, `src/modules/**`
- **Escopo incluido:** Registro de actions, validação de input/output com Zod, execução local com contexto
- **Escopo excluido:** Remote actions, execução distribuída
- **Dependencias:** F2-T01
- **Contratos consumidos:** `src/platform/actions/contracts/`
- **Contratos alteraveis:** `src/platform/actions/**`
- **Criterios de aceite:**
  - Action pode ser registrada com schema de input/output
  - Action pode ser executada com contexto válido
  - Validação de input falha com erro tipado
  - Registry lista actions por workspace e capability
- **Testes obrigatorios:** Testes unitários de registro e execução
- **Evidencias obrigatorias:** Log de testes, exemplo de action registrada e executada
- **Riscos:** Contrato de action pode precisar de redesign
- **Gate de revisao:** Reviewer + Tester + Codex Governor
- **Proximo responsavel:** Jules Executor

---

#### Tarefa F4-T02: Workflow Engine — Definição e Execução Assíncrona

- **ID:** F4-T02
- **Frente:** Workflow Engine
- **Fase:** 4
- **Titulo:** Workflow engine com execução assíncrona
- **Objetivo:** Engine capaz de definir workflows como sequência de actions e executar de forma assíncrona
- **Contexto:** `src/platform/workflow-engine/` e `src/platform/workflows/` existem. Precisa de execução assíncrona com estado e retry.
- **GitHub Issue:** A criar (label: front/workflow, type/feature, risk/high)
- **Paperclip Task:** A criar
- **Branch esperada:** `task/F4-T02-workflow-async-engine`
- **Arquivos permitidos:** `src/platform/workflow-engine/**`, `src/platform/workflows/**`, `src/platform/events/**`, `src/db/platform/schema.ts` (workflow tables)
- **Arquivos proibidos:** `src/app/**`, `src/modules/**`
- **Escopo incluido:** Definição de workflow (JSON), validação, execução assíncrona, estado de execução, retry com backoff
- **Escopo excluido:** UI de workflow builder, integrações externas
- **Dependencias:** F4-T01
- **Contratos consumidos:** Schema de workflow, contrato de action
- **Contratos alteraveis:** `src/platform/workflow-engine/services/`, `src/db/platform/schema.ts` (workflow execution tables)
- **Criterios de aceite:**
  - Workflow pode ser definido como JSON validado
  - Workflow pode ser iniciado e executa actions em sequência
  - Estado de execução é persistido
  - Retry automático em falhas transitórias
  - Event log registra cada step
- **Testes obrigatorios:** Testes de integração do engine, teste de retry
- **Evidencias obrigatorias:** Log de execução de workflow de teste, evidência de retry
- **Riscos:** Execução assíncrona em Next.js é complexa; pode precisar de queue externa
- **Gate de revisao:** Reviewer + Tester + DevOps Manager + Codex Governor
- **Proximo responsavel:** Jules Executor

---

### Frente: Blueprints (Fase 6)

#### Tarefa F6-T01: Blueprint — Definição e Instanciação

- **ID:** F6-T01
- **Frente:** Blueprints
- **Fase:** 6
- **Titulo:** Blueprint: definição e instanciação de moldes
- **Objetivo:** Capacidade de definir um Blueprint (molde) e instanciar em um workspace
- **Contexto:** `src/platform/blueprints/` existe com 2 arquivos. Precisa de modelo completo de definição e instanciação.
- **GitHub Issue:** A criar (label: front/blueprints, type/feature, risk/high)
- **Paperclip Task:** A criar
- **Branch esperada:** `task/F6-T01-blueprint-definition`
- **Arquivos permitidos:** `src/platform/blueprints/**`, `src/db/platform/**` (blueprint tables), `src/platform/registry/**`
- **Arquivos proibidos:** `src/modules/**`, `src/app/**` (exceto admin de blueprints)
- **Escopo incluido:** Modelo de blueprint (processos, forms, capabilities, rules), instanciação em workspace, validação
- **Escopo excluido:** UI de blueprint builder, export/import
- **Dependencias:** F3-T01, F4-T02
- **Contratos consumidos:** Schema de candidates, schema de workflows
- **Contratos alteraveis:** `src/platform/blueprints/contracts/`, `src/db/platform/schema.ts` (blueprint tables)
- **Criterios de aceite:**
  - Blueprint pode ser definido a partir de candidates publicados
  - Blueprint pode ser instanciado em workspace
  - Instanciação cria processos, forms e capabilities no workspace
  - Validação de blueprint antes de publicação
- **Testes obrigatorios:** Teste de instanciação, teste de validação
- **Evidencias obrigatorias:** Log de instanciação, blueprint definido e instanciado
- **Riscos:** Modelo de blueprint pode ser complexo demais para uma tarefa
- **Gate de revisao:** Reviewer + Tester + Codex Governor
- **Proximo responsavel:** Jules Executor

---

### Frente: Governança (Fase 7)

#### Tarefa F7-T01: Painel de Administração e Logs Auditáveis

- **ID:** F7-T01
- **Frente:** Governança
- **Fase:** 7
- **Titulo:** Painel admin consolidado e logs auditáveis
- **Objetivo:** Painel de administração com gestão de usuários, permissões, workspaces e logs auditáveis unificados
- **Contexto:** `/admin` existe mas é básico. Logs de auditoria precisam ser unificados e imutáveis.
- **GitHub Issue:** A criar (label: front/governance, type/feature, risk/medium)
- **Paperclip Task:** A criar
- **Branch esperada:** `task/F7-T01-admin-audit-logs`
- **Arquivos permitidos:** `src/app/admin/**`, `src/platform/governance/**`, `src/platform/observability/**`, `src/db/runtime/schema/traceability.ts`
- **Arquivos proibidos:** `src/modules/**` (exceto leitura de permissões)
- **Escopo incluido:** Gestão de usuários, workspaces, permissões, logs auditáveis imutáveis, painel de auditoria
- **Escopo excluido:** Governança de processos (aprovadores, regras de negócio)
- **Dependencias:** F2-T02
- **Contratos consumidos:** Schema de identidade, schema de traceability
- **Contratos alteraveis:** `src/platform/governance/**`, `src/app/admin/**`
- **Criterios de aceite:**
  - Admin pode gerenciar usuários e permissões
  - Admin pode gerenciar workspaces
  - Todos os eventos operacionais geram log auditável
  - Logs são imutáveis (append-only)
  - Painel de auditoria permite filtrar por workspace, usuário, tipo
- **Testes obrigatorios:** Teste de imutabilidade de logs, teste de permissões
- **Evidencias obrigatorias:** Screenshots do painel, log de teste de imutabilidade
- **Riscos:** Logs imutáveis exigem design cuidadoso de banco
- **Gate de revisao:** Reviewer + Tester + Codex Governor
- **Proximo responsavel:** Jules Executor

---

### Frente: Produto Operável (Fase 9)

#### Tarefa F9-T01: Validação End-to-End e Paridade Frontend

- **ID:** F9-T01
- **Frente:** Produto Operável
- **Fase:** 9
- **Titulo:** Validação end-to-end e paridade frontend completa
- **Objetivo:** Validar que todas as features backend têm UI correspondente e o sistema opera end-to-end
- **Contexto:** AGENTS.md exige paridade frontend. Muitas features backend podem não ter UI.
- **GitHub Issue:** A criar (label: front/product, type/audit, risk/high)
- **Paperclip Task:** A criar
- **Branch esperada:** `task/F9-T01-frontend-parity`
- **Arquivos permitidos:** `src/app/**`, `src/components/**`, `docs/audit/**`
- **Arquivos proibidos:** `src/platform/**` (exceto leitura), `src/db/**` (exceto leitura)
- **Escopo incluido:** Auditoria de paridade, criação de UIs faltantes, validação e2e completa
- **Escopo excluido:** Novas features de backend
- **Dependencias:** Todas as fases anteriores
- **Contratos consumidos:** `docs/archive/planning/FRONTEND_PARITY_GATE.md`
- **Contratos alteraveis:** `src/app/**`, `src/components/**`
- **Criterios de aceite:**
  - Toda feature backend tem UI correspondente
  - Testes e2e do golden cycle passam
  - Performance baseline estabelecida
  - Documentação de usuário completa
- **Testes obrigatorios:** `npm run test:e2e`, golden cycle test
- **Evidencias obrigatorias:** Relatório de paridade, screenshots, logs de testes e2e
- **Riscos:** Pode revelar grande quantidade de UI faltante
- **Gate de revisao:** Reviewer + Tester + Codex Governor + Humano
- **Proximo responsavel:** Reviewer

---

## 4. Mapa de Dependências

```
F1-T01 (merge github-first)
    ├── F1-T02 (ci baseline)
    └── F1-T03 (schema audit)
            ├── F2-T01 (stabilize platform schema)
            │       ├── F4-T01 (action registry)
            │       │       └── F4-T02 (workflow engine)
            │       └── F7-T01 (admin + audit logs)
            └── F2-T02 (stabilize runtime schema)
                    └── F3-T01 (vertical process candidate)
                            └── F6-T01 (blueprints)
                                    └── F9-T01 (product operável)
```

## 5. Ordem de Execução Recomendada

### Sprint 1 — Fundação (semanas 1-2)
1. F1-T01: Merge GitHub-first model
2. F1-T02: CI baseline
3. F1-T03: Schema audit

### Sprint 2 — Persistência (semanas 3-4)
4. F2-T01: Stabilize platform schema
5. F2-T02: Stabilize runtime schema

### Sprint 3 — Vertical Mínimo (semanas 5-6)
6. F3-T01: Vertical process candidate

### Sprint 4 — Workflow Engine (semanas 7-9)
7. F4-T01: Action registry
8. F4-T02: Workflow async engine

### Sprint 5 — Blueprints (semanas 10-11)
9. F6-T01: Blueprint definition

### Sprint 6 — Governança (semanas 12-13)
10. F7-T01: Admin + audit logs

### Sprint 7 — Produto Operável (semanas 14-16)
11. F9-T01: Frontend parity + e2e validation

---

## 6. Delegação de Agentes

| Tarefa | Agente Responsável | Apoio |
|--------|-------------------|-------|
| F1-T01 | Git Manager | Codex Governor |
| F1-T02 | DevOps Manager | Jules Executor |
| F1-T03 | Reviewer | Docs Operator |
| F2-T01 | Jules Executor | DevOps Manager |
| F2-T02 | Jules Executor | Tester |
| F3-T01 | Jules Executor | Reviewer, Tester |
| F4-T01 | Jules Executor | Reviewer |
| F4-T02 | Jules Executor | DevOps Manager, Tester |
| F6-T01 | Jules Executor | Reviewer, Docs Operator |
| F7-T01 | Jules Executor | Reviewer, Tester |
| F9-T01 | Reviewer | Tester, Docs Operator |

---

## 7. Gates de Aprovação

Cada tarefa só avança após:

1. **GitHub Issue** criada e aprovada pelo Codex Governor
2. **Paperclip Task** criada e vinculada
3. **Branch** criada com nome correto
4. **PR** aberto com descrição vinculando a issue
5. **Actions** rodaram (ou blocker documentado)
6. **Reviewer** aprovou o diff
7. **Tester** validou evidências
8. **Codex Governor** decidiu merge

---

## 8. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| CI não passa por erros extensos | Alta | Médio | Limitar F1-T02 a correções não-arquiteturais; criar follow-up para erros complexos |
| Schema drift significativo | Média | Alto | F1-T03 é auditoria apenas; correções vão para F2 |
| Fallback de async em Next.js | Média | Alto | Avaliar queue externa (Redis/Bull) em F4-T02 |
| Token GitHub sem permissão Projects | Certa | Baixo | Usar labels + milestones como alternativa |
| Paridade frontend revelar grande gap | Alta | Médio | F9-T01 pode ser dividida em sub-tarefas por módulo |

---

## 9. Próximos Passos Após Aprovação

1. Criar GitHub Issues para F1-T01, F1-T02, F1-T03
2. Criar Paperclip Tasks vinculadas
3. Atribuir ao agente responsável
4. Iniciar Sprint 1
5. Reportar progresso a cada heartbeat

---

**Este plano é uma proposta. Aguardo aprovação humana antes de criar issues e delegar tarefas.**
