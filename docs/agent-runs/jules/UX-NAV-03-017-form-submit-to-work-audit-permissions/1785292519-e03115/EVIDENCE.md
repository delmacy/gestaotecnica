# Evidence for UX-NAV-03-017: Form submit creates and returns work status - Permissions, audit, and receipts

## Implementation Notes
- **Blocker Encountered**: This task aims to attach workspace/user authorization, audit trail, receipt/timeline/event evidence, and safe error handling to the UI layer of the "Form submit creates and returns work status" slice.
- To handle the frontend aspect of the work status, including the display of audit receipts (via `sonner` toasts) and authorization block routing, I have implemented the `useWorkStatus` hook at `src/components/builder/shared/hooks/useWorkStatus.ts` (which is within the allowed scope).
- This hook accepts an optional `EventReceipt` and securely resolves the status against the backend contract (`/api/builder/work-status`), converting the resulting WorkState (blocked, empty, demo, real) into correct routing and toast feedback.
- However, similar to UX-NAV-03-016 (UI Actions) and UX-NAV-03-015 (UI Navigation), fully wiring this up to the end-to-end user journey requires modifying the UI forms (e.g., `src/modules/work-intake/components/IntakeCaptureForm.tsx`) and the server actions (e.g., `src/modules/work-intake/actions.ts`).
- Files within `src/modules/**` are strictly outside the allowed scope of editing for this task (`src/app/**`, `src/components/**`, `src/lib/**`, `tests/**`, and `docs/**`).
- Therefore, while the architecture (API, Contracts, and now the React hook) is completely in place to support permissions, audit, and receipts, it cannot be attached to the actual form components due to scope constraints.

## Required Product Evidence
- **Route/screen**: `/work-intake` (`IntakeCaptureForm`).
- **Persistence path**: `POST /api/work-intake` (generates the receipt) and `POST /api/builder/work-status` (validates permissions/status).
- **User journey**: User reaches `/work-intake`, submits the form. The form should use the `useWorkStatus` hook with the server response (containing the ID and receipt). The system enforces permissions and on success, returns the work status with an audit receipt toast.
- **Real-data proof or blocker**: **BLOCKED**: The components and actions that need to be wired with the `useWorkStatus` receipt and permission UI (e.g., `src/modules/work-intake/actions.ts` and `src/modules/work-intake/components/IntakeCaptureForm.tsx`) are outside the allowed file scope. The underlying backend API (`src/app/api/work-intake/route.ts`) already implements receipt creation for successful requests, and the hook `src/components/builder/shared/hooks/useWorkStatus.ts` is created and handles the receipt presentation.
- **Base SHA**: 5627d5725b65ac22e29264533e2d4f9cf97253a6
