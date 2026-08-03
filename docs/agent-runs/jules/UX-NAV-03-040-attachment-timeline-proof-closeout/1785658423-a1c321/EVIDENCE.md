# Product Closeout Evidence - UX-NAV-03-040 Attachments and timeline show proof of work

**Base SHA:**
`1c56f10b6b3fb1666c5c17b74604735011617a26`

**Node Version:**
`v24.18.1`

**Route/Screen Affected:**
`/work-items/[id]` — Work Item Detail. Specifically the sections/panels: Anexos (Attachments) and Historico (Timeline).

**Persisted Data Path Touched:**
`entity_attachments` (legacy schema) and `workflow.events` (runtime schema), alongside their associated domain models (`EntityAttachmentSchema`, `WorkItemEventSchema`).

**Journey Summary:**
The operator user accesses a work item from the `/work-items` list and navigates to the `/work-items/[id]` details screen. On this screen, real attachments are intended to be loaded via `getEntityAttachments` (rendered in the 'Anexos' section), and timeline events are loaded via `getWorkItemEvents` (rendered newest-first in the 'Historico' section). Empty states are maintained for distinct entities or missing comments. The user operates directly within their workspace context (operator journey, not builder fallback), adds an attachment if needed, and returns via a back navigation button.

**Precise Blocker:**
As noted in the prior integration test stage (UX-NAV-03-039), the real-data journey validation cannot currently be executed and proven in the sandbox E2E/integration environment due to a foundational database schema bootstrap blocker.
- **Environment Required:** PostgreSQL 15/16 with fully seeded multi-schema architectural data.
- **Error Received:** `PostgresError: relation "workspace.workspaces" does not exist` (Code: 42P01) when running `drizzle-kit push`.
- **Reason:** `drizzle-kit push` fails to resolve cross-schema references (e.g., between the `workflow` schema and the `workspace` schema). Because the `workflow.events` and `entity_attachments` tables cannot be reliably initialized, the test runner is prevented from establishing the requisite records to execute the product slice's real data flows.
- **Impact:** The UI layer remains fully connected to the data repositories (preserving the database -> domain -> UI through-line), but the integration validation suite is blocked until the DB bootstrap constraints are solved.

This product slice has implemented the intended vertical layers (database schemas, core domain logic, use-case contracts, UI presentation, and integration bindings) but is terminating closeout recognizing the blocked real-data pipeline. No synthetic data fallbacks or mock logic have been introduced to artificially bypass this structural blocker.