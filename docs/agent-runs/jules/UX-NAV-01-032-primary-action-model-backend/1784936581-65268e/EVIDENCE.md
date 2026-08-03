# Execution Evidence: UX-NAV-01-032-primary-action-model-backend

## Task Context
Task: UX-NAV-01-032-primary-action-model-backend: Primary action and next-step model - Backend/data binding

## Pre-flight Checks
- Node.js Version: `v24.18.0` (switched via nvm)
- Base Git SHA: `git rev-parse HEAD` -> `87b928387e190734e15284b372041e61377783ec`

## Implementation Strategy
Implemented the backend contract for resolving primary actions according to the `docs/ui/surfaces/navigation/PRIMARY_ACTION_MODEL_CONTRACT.md`.
Created:
- `src/platform/builder/contracts/primary-action/primary-action-contract.ts` - Zod schema defining the action state, intent, and context.
- `src/platform/builder/contracts/primary-action/resolve-primary-action.ts` - Resolves the primary action state, label, and next route based on WorkspaceContext and moduleKey. Included logic for Demo, Synthetic, and Blocked states.
- Re-exported these through `src/platform/builder/contracts/index.ts`.
- Implemented node:test coverage at `tests/platform/builder/primary-action.test.ts`.

## Testing
- Automated backend unit tests successfully passed (`npx tsx --test tests/platform/builder/primary-action.test.ts`).
- Typechecking with TypeScript verified no `any` introductions.

## Acceptance Criteria Answers
- **Where the user came from, what they do here, where they go next, and how they return**: Handled by generating deterministic `href` values and strict state ("active", "blocked", "hidden") indicating the core action based on the module context.
- **Empty, blocked, demo, synthetic, and real-data states have distinct user-facing outcomes**: Resolution logic returns distinct states (e.g. state = "blocked" with tooltip for disabled modules or demo restrictions).
- **User-facing language is commercial/product oriented**: e.g. "Define Capability", "Start Analysis", "Log New Task".
