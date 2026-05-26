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

- `docs/modulos/workspace-config.md`
