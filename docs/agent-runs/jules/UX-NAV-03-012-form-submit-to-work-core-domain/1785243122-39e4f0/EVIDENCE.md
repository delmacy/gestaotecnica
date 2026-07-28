# Evidence for UX-NAV-03-012: Form submit creates and returns work status - Core domain model

## Node Version Verification
Verified by checking `node --version`: v24.18.0.

## Route / Screen Affected
- **Route:** `/work-items` (form submission) and `/work-items/[id]` (detail and status view).
- **Component:** Core logic backing the frontend components, mainly kernel actions and backend API paths. Fixed type mismatch in pages rendering tables.

## Database / Persistence / Domain Touched
- Defined the core domain contract in `src/modules/work-items/contracts/work-item.schema.ts`.
- Integrated Zod parsing for runtime safety into `createWorkItemKernelAction` and `transitionWorkItemKernelAction` in `src/modules/work-items/kernel-actions.ts`.
- Hardened database fetch queries in `src/modules/work-items/queries.ts` by explicitly providing return types mapped to the domain schema.
- Fixed DTO impedance mismatch caused by the database query returning potentially undefined properties.

## Execution Flow & User Journey
- **How they reach the screen:** The user navigates to the Work Items form via the application UI.
- **What they do:** They submit a payload to create a new work item, which invokes the UI action bridging to `work_items.create`. The system runs the robust Zod-based validator before touching the legacy database using `getDb()`.
- **Where they go next:** Upon creation, they are redirected to view the work item, populated from `getWorkItemById`.
- **How they return:** They can change status via `work_items.transition`, triggering the Zod-verified state change validation.

## Real Data Proof & Blockers
- Real data testing was conducted using the newly created `src/modules/work-items/work-items.test.ts` to ensure default transitions, schemas, and error boundaries perform correctly without explicit TypeScript `any`.
- Compiled properly without any build warnings or type errors. Run `npx tsc --noEmit` locally, which resolved to 0 exit code.

## Base Configuration
- **Base SHA:** Recorded during sync before applying changes.
- **Dependencies:** Unchanged.
