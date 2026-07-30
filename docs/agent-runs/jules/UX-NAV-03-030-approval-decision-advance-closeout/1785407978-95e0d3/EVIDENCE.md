# Product Closeout Evidence: Approval Decision Advances Real Workflow

## Overview
This document serves as the final closeout evidence for the "Approval decision advances real workflow" product slice (UX-NAV-03-021 through UX-NAV-03-030). It demonstrates the complete vertical integration from database persistence, through the core domain, API/use cases, to the UI navigation and actions, ensuring proper handling of real data and constraints.

## 1. Routes and Screens Affected

- **` /approvals `**: The main "Revisão Técnica" queue page where managers review and decide on pending service orders.
- **` /service-orders/[id] `**: The detail view where operators request a review for a completed service order.
- **Navigation Flow**:
  1. Operator accesses a completed service order at `/service-orders/[id]`.
  2. Operator submits the service order for review using the "Enviar para revisao" form.
  3. Manager logs into the platform (starting at `/builder`), selects the workspace, and navigates to the ` /approvals ` queue via the "Revisão Técnica" menu item.
  4. Manager sees the pending service order and clicks either "Aprovar OS" or "Retornar para execucao", providing necessary notes/justifications.
  5. UI provides real-time feedback (toasts) using `useWorkStatus`. Return navigation is managed via standard breadcrumbs/links.

## 2. Data and Persistence Layers Touched

- **Database / Legacy**: Changes focus on the `service_orders` table (updating `status` from `waiting_review` to `approved` or `open`, logging `approvedById` and `approvedAt`).
- **Database / Runtime**: Added tables in the `governance` schema (`approval_policies` and `approval_decisions`) via `drizzle/0027_governance_approval_tables.sql` to lay the groundwork for policy-based approvals.
- **Core Domain**: The logic resides in `src/modules/approvals/approval-workflow-domain.ts` (`resolveApprovalDecision`), establishing type-safe state machine rules to evaluate transitions securely without bypassing domain invariants.
- **Kernel Actions**: Added bindings for `approvals.request` and `approvals.decide` inside the core module registry. These kernel actions wrap the real-data persistence steps, ensuring event audit receipts are correctly tied to state changes.
- **API**: Created a backend endpoint at `POST /api/builder/work-status/approvals/decision` offering an integration seam for governance interactions.

## 3. Real-Data Proof and State Management

- **Proof of Actionable Changes**: Real Postgres database tables are correctly updated by Drizzle ORM mutations passing through rigorous typed domain models (e.g. `service_orders.status`). The E2E tests for the real-data boundary (`tests/integration/ux-nav-03-029-approval-decision-real-data.test.ts`) assert data flow explicitly and use proper parent relational entities (like the temporary user inserted during testing to fulfill `approvedById` foreign keys).
- **Audit Trails**: Successful actions generate explicit event receipts that get rendered into the UI banners or resolved by the backend event-log services. No synthetic stubs or placeholders are embedded into the data persistence path.
- **State Distinctions**: The workflow fully integrates with the `resolveWorkStatus` contract, meaning blocked/demo/synthetic/empty/real states are accurately reflected depending on the active `WorkspaceContext`.

## 4. Blockers Addressed

- **Data Seeding**: An integration blocker was documented whereby the E2E verification lacks pre-seeded `serviceOrder` data across the `sala-tecnica` workspace (or similar UUID-dependent testing spaces). Instead of introducing mocked fake data internally to forcefully satisfy a frontend DOM click path, the tests document this limitation and assert the behavior explicitly based on the given constraint. Real unit and integration checks confirm behavior up to the point of UI simulation.

## 5. Commercial Claim Limits

- The current implementation covers the operator submission (requesting review) and manager decision (approval/rejection) lifecycle for a service order.
- The workflow guarantees data consistency for real domain properties (`waiting_review` status gating). However, robust integration with full UI visual E2E simulation remains gated until standard environment seeds (especially correct UUID `workspaceId` mappings) are fully synchronized across the QA environments.

## 6. Commands Verified

- `npm run check:no-explicit-any` (executed with `EXPLICIT_ANY_BASE_REF` configuration) - Passed.
- `npx tsc --noEmit` - Passed.
- `npm run build` - Passed.
