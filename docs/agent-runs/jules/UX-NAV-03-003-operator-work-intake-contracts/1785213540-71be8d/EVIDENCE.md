# Evidence

## Required product proof:
- **Identify the route/screen/menu/button affected**: The UI pages `/work-intake` and `/work-intake/[id]` which show the intake form, table, and details screens. We updated `src/app/work-intake/page.tsx`, `src/app/work-intake/[id]/page.tsx`, and `src/modules/work-intake/components/IntakeDetail.tsx`.
- **Identify the database/persistence object, domain object, contract, use case/API path, or validation evidence touched by this stage**: The Intake contracts at `src/modules/work-intake/contracts/intake.schema.ts`. We ensured these contracts are strictly typed and used in the UI views without relying on `any`.
- **Explain how the user reaches the screen, what they do, where they go next, and how they return**:
    1. An operator visits the `/work-intake` route.
    2. They capture an intake request via the form on the side.
    3. They are redirected to `/work-intake/[id]` where they see the details.
    4. They can transition the request's status from the detail view, or return to the list view via the "Voltar para lista" link.
- **Record real-data proof or a precise blocker instead of substituting fake demo success**: The app correctly uses the Drizzle DB via `queries.ts` (mapped to `processCandidates` schema). By removing `any` casts in the pages and using the actual types `IntakeRequest` and `IntakeHistoryEvent` from `intake.schema.ts`, we've solidified the contract between the persisted domain models and the React views, avoiding synthetic data labeling. The creation DTOs (`CreateIntakeInput` and `TransitionIntakeInput`) already exist in `src/modules/work-intake/contracts/intake.schema.ts` and are consumed by `captureIntakeKernelAction` at `kernel-actions.ts`. The full contract surface (read + write) is covered between the prior and current PRs.

## Node.js version output:
Node version: v24.18.0
