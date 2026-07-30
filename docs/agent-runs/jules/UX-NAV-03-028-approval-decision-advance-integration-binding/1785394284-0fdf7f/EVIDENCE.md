# UX-NAV-03-028-approval-decision-advance-integration-binding

## Base Branch
Base SHA: ad926452a67bb3a6e682808515a8aa38859409ed

## Node Environment
Node.js 24.x was successfully verified and used for validation:
`node --version`: v24.18.1

## Product Proof

- **Route/Screen Affected**: `/approvals` -> "Revisão Técnica" -> queue with approve/reject actions
- **Persistence Touched**: `service_orders` table via `getApprovalQueue` and `getApprovalSummary` in `src/modules/approvals/queries.ts`.
- **Domain/Contract/Validation**: `ApprovalQueueItemSchema`, `ApprovalSummaryItemSchema`, and `ApprovalDecisionInputSchema` are used for contract validation. Dead DTOs like `ApprovalQueueViewStateSchema` that represented unbundled synthetic/demo fallback have been removed to eliminate hidden paths.
- **User Journey**: The user reaches the screen via Dashboard -> "Revisão Técnica". They can view a queue of completed service orders. The user clicks approve/reject actions which perform real DB updates and event emissions via `resolveApprovalDecision()`. They can return to the dashboard by clicking "Voltar ao painel".
- **Real-Data Proof**: The queue uses live real DB data queried directly; no synthetic/mock data fallbacks are used. Empty, blocked, demo, and real-data states remain distinct but are served from the actual backend response, dropping orphaned UI fallback contracts.
