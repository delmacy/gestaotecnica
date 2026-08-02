This PR finalizes the `UX-NAV-03-039-attachment-timeline-proof-e2e-real-data` vertical slice validation task by evaluating the OpenCode worker draft.

### Base Sync
Base SHA: `9e4e67ce51d96385b011d0bdf774fc3914ebf2be`

### Task Outcome

**Draft Evaluated:**
- The worker drafted a thorough integration test in `tests/integration/ux-nav-03-039-attachment-timeline-proof-real-data.test.ts`.
- The test correctly sets up the database records (Organization, Workspace, Work Items, Entity Attachments, and Workflow Events) mirroring the required path.
- The contract validations assert the newest-first timeline ordering and isolated workspace contexts accurately.

**Outcome:**
The integration test depends heavily on the `AGENT_WORK_TEST_DATABASE_URL` (or equivalent test postgres instance) for persisting and reading the slice endpoints (`getEntityAttachments`, `getWorkItemEvents`). While running `npm run db:push` in the local testing sandbox, fatal database connection and schema dependency errors occur (`PostgresError: relation "workspace.workspaces" does not exist`, `schema "workflow" already exists`). Without a fully bootstrapped database layer, the tests fail immediately with connection timeouts or missing relation errors.

**Blocker Recorded:**
As per the requirement to "Record real-data proof or a precise blocker instead of substituting fake demo success", we have safely halted and generated an `EVIDENCE.md` document indicating this structural blocker in the DB bootstrapping logic for this specific slice.
