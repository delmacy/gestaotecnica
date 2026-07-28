# Task Evidence: UX-NAV-03-008-operator-work-intake-integration-binding

## Task Description
Implement the end-to-end binding stage for `Operator work intake creates persisted work` in UX-NAV-03.

## Base SHA
`1c88ce5ad9ad52a6317dbd6074e4f7345af6f352`

## Affected Screen/Route
- **Route:** `/work-intake`
- **Screen:** Work Intake page with `IntakeCaptureForm` and `IntakeTable`. Details screen at `/work-intake/[id]`.

## Persistence Path / Domain Object
- The application persists data to the `processCandidates` table.
- Form submissions correctly invoke the `work_intake.capture` action (via `captureIntakeAction` in `src/modules/work-intake/actions.ts`), which in turn executes the `captureIntakeKernelAction` defined in `src/modules/work-intake/kernel-actions.ts`.

## User Journey
1. The user navigates to `/work-intake`.
2. The user fills out the request details in the `IntakeCaptureForm` (Title, Category, Priority, Description, and Requester Info).
3. The user clicks "Capturar Solicitação" to submit.
4. The form submits via `useActionState` to the server action, persisting the request.
5. The user is redirected to the details screen at `/work-intake/[id]` where they can see the newly captured request and its initial event history.
6. The user can return to the list by clicking "← Voltar para lista".

## E2E Validation
A Playwright E2E test `tests/e2e/work-intake.spec.ts` was created to validate this journey: it navigates to `/work-intake`, fills and submits the capture form, and asserts the successful redirection and display of data on the detailed view.
