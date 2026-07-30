# Product Proof: Approval decision advances real workflow - Permissions, audit, and receipts

## Route/Screen Affected
- **Route:** `/approvals` (Approval Queue page)
- **User Flow:** User accesses the `/approvals` screen -> Sees service orders awaiting review -> Submits an approval or rejection with a note via the forms in `ApprovalForms.tsx` -> Upon success, the form hides and displays a receipt banner with a protocol correlation ID -> Error state displays a red banner if applicable.
- **Return Path:** Handled by standard navigation links on the page.

## Data & Persistence
- **Contracts / Domain:** Uses the `ActionReceipt` type to correctly propagate audit trail information (`correlationId`, `recordedAt`, etc.) back to the UI.
- **API Path:** Updates `src/modules/approvals/actions.ts` to require user authentication via `getCurrentUser()` before executing server actions. Returns standard `ActionReceipt` on successful execution of `runAction("approvals.request" | "approvals.decide")`.
- **Validation:** Added receipt banner handling for the frontend form states in `src/modules/approvals/components/ApprovalForms.tsx`. Avoided any explicit `any` usage.

## Test Validation & Blockers
- **Build / Types:** The TypeScript check and build both successfully compile, indicating no types or `any` regression. Unit test failures seen in the branch were already present in `main`.
- **Blockers:** The worker draft was successfully applied and validates out-of-the-box as per constraints. No additional dependencies or schema changes were required.

