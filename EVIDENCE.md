# Product Proof: Approval decision advances real workflow - Database/persistence foundation

## 1. Route/Screen/Menu/Button Affected
- **Route:** `/approvals` (Operator submits OS for review via `approvals.request`, manager approves/rejects via `approvals.decide`).
- **Context:** While the read queries (`getApprovalQueue`, `getApprovalSummary`) still temporarily point to the legacy `service_orders` structure in this stage, this persistence foundation prepares for rewiring the UI to consume `approval_decisions` and provide real data in the next stage.

## 2. Persistence Object and Domain
- **Database schema:** `governance` schema (created via `drizzle/0027_governance_approval_tables.sql`).
- **Tables:** `approval_policies` and `approval_decisions` tables created, tracking the exact structure required by the `ApprovalDecision` contract. They are properly registered in `src/db/runtime/schema/governance.ts`.
- **Integration:** Registered `governanceSchema` into the unified `fullSchema` in `src/db/index.ts`. No `any` types were used or added.

## 3. User Journey (Through-line)
1. **Reach the screen:** User (Operator) submits a work item for review, redirecting or updating the state for a Manager.
2. **Action:** The Manager reviews the submission on the `/approvals` screen and clicks "Approve" or "Reject" (`approvals.decide`).
3. **Next Steps:** The system validates the action against `approval_policies` and records the result in the newly created `approval_decisions` table.
4. **Return:** After the decision is persisted, the UI will reflect the updated workflow state (e.g., advancing the work status) and the user returns to their task queue.

## 4. Real-data Proof / Blocker
- **Database Migrations:** The `drizzle/0027_governance_approval_tables.sql` successfully establishes the `governance` schema, tables, and correct foreign keys / indexes in PostgreSQL.
- **Node.js Environment:** Used `v24.18.1` for all validation commands.
- **Code Quality:** `npm run check:no-explicit-any` successfully passes on the changed files (using `EXPLICIT_ANY_BASE_REF`). Build and typechecks pass as well.
