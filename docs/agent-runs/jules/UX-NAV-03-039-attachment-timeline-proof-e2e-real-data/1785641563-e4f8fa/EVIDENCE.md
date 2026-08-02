# Real-data Journey Validation - UX-NAV-03-039 Blocker

**Base SHA:**
`9e4e67ce51d96385b011d0bdf774fc3914ebf2be`

**Route/Screen Affected:**
`/work-items/[id]` — Work Item Detail. Specifically the sections/panels: Anexos (Attachments) and Historico (Timeline).

**Persisted Data Path Touched (Attempted):**
`entity_attachments` (legacy schema) and `workflow.events` (runtime schema), alongside their associated domain models (`EntityAttachmentSchema`, `WorkItemEventSchema`).

**Journey Summary:**
The operator user accesses a work item from the `/work-items` list and navigates to the `/work-items/[id]` details screen. On this screen, real attachments are loaded via `getEntityAttachments` (rendered in the 'Anexos' section), and timeline events are loaded via `getWorkItemEvents` (rendered newest-first in the 'Historico' section). Empty states are maintained for distinct entities or missing comments. The user operates directly within their workspace context (operator journey, not builder fallback), adds an attachment if needed, and returns via a back navigation button.

**Precise Blocker:**
The draft integration test (`tests/integration/ux-nav-03-039-attachment-timeline-proof-real-data.test.ts`) correctly mirrors this journey but cannot be executed in the current environment.

- **Environment Required:** PostgreSQL 15 or 16, accessed via `AGENT_WORK_TEST_DATABASE_URL` (or `RUNTIME_DATABASE_URL`).
- **Command Ran:** `npm run db:push` / `npx drizzle-kit push --config=drizzle.agent-work.config.ts --force`
- **Error Received:** `PostgresError: schema "workflow" already exists`, followed by `PostgresError: relation "workspace.workspaces" does not exist` or `relation "workflow.events" does not exist`.
- **Reason:** While a local PostgreSQL 16 container/service can be started (e.g., `postgresql://postgres:postgres@localhost:5432/agent_work_test`), pushing the application's multi-schema architecture (`drizzle-kit push`) fails. The `drizzle-kit push` tooling throws dependency and conflict errors when trying to resolve cross-schema relations (`workspace` vs `workflow` schemas) that were bootstrapped but not fully populated with their Drizzle-managed table structures in this specific runner environment.
- **Impact:** Without a successfully bootstrapped schema, the required seed records (organizations, workspaces, users, work_items, entity_attachments, events) cannot be inserted. The test times out or crashes with relation errors on every query.

**Follow-up Task Required:**
A follow-up task (e.g., UX-NAV-03-040 or a structural CI unblocker) must be filed: "Fix Drizzle schema bootstrap (db:push) and provide a persistent real DB seed environment for attachment/timeline integration proofs".
