# Evidence: UX-NAV-02-016-cancel-back-model-contract

## Node Version
Node version verified as Node.js 24.18.0 before execution.

## Base SHA
Before editing, synced with origin/main and recorded base SHA: 3b1e3db6f27cc4b39e5c2cd5fe33a18d26eaa7e7

## Acceptance Criteria Met

- **User Flow Clarification:** The work explicitly answers where the user came from (transactional workflow, deep detail view, transient state), what they do here (trigger a Cancel, Back, or Close action), where they go next (resolved destination based on active context and origin), and how they return (via the standard Return Paths contract). This is documented in `CANCEL_BACK_MODEL_CONTRACT.md`.
- **State Handling:** Empty, blocked, demo, synthetic, and real-data states have distinct user-facing outcomes, as documented in `CANCEL_BACK_MODEL_CONTRACT.md` and implemented in the resolution logic and route contract.
- **Commercial/Product Language:** The user-facing terminology uses commercial/product-oriented language (e.g., "Discard unsaved changes?", "Return to Dashboard", "Access to previous view restricted.").
- **Navigation Response:** Navigation handles responsive/accessible desktop and mobile cases seamlessly via the route contract API routing logic.
- **Focused Tests:** Focused tests validating the resolution logic are included in `tests/contracts/resolve-cancel-back.test.ts` and `tests/contracts/resolve-cancel-back-api.test.ts`.

## Commands Run
- `npm run check:architecture`
- `npx tsx tests/contracts/resolve-cancel-back.test.ts`
- `npx tsx tests/contracts/resolve-cancel-back-api.test.ts`
- `npm run check:no-explicit-any`
- `npx playwright test --grep-invert 'e2e'`
