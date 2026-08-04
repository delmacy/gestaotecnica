# Fase 22–26 — Próximas 50 Tasks do System Builder

## Objetivo

Evoluir o System Builder de plataforma corrigida (Fase 21) para plataforma multi-tenant completa com engine de processos, capabilities universais, governança e runtime operacional. Cada fase contém 10 tasks totalizando 50 tasks distribuídas em 5 fases.

**Escopo excluído:** System Trading (`system-building/`) permanece como tenant isolado e não deve ser alterado.

## Contexto

A Fase 21 (hardening) corrigiu vazamento multi-tenant, segurança de queries e performance crítica. Com a base estabilizada, as próximas 5 fases implementam as camadas que transformam o System Builder em um verdadeiro Control Plane: isolamento completo de workspaces, espelhamento de processos, catálogo de capabilities, governança RBAC e engine de execução.

Estas fases materializam as 50 fases documentais do `GLOBAL_WORK_BOARD` (IDs 1–50) em código executável.

## Regras

1. Toda implementação de backend deve declarar impacto no frontend (paridade obrigatória — AGENTS.md §5).
2. Nenhuma task deve alterar arquivos do System Trading (`system-building/`).
3. Cada task deve incluir testes unitários ou de integração.
4. Migrations devem ser rastreáveis (não usar `drizzle-kit push --force` em produção).
5. Toda nova query deve filtrar por `workspaceId` (padrão estabelecido na Fase 21).
6. Nenhuma fase pode começar sem que a fase anterior tenha todas as tasks `done`.

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
- `workspace-menu-fix/**`

---

## Fase 22: Multi-tenant & Workspace Foundation (Tasks 1–10)

**Tema:** Isolamento completo de tenants, gestão de workspaces e configuração por tenant.

| ID | Título | Prioridade | Effort |
|---:|---|---|---|
| SB-MT-01 | Implementar suíte de verificação de isolamento multi-tenant (testes automatizados que provam que tenant A não acessa dados do tenant B) | 🔴 Crítica | L |
| SB-MT-02 | CRUD de configuração de workspace (settings por workspace: nome, logo, timezone, idioma, chaves de integração) | 🟠 Alta | M |
| SB-MT-03 | CRUD de membros do workspace (convidar, listar, remover, atribuir role) com notificação por evento | 🟠 Alta | M |
| SB-MT-04 | Workspace switcher persistente na UI (header dropdown, salva workspace ativo no cookie/localStorage, recarrega escopo) | 🟠 Alta | M |
| SB-MT-05 | Painel super-admin cross-workspace (listar todos os workspaces, métricas agregadas, gerenciar membros globais) | 🟡 Média | L |
| SB-MT-06 | API e fluxo de onboarding de novo tenant (provisionar workspace + schema + admin padrão + seed data) | 🟠 Alta | M |
| SB-MT-07 | Exportação/importação de dados por workspace (JSON estruturado com validação de schema) | 🟡 Média | M |
| SB-MT-08 | Feature flags por workspace (toggle de módulos ativos: service-orders, workforce, strategy, etc.) | 🟡 Média | M |
| SB-MT-09 | Bootstrap de workspace padrão (seed de dados iniciais: tipos de work-item, status, prioridades, cargos) | 🟡 Média | S |
| SB-MT-10 | Deleção de workspace com cascade completo (desativar + agendar purge + notificar admin) | 🟡 Média | M |

---

## Fase 23: Process Mirroring Engine (Tasks 11–20)

**Tema:** Implementar o módulo de espelhamento de processos — observação, candidatura, aprovação e publicação.

| ID | Título | Prioridade | Effort |
|---:|---|---|---|
| SB-PM-01 | CRUD de fontes de observação (webhook do n8n, entrada manual, eventos do sistema, upload de documento) | 🔴 Crítica | M |
| SB-PM-02 | Criação de Process Candidate a partir de observação (extrator de padrões, UI de revisão antes de salvar) | 🔴 Crítica | L |
| SB-PM-03 | Workflow de revisão de Process Candidate (rascunho → submetido → aprovado/rejeitado → publicado) com notificações | 🟠 Alta | L |
| SB-PM-04 | CRUD de modelo As-Is (diagrama de estados, transições, atores, sistema, formulários associados) | 🟠 Alta | XL |
| SB-PM-05 | Motor de análise de gaps (comparar As-Is vs modelo de referência por capability, detectar desvios) | 🟠 Alta | XL |
| SB-PM-06 | Extrator de padrões de processo (detecção de repetição: mesmo evento 3× em 30 dias = padrão candidato) | 🟡 Média | L |
| SB-PM-07 | Versionamento de processos (diff entre versões, changelog automático, rollback para versão estável) | 🟡 Média | M |
| SB-PM-08 | Grafo de dependências entre processos (visualização interativa: processo A → B → C) | 🟡 Média | M |
| SB-PM-09 | Dashboard de métricas de processo (cycle time, throughput, bottlenecks, histograma de duração) | 🟡 Média | L |
| SB-PM-10 | Publicação de processo no registry (Process Candidate → Process Definition publicado, visível no catálogo) | 🟠 Alta | M |

