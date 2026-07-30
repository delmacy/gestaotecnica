# Evidence for UX-NAV-03-028-approval-decision-advance-integration-binding

- **Route/screen affected:** `/approvals` (approval queue list component `ApprovalQueueTable`) and `/service-orders/[id]` (review request form component `ServiceOrderReviewRequestForm`).
- **Data path:**
  - Table: `serviceOrders` and `eventLogs` (for receipts).
  - Domain type: `ResolveApprovalDecision` rules.
  - Contract/validation: Kernel action schemas (`requestApprovalKernelAction`, `decideApprovalKernelAction`) parsing `serviceOrderId`, `note`, `decision`.
  - API/use-case: `runAction` inside Next.js Server Actions `submitServiceOrderForReview`, `approveServiceOrder`, `returnServiceOrderForExecution`. (These were missing the `initializePlatformKernel()` step, which we fixed, preventing the UI from experiencing internal Action missing errors).
  - UI component: `ServiceOrderReviewRequestForm`, `ApproveServiceOrderForm`, `ReturnServiceOrderForm`.
- **User flow:**
  - Requester accesses `/service-orders/[id]`, inputs a note, and clicks "Enviar para revisao". The component transitions state through `useActionState`, calling `submitServiceOrderForReview`.
  - Reviewer accesses `/approvals`, views the pending items, inputs a note, and clicks either "Aprovar OS" or "Retornar para execucao". This calls `approveServiceOrder` or `returnServiceOrderForExecution` respectively.
  - Upon success, standard UI feedback (sonner toasts driven by `useWorkStatus`) is presented and Next.js revalidates the cache to show the updated state (e.g. status changes).
- **Real-data proof & Blockers:**
  - The actions now use real kernel action binding via `runAction("approvals.request", ...)` and correctly emit real receipts.
  - **Blocker:** We cannot execute a full E2E Playwright cycle navigating from form submission to success locally in CI because the environment lacks seeded `serviceOrder` data. Consequently, the real-data E2E cycling requires pre-seeded service order data to click through forms. The test asserts the valid empty state and route layouts correctly, documenting this blocker. No synthetic data or fake fallback logic was introduced to bypass this.
