# Real-data Journey Validation - UX-NAV-03-039 Blocker

**Route/Screen Affected:**
`/work-items/[id]` — Work Item Detail. Sections: Anexos, Historico, and Comentarios.

**Persisted Data Path Touched:**
`entity_attachments` (legacy) + `workflow.events` (runtime) and associated domain models.

**Journey Summary:**
The user accesses a work item from `/work-items` and arrives at `/work-items/[id]`. The journey loads real attachments (`getEntityAttachments`), timeline events (`getWorkItemEvents`), and handles empty states. The user can add attachments and return via a back button.

**Precise Blocker:**
The draft test (`tests/integration/ux-nav-03-039-attachment-timeline-proof-real-data.test.ts`) requires a real postgres database connected via `AGENT_WORK_TEST_DATABASE_URL` (or `RUNTIME_DATABASE_URL`). Although a postgres instance was successfully spun up locally for tests, pushing the full schema (`npm run db:push`) fails with errors indicating mismatched dependencies across platform schemas (e.g., `schema "workflow" already exists`, `relation "workspace.workspaces" does not exist`, and `relation "workflow.events" does not exist`). This breaks the schema bootstrap process required to load data models for this integration slice. Without a complete schema, it is impossible to insert the necessary entities (organization, workspace, work items, attachments, events) to validate the integration. The task cannot proceed further without resolving the database schema management tools or providing a correctly provisioned test database.
