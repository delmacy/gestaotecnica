# Real-data Journey Validation - UX-NAV-03-039 Blocker

**Base SHA:**
`9e4e67ce51d96385b011d0bdf774fc3914ebf2be`

**Node Version:**
`v24.18.1`

**Route/Screen Affected:**
`/work-items/[id]` — Work Item Detail. Specifically the sections/panels: Anexos (Attachments) and Historico (Timeline).

**Persisted Data Path Touched (Attempted):**
`entity_attachments` (legacy schema) and `workflow.events` (runtime schema), alongside their associated domain models (`EntityAttachmentSchema`, `WorkItemEventSchema`).

**Journey Summary:**
The operator user accesses a work item from the `/work-items` list and navigates to the `/work-items/[id]` details screen. On this screen, real attachments are loaded via `getEntityAttachments` (rendered in the 'Anexos' section), and timeline events are loaded via `getWorkItemEvents` (rendered newest-first in the 'Historico' section). Empty states are maintained for distinct entities or missing comments. The user operates directly within their workspace context (operator journey, not builder fallback), adds an attachment if needed, and returns via a back navigation button.

**Precise Blocker:**
The drafted integration test `tests/integration/ux-nav-03-039-attachment-timeline-proof-real-data.test.ts` cannot be successfully run and verified in the current sandbox environment due to a persistent database bootstrap issue. The test file has been removed from this PR as it cannot be successfully typed/executed against a working database.

- **Environment Required:** PostgreSQL 15/16, accessed via `AGENT_WORK_TEST_DATABASE_URL` (or `RUNTIME_DATABASE_URL`), with a fully seeded database matching the application's multi-schema architecture.
- **Command Ran:** `export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agent_work_test"; sudo -u postgres psql -d agent_work_test -c "DROP SCHEMA IF EXISTS workflow CASCADE; DROP SCHEMA IF EXISTS workspace CASCADE; ..."; npm run db:push`
- **Error Received:** `PostgresError: relation "workspace.workspaces" does not exist` (Code: 42P01).
- **Reason:** Even after provisioning a fresh local PostgreSQL 16 instance and dropping potentially conflicting schemas to retry a clean bootstrap, `drizzle-kit push` fundamentally fails to resolve dependencies between the multiple schemas (e.g., `workspace` vs `workflow` schemas) defined in `src/db`. It throws errors when attempting to create relations to tables that it has not yet created across schema boundaries. Because `npm run db:push` is failing, the test runner cannot access the necessary tables (like `workflow.events` and `entity_attachments`) to insert the seed data required to test the query and mutation integrations.
- **Impact:** The `UX-NAV-03-039` vertical slice integration test cannot be validated in this environment.

**Follow-up Task Required:**
A follow-up task (e.g., `UX-NAV-03-040`) must be filed: "Fix Drizzle schema bootstrap (`db:push`) resolving cross-schema table dependencies and provide a persistent real DB seed environment for attachment/timeline integration proofs".
