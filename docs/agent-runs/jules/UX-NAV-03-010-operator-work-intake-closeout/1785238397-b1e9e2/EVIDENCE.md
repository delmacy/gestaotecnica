# Evidence - Operator work intake creates persisted work - Product closeout

## Affected Routes and Views
- The `Work Intake` route (`/work-intake`) is accessible from the main Global AppShell Navigation (`src/components/layout/AppShell.tsx`) inside the `workspace` group.
- The route is also available in the `workspaceActions` array on the main Dashboard view (`src/app/page.tsx`).
- The details for an individual intake request are viewable at `/work-intake/[id]`.

## Data, Domain, and API Paths
- **Persistence Object:** `builder.process_candidates` table.
- **Domain Object:** `IntakeRequest`.
- **Use Case / API Path:** `POST /api/work-intake` handling the `work_intake.capture` action, and `GET /api/work-intake` fetching captured data.

## User Journey
- **How they reach the screen:** Users navigate to the Work Intake list either via the sidebar navigation ("Work Intake" under "Workspace selecionado") or via the command center dashboard under "Dados do workspace selecionado".
- **What they do:** Users can view a list of captured intake requests on the list view. From there, they can click on an individual request to see its properties and history.
- **Where they go next:** From the list, they proceed to `/work-intake/[id]` to view details.
- **How they return:** They can return to the main application using the Global AppShell navigation elements, or use the "Voltar ao painel" link on the `/work-intake` screen.

## Blocker Report (Real-data Constraints)
The real-data journey validation cannot proceed end-to-end (specifically for form submissions and transitions) due to missing registrations in the platform kernel and missing initialization in the Server Action context, both of which are outside the allowed scope of this full-stack slice task.

Specifically:
1. `initializePlatformKernel()` in `src/platform/kernel.ts` does not register the work-intake module (`workIntakeManifest`) nor its actions (`captureIntakeKernelAction`, `transitionIntakeKernelAction`).
2. The Server Action file `src/modules/work-intake/actions.ts` does not call `initializePlatformKernel()`, and there is no boot hook (`instrumentation.ts` or `middleware.ts`) to initialize the kernel for Server Actions.
3. Both `src/platform/` and `src/modules/` are outside the allowed scope for this particular UX navigation integration stage.

Without registration in `kernel.ts` or manual initialization and registration in the Server Action bundle, the `work_intake.capture` action cannot resolve. The reads via `getIntakeRequests` (using `drizzle-orm`) are functionally correct and typesafe, but creating new records through the UI actions is blocked.

## Base Configuration
- **Base SHA:** 06ca88726a67c4274ceae8f4a955a1c877f096b5
- **Node Version:** v24.18.0
