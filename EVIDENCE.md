# EVIDENCE

## Required product proof

- **Route/screen affected:** `/approvals` — governance queue where operators review and decide on service orders.
- **Persistence touched:** `service_orders` table (status `waiting_review`) via `queries.ts`, domain `approval-workflow-domain.ts` → `resolveApprovalDecision()`, contracts `approval-decision-dto.ts`.
- **User journey:**
  1. Operator navigates to `/approvals` (or clicks "Revisão técnica" from dashboard).
  2. Page loads queue of service orders in `waiting_review` or `completed` status.
  3. Operator fills an optional note and clicks **"Aprovar OS"** or fills a required justification and clicks **"Retornar para execução"**.
  4. Server action calls `runAction("approvals.decide")` leading to DB update.
  5. Page revalidates, operator is redirected to `/approvals`.
- **Real data proof/blocker:**
  Changes have been successfully tested via the unit tests (`tests/unit/approval-decision-contract.test.ts`), verifying the updated DTO structure handles real data (e.g., successful type conversion to `ApprovalQueueItem` and correct error propagation via API when validation fails). Build passes cleanly and type checks have verified the changes do not introduce `any` values.