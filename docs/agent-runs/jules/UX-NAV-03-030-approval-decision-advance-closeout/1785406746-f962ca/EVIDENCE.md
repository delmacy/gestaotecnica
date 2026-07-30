# UX-NAV-03-030-approval-decision-advance-closeout - Approval decision advances real workflow - Product closeout evidence

## Required product proof

### Identify the route/screen/menu/button affected.
- **Requester Flow Routes:** `/service-orders/[id]` -> "Enviar para revisao" button in `ServiceOrderReviewRequestForm`.
- **Approver Flow Routes:** `/approvals` page (accessed via `Revisão Técnica` menu item in the app shell sidebar) -> "Aprovar OS" and "Retornar para execucao" buttons in `ApprovalQueueTable`.

### Identify the database/persistence object, domain object, contract, use case/API path, or validation evidence touched by this stage.
- **Database/Persistence Objects:** `service_orders` table (fields `status`, `approvedAt`, `approvedById`) in legacy schema. `users` table for relationship integrity. `event_logs` for status resolution audits.
- **Domain Objects:** `ApprovalQueueItemSchema`, `ApprovalSummaryItemSchema`, and domain state-machine resolver `resolveApprovalDecision` (`src/modules/approvals/approval-workflow-domain.ts`).
- **Contracts:** Kernel actions (`approvals.request` and `approvals.decide`) resolved via workspace runtime context. `WorkStatusResolution` contract managing feedback transitions for the forms via `useWorkStatus`.
- **Validation Evidence:** Tested robustly end-to-end (`tests/integration/ux-nav-03-029-approval-decision-real-data.test.ts`), confirming that real data insertions and transitions honor database relations (foreign keys to users/workspaces) instead of using mocked state.

### Explain how the user reaches the screen, what they do, where they go next, and how they return.
1. **Requester Setup:** An operator accesses a specific service order on `/service-orders/[id]`. They click the "Enviar para revisao" button to update the state to `waiting_review`.
2. **Approver Navigation:** An approver logs into the workspace dashboard. In the left sidebar or the "Dados do workspace selecionado" block, they click the `Revisão Técnica` link, arriving at `/approvals`.
3. **Approver Actions:** On `/approvals`, the user views the queue. For a specific row, they click "Aprovar OS" or "Retornar para execucao".
4. **Processing & Feedback:** The form submission hits a React 19 `useActionState` which runs the backend server action (e.g. `approveServiceOrder`), persisting the update in the database via kernel actions, and returning an updated status object. The `useWorkStatus` hook on the frontend triggers a success/loading/error toast. The UI handles disabling buttons gracefully during processing.
5. **Return Path:** Once processed (or if backing out), the user can return to the dashboard using the `Command Center` link on the sidebar, or via the `Voltar ao painel` breadcrumb.

### Record real-data proof or a precise blocker instead of substituting fake demo success.
- Real Postgres persistence has been validated via full-stack integration and end-to-end checks where real user objects are created to satisfy Drizzle ORM foreign key `approvedById` requirements on the `service_orders` updates.
- Work status resolutions cleanly distinguish states (`empty`, `blocked`, `demo`, `synthetic`, `real`) per the core `resolveWorkStatus` contract logic (which correctly restricts data visibility according to workspace and user roles), generating real execution event audit trails via `event_logs` when successful.
- Real Server Action logic properly manages Next.js `NEXT_REDIRECT` exceptions rather than bypassing them.

## Contextual Environment Details
- **Base Branch SHA:** ffe74c14fb83b390ae041fd386231b177cad13fe
- **Node.js Version:** v24.18.1
