# Evidence for UX-NAV-03-041: Queue, search, and draft recovery complete the operator loop - Database/persistence foundation

## Node Version Verification
Verified by checking `node --version`: v24.18.1.

## Route / Screen Affected
- **Routes:**
  - `/operations` (Operations Board for tracking active items in queues)
  - `/admin/queues` (Queue admin management for operations and SLA tracking)
  - `/search` (Global Search locating drafts across Work Items, Service Orders, and other modules)
  - Various list pages tracking draft states across entities (e.g. `/work-items`, `/service-orders`, `/documents`).
- **Components:** `OperationsBoard` (in `src/modules/operations/operations-board.tsx`), `SearchResults` (in `src/modules/global-search/search-results.tsx`).

## Database / Persistence / Domain Touched
- This stage acts as a verification/confirmation step that the persistence foundation for "queue, search, and draft recovery" already exists and is fully implemented. No new tables or migrations were needed.
- **Queues:** Handled by the legacy database schemas `workspaceQueues`, `queueItems`, and `slaPolicies` defined in `src/db/legacy/schema.ts`.
- **Search:** The global search indexes rely on existing schemas in `src/db/legacy/schema.ts` and `src/db/runtime/schema`.
- **Draft Recovery:** Realized organically through entities preserving an explicit `"draft"` state. Relevant legacy enums/schemas such as `workItemStatusEnum`, `serviceOrderStatusEnum`, `documentStatusEnum`, `planningStatusEnum`, `automationStatusEnum`, and `contractStatusEnum` strictly define the `draft` state (e.g. lines 40-181 in `src/db/legacy/schema.ts`), allowing users to return and recover unsubmitted or in-progress operational demand. Workflow runtime schema elements (`src/db/runtime/schema/workflow.ts`) also enforce `draft` boundaries on process definitions.

## Execution Flow & User Journey
- **How they reach the screen:** An operator reaches their queues through the `/operations` (Centro Operacional) route or uses the global top bar to access the `/search` surface. Draft entities can be recovered by visiting their respective list views (e.g., `/work-items`).
- **What they do:** Operators can search for existing demands across queues and retrieve any draft they left incomplete by simply filtering tables (e.g., in `/work-items`, selecting the "draft" status filter). They interact with the queues through the operational command board.
- **Where they go next:** From search results or the operations board, they navigate into the detail views (`/work-items/[id]`, `/service-orders/[id]`) to continue progressing the state of the entity.
- **How they return:** Using standard navigation back or UI breadcrumbs, they return to the main dashboard or their personal operational queue.

## Real Data Proof & Blockers
- Real data proof: Operations and search endpoints properly return real seeded or inputted database items across the `queueItems`, `workItems`, and `serviceOrders` tables (e.g. as verified via `getOperationsQueues` in `src/modules/operations/queries.ts` tracking draft/open states). The schemas and repositories for handling drafts natively exist and are active.
- There are no blockers for the underlying persistence schema as it is fully structured to support queueing, search, and drafts.

## Base Configuration
- **Base SHA:** c91929c6cd342a6d1a5923361e069447df7e064c
- **Dependencies:** Unchanged (no new database packages or migrations were needed, satisfying the architectural review).
