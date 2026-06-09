# AUDITORIA TÉCNICA - FUNDAÇÃO DE PERSISTÊNCIA E MULTI-TENANT

## Seção 1: Resumo Executivo
Esta auditoria complementar foi executada estritamente sobre a camada fundacional do `System Builder`, avaliando a orquestração do `Drizzle ORM` junto aos `multi-schemas` do PostgreSQL, isolamento Multi-Tenant, fluxo de Workspaces e a Event Store.

O diagnóstico aponta uma fragmentação severa de arquitetura: o banco de dados encontra-se fraturado entre o esquema `public` (legado fortemente acoplado) e os esquemas lógicos propostos (`workspace`, `workflow`, `registry`). A ausência de suporte nativo simples no Drizzle para empurrar múltiplos esquemas dinâmicos, aliada à falta de migrações estruturadas, impede o bootstrap via `npm run db:generate / push` de ponta a ponta sem erros massivos de `Schema does not exist`.

Além disso, o fluxo ponta a ponta quebra no meio da execução porque o Event Bus central tenta salvar os eventos de um novo Workspace (salvo no novo esquema `workspace`) no registro legado de eventos que verifica Constraints no esquema `public`.

---

## Seção 2: Mapa Completo dos Schemas

Foi executada uma query `information_schema` na base rodando. Segue o inventário:

### Schema: `public` (Legado / Monolito)
Contém 62 tabelas. Inclui todos os módulos legados (`service_orders`, `work_items`, etc).
- `workspaces`, `organizations` (O que gera colisão com o novo schema).
- `event_logs`, `outbox_events`, `flow_runs`.
- **Status Físico:** Todas as tabelas existem.
- **Migration:** Existe migração.

### Schema: `workspace` (Novo Modelo - Platform)
- `organizations`, `workspaces`.
- **Status Físico:** As tabelas existem após rodarmos scripts manuais ou hacks, mas não sobem sozinhas se o esquema não estiver pre-criado com `CREATE SCHEMA`.
- **Quebras:** As views legadas não enxergam esses tenants.

### Schema: `workflow` (Novo Modelo - Engine)
- `flow_definitions`, `process_definitions`, `process_versions`, `states`, `events`, `process_instances`.
- **Status Físico:** O schema não é gerado nativamente. As tabelas requerem injeção manual.

### Schemas: `registry`, `identity`, `documents`, `storage`, `blueprints`
- Definidos inteiramente no código TypeScript (`src/db/platform/schema/*`).
- **Status Físico:** **Não existem no banco.** O `drizzle-kit push` os ignora complementamente porque o esquema do Postgres não foi criado de antemão.

---

## Seção 3: Problemas Encontrados

1. **Bootstrap Quebrado (Drizzle Kit Multi-Schema):**
   O `drizzle.config.ts` aceita múltiplos arquivos glob, mas se os *PostgreSQL Schemas* (ex: `CREATE SCHEMA registry`) não existirem fisicamente, o `drizzle-kit push` ignora as tabelas sem acusar erro crítico de criação de schema, ou lança um `relation does not exist`.
2. **Divergência Crítica de FKs no Event Store:**
   Quando a action `workspaces.create` é executada, o Workspace é salvo no novo namespace (`workspace.workspaces`). Quando uma ação dispara um evento (ex: `work_item.created`), o sistema tenta inserir na tabela legada `public.event_logs`. Como esta tabela tem uma Constraint FK apontando para `public.workspaces`, o Postgres nega a inserção.
3. **Múltiplas Tabelas para um mesmo Conceito:**
   Existem `public.workspaces` vs `workspace.workspaces`. Existem `public.event_logs` vs `workflow.events`.

---

## Seção 4: Causa Raiz de Cada Problema

1. **Problema do Drizzle Multi-Schema:**
   O Drizzle ORM lida com "pgSchema" corretamente nas queries, mas o utilitário `drizzle-kit push` é instável na criação automática dos "Namespaces/Schemas" do banco caso eles não existam no servidor. Sem um hook ou script que rode `CREATE SCHEMA IF NOT EXISTS`, o ORM falha silenciosamente ou quebra na primeira FK.
2. **Problema do Event Store (Constraint Violation):**
   A arquitetura está no meio de uma transição (Platform vs Legado). As Actions executam no Kernel da plataforma, mas a engine de eventos (`emitEvent` em `event-log-service.ts`) ainda aponta para `getDb().insert(eventLogs)` — onde `eventLogs` é do `legacy/schema.ts`. A causa raiz é a falta de isolamento da camada legada.
3. **Vazamento e Inconsistência de Multi-Tenant:**
   O sistema é um "Tenant por `workspace_id`". Mas como as entidades lógicas novas apontam para o novo ID, mas as lógicas de engine (Event, Outbox) apontam para a tabela antiga, o tenant vaza ou é impedido de executar.

---

## Seção 5: Plano de Correção (Priorizado por Impacto)

1. **Alta Prioridade: Script de Inicialização de Schemas**
   Adicionar um script `pre-migrate` no `package.json` que se conecte ao banco usando `postgres` puro e execute `CREATE SCHEMA IF NOT EXISTS workspace, workflow, registry, blueprints, identity...`. Isso destrava imediatamente o `npm run db:push`.
2. **Alta Prioridade: Sincronização de Workspaces ou Redirecionamento**
   Atualizar o `event-log-service.ts` para que ele armazene eventos na nova tabela `workflow.events` e remova a dependência forte com `public.workspaces`, **OU** duplicar a sincronização para o workspace legado até a migração terminar. A recomendação correta é desvincular o Core de Eventos das tabelas do monólito.
3. **Média Prioridade: Refatoração do Drizzle Config para Migrations Explícitas**
   Abandonar o `drizzle-kit push` em produção e forçar o uso de `generate` + `migrate`. Migrations explícitas resolvem problemas de concorrência e dependência circular de FKs entre schemas.
4. **Baixa Prioridade: Limpeza de Tabelas Duplicadas**
   Remover gradativamente tabelas do `public.*` à medida em que os Módulos são recriados no padrão da plataforma (com Action/Events próprios).

---

## Seção 6: Recomendação Arquitetural Final

**A arquitetura atual de persistência deve ser: SIMPLIFICADA.**

*Justificativa Técnica:*
O modelo de separar o banco de dados em *Schemas PostgreSQL Lógicos* (Identity, Workspace, Workflow, Registry) é excelente do ponto de vista de Bounded Contexts em Domain-Driven Design (DDD). O isolamento Tenant por `workspace_id` (Row-level Isolation) também é a escolha mais escalável.

O problema não é o modelo teórico, mas a **transição caótica**.

Recomendação:
- **Consolidar as migrações** e forçar a criação dos Schemas lógicos no nível de Infraestrutura (banco).
- O Event Store **deve** pertencer ao `Platform Shell`, não ao domínio `public` do ERP legado. Mova o log de eventos inteiramente para o novo esquema `workflow.events`, permitindo que o `OutboxService` funcione sem depender do `public`.
- O isolamento Multi-Tenant (`workspace_id`) deve ser mantido, mas as tabelas de entidades de negócio legadas (WorkItem, OS, etc.) devem temporariamente ter a verificação de chave estrangeira (FK) de `workspace_id` relaxada para que não procurem forçosamente em `public.workspaces` caso a ação venha do Builder.
