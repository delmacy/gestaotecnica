# MIGRACAO E CONSOLIDACAO DE PERSISTENCIA DA PLATAFORMA

## 1. Referências de Workspace
O sistema possuía a definição duplicada de Workspaces:
- Legado: `public.workspaces` definida em `src/db/legacy/schema.ts`
- Novo: `workspace.workspaces` definida em `src/db/runtime/schema/workspace.ts`

As entidades de negócio legadas importam `workspaces` (o do schema public) para fazer Foreign Keys:
- WorkItems, ServiceOrders, Assets, Shifts, Workforce, etc. Todas têm `workspaceId: uuid("workspace_id").references(() => workspaces.id)` e precisam ser movidas para referenciar a tabela nova.

## 2. Referências de Organization
- Apenas existe no novo esquema: `workspace.organizations` em `src/db/runtime/schema/workspace.ts`. Nenhuma tabela do `public` referenciou diretamente organizações legadas no código atual (o Drizzle ORM não a define no legacy schema). Isso facilita a consolidação do Tenant base.

## 3. Referências de Events (Event Store e Outbox)
O modelo atual fraturava os eventos e corrompia o banco nas integrações do kernel:
- O módulo core `src/platform/events/event-log-service.ts` usava o modelo `eventLogs` do esquema `public` (`src/db/legacy/schema.ts`).
- O `src/platform/outbox/outbox-service.ts` usa `outboxEvents` de `public`.
- Diversos módulos de domínio (Dashboard, Relatórios, etc.) consultam `eventLogs` usando Drizzle ORM.
A refatoração forçará `eventLogs` e `outboxEvents` a apontarem exclusivamente para o schema `workflow` e não mais existir no `public`.

## 4. Referências de Flows e Processes
A modelagem nova (`workflow.flow_definitions`, `workflow.process_definitions`) e suas tabelas satélites estão contidas em `src/db/runtime/schema/workflow.ts`. A refatoração focará em garantir que o Runtime e Builder do Canvas as utilizem de forma limpa, não precisando desviar do Drizzle, visto que o schema PostgreSQL será garantido na etapa 2.
