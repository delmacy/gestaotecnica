# UX-NAV-03-035-attachment-timeline-proof-ui-navigation - UI navigation surface

## Required Product Proof

- **Route/screen affected:** `/evidences` (sidebar and workspace home links added), `/[workspaceKey]/timeline` (timeline landing page created to show proof of work).
- **Persistence/domain touchpoint:** `evidences` table and `event_logs` records connected to timeline display via `WorkItemEventTimeline` and `EntityCollaboration`.
- **User Journey:**
  - The user reaches the Timeline page by clicking the "Linha do Tempo" card on the Workspace Home.
  - The user sees what the timeline is used for and can navigate deeper into "Demandas", "Ordens de Serviço", or "Evidências".
  - The user can return via breadcrumbs or the explicit "Voltar ao workspace" button.
- **Data proof:** Checked via type checks (no explicit any introduced) and `npm run build`.

## Validation

- Tested with Node.js 24.18.1.
- `npx tsx scripts/check-explicit-any.ts` run clean.
- Code builds and exports without regressions.
- Known E2E test failures are pre-existing issues unrelated to this feature's scope (`tests/e2e/auth-admin-smoke.spec.ts` connectivity and isolated UX-NAV-01 journey failures). Unit tests pass clean.
