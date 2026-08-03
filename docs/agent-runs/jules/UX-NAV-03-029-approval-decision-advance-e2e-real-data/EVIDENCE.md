# Real-data journey validation for approval decision

## Overview
This task finalizes the integration test for the approval decision workflow, ensuring that the entire slice (from database to domain to API boundary) works correctly with real persisted data and honors foreign key constraints.

## Route / Screen Affected
- **Path:** `/approvals`
- **Impact:** Verifies the data source for the "Revisão Técnica" queue table and the "Em revisão" summary card when driven by real database persistence, instead of mocked states.

## Database / Domain Object Touched
- **Table:** `service_orders` (Specifically the `status`, `approvedAt`, and `approvedById` fields).
- **Table:** `users` (A temporary real user record is created to satisfy the `approvedById` foreign key).
- **Domain:** `resolveApprovalDecision` inside `src/modules/approvals/approval-workflow-domain.ts`.
- **Contracts:** `ApprovalQueueItemSchema` and `ApprovalSummaryItemSchema`.

## Journey Flow
1. **Setup:** A new `users` record is created, followed by a new `service_orders` record set to `waiting_review`.
2. **Read Path:** The `/approvals` UI logic (`getApprovalQueue`, `getApprovalSummary`) is confirmed to successfully read this inserted order, proving the "Em revisão" state.
3. **Domain Evaluation:** `resolveApprovalDecision` ensures valid states, applies the correct timestamps and actor references depending on the `approve` or `reject` decision, and restricts unauthorized modifications.
4. **Persistence:** The database correctly saves the `approved` status and links the `approvedById` to the dynamically created user, confirming that the real relationship holds in Postgres.
5. **Outcome:** Upon persistence, the service order is verified to be removed from the active queue.

## Real-data Proof / Blockers
- **Proof:** The test (`tests/integration/ux-nav-03-029-approval-decision-real-data.test.ts`) inserts an actual row in a real PostgreSQL runtime database.
- We specifically overcame a foreign-key blocker (where an arbitrary UUID `"approver-e2e-029"` failed to persist) by writing a proper teardown lifecycle (`db.insert(users)` and `db.delete(users)`).
- We also validated using the strict explicit-any checker (`npm run check:no-explicit-any`).
- No synthetic stubs were used for the underlying Drizzle queries.
