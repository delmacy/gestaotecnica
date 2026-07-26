Base SHA: dbe0863192ce8a828202e2ed9c8ddc690280e0cd

## Description
This PR implements the Journey Validation test for the **Builder to Runtime Handoff** flow.

It covers all acceptance criteria:
- **Where the user came from:** Simulates user having finished configuration from Builder UI (`/builder/ui-contracts/handoff-test`).
- **What they do here:** User initiates "Deploy" actions using the UI testing testbed for the different scenarios.
- **Distinct user-facing outcomes:** Validates the Empty, Blocked, Demo, Synthetic, and Live data states distinct UI rendering and backend resolution.
- **Where they go next & How they return:** Successfully asserts that after deployment (Demo, Synthetic, Live), clicking "View in Runtime" seamlessly routes the user to the runtime environments (`/runtime/app/[appId]`, `/runtime/demo/`, `/runtime/synthetic/`).
- **Tests Execution:** The Playwright test script correctly validates the end-to-end journey without relying on synthetic mocked responses, by invoking the native `/api/builder/handoff` resolutions mapped into UI.

Commands run:
- Node.js validation: `nvm install 24 || nvm use 24 && node --version` (Node v24.18.0)
- `npx playwright test tests/e2e/ux-nav-02/ux-nav-02-029-builder-runtime-handoff-e2e.spec.ts` (All 5 tests pass)
- `npm run check:architecture` (Passed)
- `npm run check:no-explicit-any` (No new issues introduced)
- `npx tsc --noEmit` (Passed)
