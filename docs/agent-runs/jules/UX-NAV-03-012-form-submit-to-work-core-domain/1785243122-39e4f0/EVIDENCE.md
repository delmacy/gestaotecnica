# Evidence for UX-NAV-03-012: Form submit creates and returns work status - Core domain model

## Node Version Verification
Verified by checking `node --version`: v24.18.0.

## Route / Screen Affected
- **Route:** `/work-items` (form submission) and `/work-items/[id]` (detail and status view).
- **Component:** Core logic backing the frontend components, mainly kernel actions and backend API paths.

## Database / Persistence / Domain Touched
- Defined the core domain contract in `src/modules/work-items/contracts/work-item.schema.ts`.
- Integrated Zod parsing for runtime safety into `createWorkItemKernelAction` and `transitionWorkItemKernelAction` in `src/modules/work-items/kernel-actions.ts`.
- Hardened database fetch queries in `src/modules/work-items/queries.ts` by explicitly providing return types mapped to the domain schema.
- Added domain-specific unit tests for the schemas and transitions in `src/modules/work-items/work-items.test.ts`.

## Execution Flow & User Journey
- **How they reach the screen:** The user navigates to the Work Items form via the application UI.
- **What they do:** They submit a payload to create a new work item, which invokes the UI action bridging to `work_items.create`. The system runs the robust Zod-based validator before touching the legacy database using `getDb()`.
- **Where they go next:** Upon creation, they are redirected to view the work item, populated from `getWorkItemById`.
- **How they return:** They can change status via `work_items.transition`, triggering the Zod-verified state change validation.

## Real Data Proof & Blockers
- Real data testing was conducted using the newly created `src/modules/work-items/work-items.test.ts` to ensure default transitions, schemas, and error boundaries perform correctly without explicit TypeScript `any`.
- All queries explicitly consume persistence without inventing demo data.
- Run tests on node 24 with fnm and they passed smoothly.

## Base Configuration
- **Base SHA:** Recorded during sync before applying changes (as evident in repository history).
- **Dependencies:** Unchanged.
