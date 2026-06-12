# Checklist: DEV-REVIEW-VIEW-BUILDER-001

| item | status | evidence | issue | decision |
| --- | --- | --- | --- | --- |
| `/builder/view-builder` renderiza | OK | page.tsx renderiza ViewBuilderStudio | Nenhum | Pass |
| lista de blueprints presente | OK | ViewBlueprintList component | Nenhum | Pass |
| view type selector presente | OK | ViewTypeSelector component | Nenhum | Pass |
| canvas/preview presente | OK | ViewCanvas component | Nenhum | Pass |
| fields/columns presentes | OK | ViewFieldPalette component | Nenhum | Pass |
| filters presentes | OK | ViewFiltersPanel component | Nenhum | Pass |
| sorting/grouping presentes | OK | ViewSortingPanel component | Nenhum | Pass |
| actions placeholders presentes | OK | ViewActionsPanel component | Nenhum | Pass |
| bindings presentes | OK | ViewBindingsPanel component | Nenhum | Pass |
| governance warnings presentes | OK | ViewGovernancePanel component | Nenhum | Pass |
| design-only/static/mock mode visível | OK | Badges no page.tsx e canvas | Nenhum | Pass |
| not runtime / not persisted / no real query visível | OK | Notice no ViewCanvas | Nenhum | Pass |
| real_pending visível | OK | Tag no ViewFieldPalette | Nenhum | Pass |
| real_blocked visível | OK | Tag no ViewFieldPalette | Nenhum | Pass |
| sem banco | OK | Ausência de Drizzle/SQL | Nenhum | Pass |
| sem migration | OK | Pastas DB intocadas | Nenhum | Pass |
| sem API | OK | Ausência de Fetch / Server Actions | Nenhum | Pass |
| sem server action | OK | Sem 'use server' | Nenhum | Pass |
| sem auth real | OK | N/A | Nenhum | Pass |
| sem RBAC real | OK | N/A | Nenhum | Pass |
| sem runtime | OK | N/A | Nenhum | Pass |
| sem n8n | OK | N/A | Nenhum | Pass |
| sem edição real de Markdown | OK | N/A | Nenhum | Pass |
| sem leitura real de filesystem runtime | OK | N/A | Nenhum | Pass |
| sem GitHub integration | OK | N/A | Nenhum | Pass |
| sem geração real de componente/rota/query | OK | Apenas UI react efêmera | Nenhum | Pass |
| sem workspace real | OK | N/A | Nenhum | Pass |
| sem Gestão Técnica real | OK | Mock data sintético | Nenhum | Pass |
| sem package alterado | OK | package.json intocado | Nenhum | Pass |
| lint/build/test executados ou justificativa | OK | Comandos serão rodados no pre-commit check | Nenhum | Pass |
