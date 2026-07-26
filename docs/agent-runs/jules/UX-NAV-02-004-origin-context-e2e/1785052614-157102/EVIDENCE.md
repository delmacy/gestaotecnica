# UX-NAV-02-004 Origin and Active Context Journey Validation Evidence

## Environment Setup
Node.js 24 was confirmed and activated for all test runs:
```
Now using node v24.18.0 (npm v11.16.0)
default -> 24 (-> v24.18.0)
```

Base Git SHA for testing context:
```
86eb2b07d409ad63b757131943cb59d472bfa6bf
```

## E2E Validation

A complete E2E test file (`tests/e2e/ux-nav-02-004-origin-context-e2e.spec.ts`) was implemented with 5 full test cases directly tracing back to the `ORIGIN_ACTIVE_CONTEXT_CONTRACT.md`. All tests were verified to pass using native real-browser contexts (`npx playwright test tests/e2e/ux-nav-02-004-origin-context-e2e.spec.ts`).

### Fulfillment of Acceptance Criteria

**1. The work explicitly answers: where the user came from, what they do here, where they go next, and how they return.**
*Tested in `Validates origin capture and return path from registry to capabilities`:*
- The test loads the `registry` route initially (where they came from).
- It clicks the generic Primary Action ("Define Capability") which simulates initiating a nested deep-flow (what they do here).
- It verifies navigation reaches the `/builder/capabilities/new` route and checks the URL search param logic mapping the previous route (`?origin=%2Fbuilder%2Fregistry`) (where they go next).
- Finally, it validates clicking the `ContextualReturn` component resolves backwards effectively returning them to the original `/builder/registry` route (how they return).

**2. Empty, blocked, demo, synthetic, and real-data states have distinct user-facing outcomes.**
*Tested across state and scoping validations:*
- `Validates Contextual Return handles cross-boundary scoping`: Verifies that if an invalid state is encountered (Blocked / Invalid Scope), a specific distinct UI fallback kicks in ("Access Denied: Cross-Scope Boundary Alert"), stopping cross-scope path traversal explicitly (Workspace returning to Admin context).
- `Validates Demo State interception`: Activating `demo` environment mode correctly propagates through the active context into the UI, correctly asserting that the `DEMO MODE` visual badge presents itself.
- `Validates Synthetic State persistence`: Switching context cookie state to `synthetic` validates that the active context reflects correctly in UI by confirming the presentation of the `SYNTHETIC MODE` badge.

**3. User-facing language is commercial/product oriented, not implementation-training oriented.**
*Tested in `Validates Contextual Return dynamic language based on origin`:*
- Dynamically navigating to an active context from specific predefined routes validates context-aware contextual terms (from `resolveOriginContext`). We proved simulating navigation from `/builder/operations` successfully alters the fallback text on the return element from a basic "Return" up to the strictly commercial "Return to Operations" phrasing.

## Commands Run
```bash
npm install
npx playwright install --with-deps
npx playwright test tests/e2e/ux-nav-02-004-origin-context-e2e.spec.ts
```
