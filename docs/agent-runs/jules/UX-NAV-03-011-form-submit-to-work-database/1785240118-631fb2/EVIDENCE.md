# Evidence for UX-NAV-03-011: Form submit creates and returns work status - Database/persistence foundation

## Node Version Verification
Verified by checking `node --version`: v24.18.0.

## Route / Screen Affected
- **Route:** `/work-items` (form submission) and `/work-items/[id]` (detail and status view).
- **Component:** `WorkItemForm` within `src/modules/work-items/work-item-form.tsx` and the listing table.

## Database / Persistence / Domain Touched
- Validated the existing `work_items` table in `src/db/legacy/schema.ts` which provides the necessary fields: `title`, `description`, `type`, `status`, and `priority`.
- No new Drizzle migration was needed as the table schema natively supports the product feature requirements for saving and transitioning operational demands.
- Created `src/db/seeds/work-items/seed.ts` and `src/db/seeds/work-items/clean.ts` to implement the required seed/read fixtures, bounding the persistent records, and validating configurations. The data is real-world commercial (e.g. "Equipamento de TI Falho").

## Execution Flow & User Journey
- **How they reach the screen:** The user arrives at the Work Items list view by navigating from the Dashboard or Sidebar.
- **What they do:** They fill out the form using the `WorkItemForm` and submit it to capture an operational need prior to evaluating if it requires a Service Order.
- **Where they go next:** Upon successful insertion (via the `work_items.create` kernel action), they are redirected to the specific work item view (`/work-items/[id]`) to view its status.
- **How they return:** They can change the status using the `WorkItemStatusForm` and return to the main list.

## Real Data Proof & Blockers
- Real data (seeded via scripts) proves the persistence foundation is active by binding rows to a dedicated Workspace and Organization.
- Synthetic and demo rows remain distinct through explicit identifiers.
- The `work_items` database operations perform safely. E2E validations are subject to the project's standard environment parameters constraints without faking local success.

## Base Configuration
- **Base SHA:** 3ae4dd91129b8705f42df114dbb1088c4b7b2afb
- **Dependencies:** Unchanged (strict bounding rule applied; no packages installed).
