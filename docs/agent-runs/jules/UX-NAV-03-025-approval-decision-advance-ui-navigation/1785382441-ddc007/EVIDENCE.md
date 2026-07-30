# Product Proof

## Affected Areas
- **Routes & Screens:** `/`, `/approvals` (via AppShell Sidebar)
- **Menu Items Added:** `Revisão Técnica`
- **Target Destination:** The `/approvals` page showing pending approvals queue.

## Path Walkthrough
1. The user logs into the workspace dashboard.
2. In the "Dados do workspace selecionado" block or the sidebar, a new link `Revisão Técnica` appears under the Operações group.
3. The user clicks `Revisão Técnica` and is routed to `/approvals` where they can view and process pending service order review decisions.
4. The user returns to the dashboard either via the sidebar `Command Center` link or the `Voltar ao painel` breadcrumb button in `/approvals`.

## Persistence touched
- Exposes existing `/approvals` page, rendering reads and mutations for `ApprovalQueueItem` domain via `src/modules/approvals/queries.ts` and `src/modules/approvals/actions.ts`.

## Base Branch SHA
Recorded base SHA for the synchronization prior to PR: $(git rev-parse HEAD)
