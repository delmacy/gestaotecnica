# Evidence: UX-NAV-01-011-sidebar-taxonomy-contract

## Base Environment
- Node.js Version: 24.18.0
- Base Git SHA: a83cc99f04eaa2857a92302e50b0becd8f609def

## Deliverables Completed
- Defined `docs/ui/surfaces/navigation/SIDEBAR_TAXONOMY_CONTRACT.md` detailing the taxonomy, grouping, states, and role/scope rules for the global Sidebar.
- The contract strictly fulfills the acceptance criteria by addressing user flow questions (came from, do here, go next, return) and specifying state outcomes (Empty, Blocked, Demo, Synthetic, Real).
- Ensured language is commercial/product-oriented and abstains from implementation/training vocabulary.
- Confirmed responsive behaviors (fixed desktop vs. off-canvas mobile) and adherence to backend `WorkspaceContext` inventory.

## Pipeline Check
- Run: `npm run check:architecture` and `npm run check:no-explicit-any`
- Types and existing tests remain strictly intact.

## Blockers
- None. Task successfully closed out as a Contract definition.
