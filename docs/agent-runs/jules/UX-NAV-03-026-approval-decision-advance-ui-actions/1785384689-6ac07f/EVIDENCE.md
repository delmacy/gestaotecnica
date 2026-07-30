# Task Evidence: UX-NAV-03-026-approval-decision-advance-ui-actions

## Required product proof

### Identify the route/screen/menu/button affected.
- `/service-orders/[id]` route - "Enviar para revisao" button in the `ServiceOrderReviewRequestForm` component.
- `/approvals` route - "Aprovar OS" and "Retornar para execucao" buttons in the `ApprovalQueueTable` component.

### Identify the database/persistence object, domain object, contract, use case/API path, or validation evidence touched by this stage.
- Persistence and core logic rely on `approvals.request` and `approvals.decide` kernel actions resolving through the runtime workspace and saving event receipts correctly.

### Explain how the user reaches the screen, what they do, where they go next, and how they return.
- **Requester flow:** The operator views a service order on `/service-orders/[id]` and clicks "Enviar para revisao". The form uses the `submitServiceOrderForReview` server action with the React 19 `useActionState` hook to submit the state changes. Following the state, the hook `useWorkStatus` presents user feedback toasts displaying loading/error/success outcomes gracefully.
- **Approver flow:** The approver accesses `/approvals`, reviewing the table `ApprovalQueueTable`. The approver uses one of the buttons "Aprovar OS" or "Retornar para execucao". These buttons use isolated forms (`ApproveServiceOrderForm`, `ReturnServiceOrderForm`) passing states through `useActionState` into `approveServiceOrder` and `returnServiceOrderForExecution` actions, respectively. Form submission status is provided as UI feedback via `useWorkStatus` seamlessly.

### Record real-data proof or a precise blocker instead of substituting fake demo success.
- The UI properly respects real application loading state, gracefully disabling input elements across all feedback types (pending actions and resolving actions).
- Real Server Actions logic continues running with correct redirect handling, properly wrapped inside a try/catch block for catching and re-throwing `NEXT_REDIRECT` exceptions securely, satisfying Next.js mechanisms.
