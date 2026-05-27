# Modulos da Plataforma

Os modulos sao blocos reutilizaveis do ecossistema operacional.

## Modulos implementados

- WorkItems
- ServiceOrders
- Assets
- Workforce
- Scheduling
- ShiftLogs
- TechnicalDocuments
- LegacyRecords
- MaintenancePlans
- TechnicalProjects
- Acquisitions
- Reports
- Events
- WorkspaceConfig
- Suppliers
- Inventory
- Compliance
- Automations
- ResourceNeeds
- Skills

## Padrao de documentacao por modulo

Cada modulo deve registrar:

1. Objetivo
2. Responsabilidades
3. O que e universal
4. O que pode ser adaptado por cliente
5. Entidades/tabelas atuais
6. Actions/use cases
7. Queries principais
8. Eventos emitidos
9. Dependencias
10. Limitacoes atuais
11. Evolucao futura
12. Possiveis alteracoes de base

## Regra

Se uma variacao pertence ao cliente, ela deve entrar em `src/adaptations`.
Se ela pertence ao comportamento reutilizavel, deve entrar em `src/modules`.

## Documentos especificos

- `docs/modulos/auth.md`
- `docs/modulos/admin.md`
- `docs/modulos/permissions-rbac.md`
- `docs/modulos/work-items.md`
- `docs/modulos/service-orders.md`
- `docs/modulos/assets.md`
- `docs/modulos/workforce.md`
- `docs/modulos/schedules.md`
- `docs/modulos/shift-logs.md`
- `docs/modulos/documents.md`
- `docs/modulos/reports.md`
- `docs/modulos/legacy.md`
- `docs/modulos/comments-attachments.md`
- `docs/modulos/queues-sla.md`
- `docs/modulos/workflow-engine.md`
- `docs/modulos/workspace-config.md`
- `docs/modulos/approvals.md`
- `docs/modulos/evidences.md`
- `docs/modulos/planning.md`
- `docs/modulos/maintenance-plans.md`
- `docs/modulos/technical-projects.md`
- `docs/modulos/acquisitions.md`
- `docs/modulos/skills.md`
- `docs/modulos/resource-needs.md`
- `docs/modulos/automations.md`
- `docs/modulos/suppliers.md`
- `docs/modulos/inventory.md`
- `docs/modulos/compliance.md`
- `docs/modulos/operations.md`
- `docs/modulos/global-search.md`
- `docs/modulos/timesheets.md`
- `docs/modulos/events.md`
