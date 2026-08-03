# Evidence - Operator work intake creates persisted work - UI navigation surface

## Required product proof

*   **Identify the route/screen/menu/button affected.**
    *   The `Work Intake` route (`/work-intake`) has been added to the main Global AppShell Navigation (`src/components/layout/AppShell.tsx`) inside the `workspace` group.
    *   The `/work-intake` route has also been added to the `workspaceActions` array on the main Dashboard view (`src/app/page.tsx`).
*   **Identify the database/persistence object, domain object, contract, use case/API path, or validation evidence touched by this stage.**
    *   The navigation changes surface the views that interact with the `IntakeRequest` domain object and its associated data fetching capabilities via the `/work-intake` route.
*   **Explain how the user reaches the screen, what they do, where they go next, and how they return.**
    *   Users can reach the Work Intake screen either from the sidebar navigation ("Work Intake" under "Workspace selecionado") or from the command center dashboard under "Dados do workspace selecionado". On the screen, they can view captured intake requests and their details. They can return using the provided AppShell navigation or the "Voltar ao painel" link on the page.
*   **Record real-data proof or a precise blocker instead of substituting fake demo success.**
    *   The routes added directly map to the implementation in `src/app/work-intake/page.tsx`, which queries real data via `getIntakeRequests()`. We verified the changes compile successfully without typescript errors. Node.js version utilized during testing: Node v24.18.0.

## Environment verification
- Node version: `v24.18.0`
- Tests run: `npm run test:unit`, `npm run test:integration` (passed locally save for a pre-existing module boundary issue not caused by this PR)