---

## Fase 24: Universal Capabilities Platform (Tasks 21–30)

**Tema:** Implementar as 20 capabilities universais definidas no GLOBAL_WORK_BOARD como módulos funcionais.

| ID | Título | Prioridade | Effort |
|---:|---|---|---|
| SB-CP-01 | Registry de capabilities (CRUD de capability: nome, descrição, entidades, processos associados, ícone) | 🔴 Crítica | M |
| SB-CP-02 | Capability de Organization (estrutura organizacional, hierarquia de unidades, centro de custo) | 🟠 Alta | L |
| SB-CP-03 | Capability de People (perfil, skills, certificações, histórico de alocação, disponibilidade) | 🟠 Alta | L |
| SB-CP-04 | Capability de Customers (cadastro, contratos, histórico de interações, SLA tracking) | 🟠 Alta | M |
| SB-CP-05 | Capability de Requests (intake forms, triagem automática, roteamento por skill/área) | 🟠 Alta | L |
| SB-CP-06 | Capability de Cases (ciclo de vida completo: abertura → evidências → decisão → fechamento) | 🟠 Alta | L |
| SB-CP-07 | Capability de Tasks & Work Orders (criação, despacho, execução, fechamento com assinatura digital) | 🟠 Alta | L |
| SB-CP-08 | Capability de Scheduling (agenda por recurso, conflitos, otimização por janela de tempo) | 🟡 Média | L |
| SB-CP-09 | Capability de Inventory & Assets (estoque, movimentações, rastreabilidade, reconciliação) | 🟡 Média | L |
| SB-CP-10 | Capability de Documents, Approvals & Audit (documentos vinculados, fluxo de aprovação, trilha de auditoria) | 🟠 Alta | L |

---

## Fase 25: Governance, RBAC & Security (Tasks 31–40)

**Tema:** Implementar controle de acesso baseado em papéis, segregação de funções e compliance.

| ID | Título | Prioridade | Effort |
|---:|---|---|---|
| SB-GV-01 | CRUD de hierarquia de roles (admin, manager, supervisor, operator, viewer) com herança de permissões | 🔴 Crítica | M |
| SB-GV-02 | Matriz de permissões (resource + action + role) com UI de grid interativa (checkboxes) | 🔴 Crítica | L |
| SB-GV-03 | Middleware de verificação de permissão em todas as rotas de API Route Handlers e Server Actions | 🔴 Crítica | XL |
| SB-GV-04 | Visualizador de audit log (busca por workspace, usuário, ação, recurso; filtros por data; exportação CSV) | 🟠 Alta | L |
| SB-GV-05 | Ferramenta de verificação de least privilege (detectar roles com permissões não utilizadas em 90 dias) | 🟡 Média | M |
| SB-GV-06 | Motor de regras de Segregation of Duties (SoD): impedir que mesma pessoa execute passos conflitantes | 🟠 Alta | L |
| SB-GV-07 | CRUD de políticas de aprovação (quem aprova o quê: por valor, por tipo, por departamento) | 🟡 Média | M |
| SB-GV-08 | Autenticação multifator opcional (TOTP para ações sensíveis: deletar workspace, aprovar alto valor) | 🟡 Média | L |
| SB-GV-09 | Gerenciamento de sessões (listar sessões ativas por usuário, revogar sessão, force logout) | 🟡 Média | M |
| SB-GV-10 | Gerador de relatório de compliance (PDF: quem acessou o quê, permissões vigentes, exceções aprovadas) | 🟠 Alta | M |

---

## Fase 26: Workflow Engine, Runtime & Frontend Parity (Tasks 41–50)

**Tema:** Motor de execução de workflows, engine de formulários, integração Paperclip e paridade frontend.

