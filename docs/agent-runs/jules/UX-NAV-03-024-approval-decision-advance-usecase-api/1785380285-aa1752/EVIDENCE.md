# PR Evidence: UX-NAV-03-024-approval-decision-advance-usecase-api

Base SHA: fbbbdb71063b8522b1fc0609450de2f9f7d4c219
Node.js Version: 24.18.1

## Stage Outcome
Use case and API binding implemented. A real API path `POST /api/builder/work-status/approvals/decision` can update the approval decision state without bypassing permissions. This acts as an integration point to connect platform governance to the execution module.

## Required Product Proof

- **Route/screen/menu/button affected**: The UI actions in `/approvals` (handled by `src/modules/approvals/actions.ts` via server actions `approveServiceOrder` and `returnServiceOrderForExecution`) which trigger the `approvals.decide` kernel action. Additionally, if the platform builder needs a direct REST API for governance/work-status integrations, `POST /api/builder/work-status/approvals/decision` handles this via `resolveWorkspaceContext({ source: "integration" })`.
- **Database/persistence object, domain object, contract, use case/API path, or validation evidence touched**:
  - Touched persistence path: `serviceOrders.status` (changed from `waiting_review` to `approved` or `open`).
  - Touched domain object: `resolveApprovalDecision` in `src/modules/approvals/approval-workflow-domain.ts`.
  - Touched API path: `POST /api/builder/work-status/approvals/decision` (new).
- **User Journey**:
  - How they reach the screen: User accesses `/approvals`.
  - What they do: They click "Aprovar OS" or "Retornar para execucao" on a specific Service Order that is waiting for review.
  - Where they go next: They remain on `/approvals` (the queue).
  - How they return: They can use standard navigation links.
- **Real-data proof or precise blocker**:
  The kernel action `approvals.decide` modifies the `serviceOrders` table using real SQL queries and records events with real timestamps and IDs. No mock data is used. The new API endpoint also processes requests using actual domain objects.
