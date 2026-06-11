# Checklist Pós-Dev: DEV-REVIEW-CAPABILITY-EXPLORER-001

| Item | Status | Evidence | Issue | Decision |
|---|---|---|---|---|
| `/builder/capabilities` renderiza | pass | `src/app/(builder)/builder/capabilities/page.tsx` exists | none | APPROVED |
| grid/lista presente | pass | `CapabilityCard` renders filtered capabilities | none | APPROVED |
| busca presente | pass | `CapabilityFilters` implemented | none | APPROVED |
| filtros presentes | pass | `CapabilityFilters` implemented (category, priority, status) | none | APPROVED |
| cards presentes | pass | `CapabilityCard` implemented | none | APPROVED |
| painel de detalhe presente | pass | `CapabilityDetailPanel` implemented | none | APPROVED |
| mock/synthetic mode visível | pass | "Mock Data" badge and Alert visible | none | APPROVED |
| Request Install simulado | pass | Local React state updates (`handleRequestInstall`) | none | APPROVED |
| future/blocked/not_available bloqueiam Request Install | pass | Disabled button logic mapped in code | none | APPROVED |
| sem banco | pass | No Drizzle or external DB calls | none | APPROVED |
| sem migration | pass | Checked code diff, none present | none | APPROVED |
| sem API | pass | Only client-side components | none | APPROVED |
| sem server action | pass | Only client-side actions | none | APPROVED |
| sem auth real | pass | Checked code diff | none | APPROVED |
| sem RBAC real | pass | Checked code diff | none | APPROVED |
| sem runtime | pass | Checked code diff | none | APPROVED |
| sem n8n | pass | Checked code diff | none | APPROVED |
| sem edição real de Markdown | pass | Code works on JS objects | none | APPROVED |
| sem fontes reais | pass | Using mock data list | none | APPROVED |
| sem workspace real | pass | Local mock only | none | APPROVED |
| sem Registry View real | pass | Limited to Explorer bounds | none | APPROVED |
| package.json verificado | pass | Verified shadcn additions, no external unapproved dependencies | none | APPROVED |
| lockfile verificado, se existir | pass | Consistent with npm install | none | APPROVED |
| `npx shadcn@latest add alert` auditado | pass | Confirmed its use is standard for project UI | none | APPROVED |
| lint executado ou justificativa registrada | pass | Lint run, only pre-existing any warnings | none | APPROVED |
| build executado ou justificativa registrada | pass | Next build passes correctly | none | APPROVED |
| test:unit executado ou justificativa registrada | pass | `npm run test:unit` passes 123 tests | none | APPROVED |