| ID | Título | Prioridade | Effort |
|---:|---|---|---|
| SB-WE-01 | Motor de execução de workflow (state machine: process definition → instância → transições → eventos) | 🔴 Crítica | XL |
| SB-WE-02 | Engine de renderização de formulários dinâmicos (JSON schema → formulário HTML com validação) | 🟠 Alta | L |
| SB-WE-03 | Visualizador de instância de processo (timeline, estado atual, histórico de transições, dados do formulário) | 🟠 Alta | L |
| SB-WE-04 | Triggers orientados a eventos (webhook → process.start, schedule → process.start, event → transition) | 🟠 Alta | L |
| SB-WE-05 | Fila de jobs em background (`res.waitUntil()` + worker consumidor para operações pesadas) | 🟠 Alta | XL |
| SB-WE-06 | Binding de integração Paperclip (padronizar webhooks do n8n → eventos do System Builder) | 🟠 Alta | M |
| SB-WE-07 | Biblioteca de componentes UI (design system: Button, Input, Select, Table, Modal, Toast, Pagination) | 🟡 Média | XL |
| SB-WE-08 | Auditoria de paridade frontend (cada módulo backend tem página/componente correspondente; gaps viram novas tasks) | 🟠 Alta | L |
| SB-WE-09 | Suíte de testes E2E com Playwright (critical paths: login → criar work-item → aprovar → gerar OS) | 🟠 Alta | L |
| SB-WE-10 | Portal do desenvolvedor da API Gateway (documentação interativa, playground, geração de chaves de integração) | 🟡 Média | L |

---

## Dependências entre Fases

```
Fase 22 (Multi-tenant) → Fase 23 (Process Mirroring) → Fase 24 (Capabilities)
                                                                       ↓
Fase 25 (Governance) ←───────────────────────────────────────── Fase 26 (Runtime)
```

- **Fase 22** é pré-requisito para todas as demais (isolamento de tenant é base de tudo).
- **Fase 23** depende de Fase 22 (Process Candidates pertencem a um workspace).
- **Fase 24** depende de Fase 22 (capabilities são instaladas por workspace) e pode rodar em paralelo com Fase 23.
- **Fase 25** depende de Fase 22 (RBAC é por workspace) e pode rodar em paralelo com Fase 23 e 24.
- **Fase 26** depende de Fase 24 (workflow executa capabilities) e Fase 25 (permissões protegem execução).

## Ordem de Execução Recomendada

```
Fase 22 ─┬─→ Fase 23 ──→ Fase 24 ──→ Fase 26
          │                              ↑
          └─→ Fase 25 ───────────────────┘
```

1. **Fase 22 completa** (tasks 1–10) — fundação multi-tenant
2. **Fase 23 paralelo com Fase 25** (tasks 11–20 e 31–40) — processos + governança
3. **Fase 24** (tasks 21–30) — capabilities após estrutura de processos definida
4. **Fase 26** (tasks 41–50) — runtime após capabilities e governança prontas

## Validações

- `npm run typecheck` sem erros após cada fase
- `npm test` com cobertura mínima de 60%
- `npm run build` sem warnings críticos
- Nenhuma query retorna dados de workspace não autorizado (verificação automatizada)
- Playwright E2E cobre 3 critical paths (login → work-item → OS; login → processo → publicação; admin → RBAC)

## Regra de Parada

Todas as 50 tasks marcadas como `done` no `docs/00-current/WORK_BOARD.md` e no `docs/GLOBAL_WORK_BOARD.md`. Cada fase é concluída individualmente antes de iniciar a próxima.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/GLOBAL_WORK_BOARD.md
docs/archive/planning/mvp/PHASE_22.md (este arquivo)
docs/ARCHITECTURE.md
docs/archive/foundation/MANIFESTO.md

Fase 22–26 — Próximas 50 Tasks do System Builder

Objetivo:
Executar as 50 tasks distribuídas em 5 fases (Fase 22 a Fase 26), iniciando pela Fase 22 (Multi-tenant & Workspace Foundation).

Ordem:
1. Fase 22 (tasks 1–10) — obrigatório concluir antes de avançar
2. Fase 23 (tasks 11–20) + Fase 25 (tasks 31–40) — podem rodar em paralelo
3. Fase 24 (tasks 21–30)
4. Fase 26 (tasks 41–50)

Regras:
- Toda query nova deve filtrar por workspaceId (padrão Fase 21)
- Toda task inclui testes
- Paridade frontend obrigatória
- System Building (system-building/) não pode ser alterado

Primeira task: SB-MT-01 — Implementar suíte de verificação de isolamento multi-tenant.
```
