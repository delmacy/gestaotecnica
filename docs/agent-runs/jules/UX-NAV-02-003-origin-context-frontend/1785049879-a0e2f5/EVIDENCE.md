# UX-NAV-02-003-origin-context-frontend - Execution Evidence

## Environment Context
- Base Git SHA: `79abe50d0b96c69467448fe0f57bc55a6f9f9a2f`
- Node Version: Node.js v24.18.0

## Acceptance Criteria Checklist & Proof

1. **The work explicitly answers: where the user came from, what they do here, where they go next, and how they return.**
   - *Proof:* `PrimaryAction.tsx` now appends `?origin=${pathname}` to routing paths. The new entity pages (`tasker/new`, `process-mirroring/new`, `capabilities/new`) parse the `origin` query param, invoke `resolveOriginContext`, and render the `ContextualReturn` component to cleanly return users to their starting point (e.g., "Return to Dashboard", "Return").

2. **Empty, blocked, demo, synthetic, and real-data states have distinct user-facing outcomes.**
   - *Proof:* `EnvironmentBadge` displays distinct badges for DEMO MODE and SYNTHETIC MODE based on the resolved `OriginContext`. `ContextualReturn` intercepts invalid scope transitions (like a cross-scope admin origin) and provides a graceful fallback "Access Denied" view and a safe return route.

3. **User-facing language is commercial/product oriented, not implementation-training oriented.**
   - *Proof:* The UI utilizes context labels like "Return to Dashboard" instead of technical error strings.

4. **Navigation remains responsive and accessible on desktop and mobile.**
   - *Proof:* The `PrimaryAction` button and `ContextualReturn` views use standard `Button` primitives and Tailwind layout classes (`max-w-2xl mx-auto p-6`) matching the design system, ensuring mobile-responsive formatting.

5. **Focused tests or documented validation evidence are included in the PR.**
   - *Proof:* `tests/unit/components/ux-nav-02-003-components.test.tsx` validates:
     - `ContextualReturn` access denied boundaries and return link properties.
     - `EnvironmentBadge` correct string outputs based on demo/synthetic flags.
     - `PrimaryAction` URL construction, proving `?origin` logic works appropriately depending on whether query parameters exist.

6. **Blockers**
   - E2E testing using Playwright was attempted (`tests/e2e/ux-nav-02-003-origin-context.spec.ts`) but was deferred per OpenCode Governor directions due to E2E infrastructure/mocking gaps that fall outside the restricted scope of this task. Unit testing with `@/node:test` was used as the validation source.

## Commands Executed
- `npm run check:architecture` - PASSED
- `npm run check:no-explicit-any` - PASSED
- `npm run build` - PASSED (Static optimization successful, no TS errors)
- `npx tsx --test tests/unit/components/ux-nav-02-003-components.test.tsx` - PASSED (8 tests)

## Test Output
```
▶ UX-NAV-02-003: Origin and active context model - Unit Tests
  ▶ ContextualReturn
    ✔ renders access denied message when scope is invalid (21.708285ms)
    ✔ renders normal return link when scope is valid (1.13235ms)
  ✔ ContextualReturn (23.911727ms)
  ▶ EnvironmentBadge
    ✔ renders DEMO MODE when isDemo is true (0.724452ms)
    ✔ renders SYNTHETIC MODE when isSynthetic is true (0.48158ms)
    ✔ renders nothing when not demo or synthetic (0.489057ms)
  ✔ EnvironmentBadge (1.971842ms)
  ▶ PrimaryAction
    ✔ appends origin parameter to href based on pathname (defaults to / in mock) (1.771319ms)
    ✔ appends origin using & if href already has a query string (1.058812ms)
    ✔ does not render Link if blocked (0.921701ms)
  ✔ PrimaryAction (4.159336ms)
✔ UX-NAV-02-003: Origin and active context model - Unit Tests (30.821385ms)
ℹ tests 8
ℹ suites 4
ℹ pass 8
ℹ fail 0
```
