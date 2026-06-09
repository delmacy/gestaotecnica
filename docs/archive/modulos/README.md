# Módulos da System Builder Platform

Os módulos são blocos reutilizáveis do ecossistema operacional. Eles devem ser
descritos como capacidades de uma plataforma de montagem, não como partes de um
único sistema de gestão técnica.

## Módulos implementados

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

## Padrão de documentação por módulo

Cada módulo deve registrar:

1. Objetivo
2. Responsabilidades
3. O que é universal
4. O que pode ser adaptado por cliente
5. Entidades/tabelas atuais
6. Actions/use cases
7. Queries principais
8. Eventos emitidos
9. Dependências
10. Limitações atuais
11. Evolução futura
12. Possíveis alterações de base

## Regra

Se uma variação pertence ao cliente, ela deve entrar em `src/adaptations`.
Se ela pertence ao comportamento reutilizável, deve entrar em `src/modules`.

## Documentos específicos

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
