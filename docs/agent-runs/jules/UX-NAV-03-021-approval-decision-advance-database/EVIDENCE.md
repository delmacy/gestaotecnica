# Product Proof: Approval Decision Persistence Foundation

## Route And User Journey

- Route: `/approvals`.
- An operator submits work for review and a manager approves or rejects it from the approval queue.
- This task establishes persistence for that decision. UI and use-case binding remain owned by the adjacent stages.
- Builder-originated validation must begin at `/builder`, retain the selected organization and workspace context, enter the manager or operator destination, and preserve the return path.

## Persistence

- Migration: `drizzle/0027_governance_approval_tables.sql`.
- Schema: `governance`.
- Tables: `approval_policies` and `approval_decisions`.
- Drizzle schema: `src/db/runtime/schema/governance.ts`.
- The schema module is importable by the repository/use-case stage. This task does not modify the shared `src/db/index.ts` database factory because doing so activates unrelated legacy type debt outside this task's allowed scope.

## Real-Data Boundary

The migration creates non-empty PostgreSQL DDL with foreign keys and indexes. This database stage does not claim that `/approvals` already reads or writes these tables; contract, use-case, API, and UI stages must prove those bindings before the complete workflow can be called functional.

## Validation

- `npm run check:no-explicit-any`
- `npx tsc --noEmit`
- focused schema validation through the repository CI gate
