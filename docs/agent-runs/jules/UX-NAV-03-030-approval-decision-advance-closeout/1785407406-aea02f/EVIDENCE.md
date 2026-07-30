# Evidence for UX-NAV-03-030: Approval decision advances real workflow - Product closeout evidence

## Base Configuration
- **Base SHA:** a09a11c4ee9e99bc62eb5f1fb3c7c54d002f78ac
- **Node Version:** v24.18.1

## Product Closeout Summary
This stage completes the "Approval decision advances real workflow" full-stack slice by documenting the real user journey, affected components, and proven persistence layer functionality. This vertical slice proves that the product changed the user experience, connected the core platform capabilities, and correctly modified the operational data layer instead of functioning solely as isolated internal code.

## Affected Routes and Views
- **`/approvals`:** The "Revisão Técnica" view accessed from the global dashboard or the AppShell sidebar where operators can review the pending queue (ApprovalQueueTable component).
- **`/service-orders/[id]`:** The detailed view for an individual service order, specifically interacting with the `ServiceOrderReviewRequestForm` component to initiate a state advance.

## Data, Domain, and API Paths
- **Persistence Object:** The legacy `serviceOrders` table (`status`, `approvedAt`, `approvedById` fields).
- **Domain Object:** `resolveApprovalDecision` inside `src/modules/approvals/approval-workflow-domain.ts` and contracts like `ApprovalQueueItemSchema` / `ApprovalSummaryItemSchema`.
- **Use Case / API Path:** The `/approvals` UI utilizes Server Actions (`approveServiceOrder`, `returnServiceOrderForExecution`) which trigger the `approvals.decide` platform kernel action. A direct integration REST API `POST /api/builder/work-status/approvals/decision` is also bound.

## User Journey
- **How they reach the screen:** An operator views a service order at `/service-orders/[id]`. To request review, they click the "Enviar para revisao" button in the review form. Approvers reach their workspace by logging into the dashboard and navigating via the AppShell sidebar to "Revisão Técnica" (the `/approvals` route).
- **What they do:** At `/approvals`, the approver views the table `ApprovalQueueTable` of items in the "waiting_review" state. They decide the outcome by clicking either the "Aprovar OS" or "Retornar para execucao" buttons.
- **Where they go next:** Upon executing a decision, the user stays on the `/approvals` route, experiencing real-time Next.js state resolution via the `useWorkStatus` feedback hook (displaying toasts and updating row status). The reviewed service order is removed from the active queue.
- **How they return:** They return to the main dashboard or other modules via the standard global AppShell sidebar links or by using the breadcrumb "Voltar ao painel".

## Real-data Proof
- The end-to-end functionality was verified with real persistence in `tests/integration/ux-nav-03-029-approval-decision-real-data.test.ts`.
- The test proves the correct read path mapping and mutation path execution for the slice. A temporary, dynamic `users` record was specifically created in the test suite to satisfy the real foreign key constraint on `approvedById` inside the Postgres `serviceOrders` table, ensuring no mock stubs or artificial data were used.
- The `status` on `service_orders` was confirmed to be securely updated from `waiting_review` to `approved` via domain logic that protects the database layer from out-of-band manipulation.
- All actions run through the platform workspace context and respect Drizzle DTO bindings cleanly.