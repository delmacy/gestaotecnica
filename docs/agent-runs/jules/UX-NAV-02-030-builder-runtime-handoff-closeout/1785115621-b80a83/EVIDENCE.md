# UX-NAV-02-030-builder-runtime-handoff-closeout - Builder to runtime handoff - Closeout

## Base Environment
- Base SHA: 457e4bec976260d8fe6e11e693ff80ea4aa141c7
- Node.js Version: v24.18.0

## Commands Run
- `git fetch origin main && git merge origin/main`
- `node --version`
- `nvm install 24 && nvm use 24`
- `npm i`
- `npx tsc --noEmit`
- `npm run check:architecture`
- `npm run check:no-explicit-any`

## User Journey & Contract Validation
The Builder to Runtime Handoff contract defines the user flow for deploying applications from the builder interface to runtime environments.

**Where the user came from:**
The user navigates to the builder interface, specifically a handoff/deployment view (e.g., `/builder/ui-contracts/handoff-test`), intending to launch or test their configured application.

**What they do here:**
The user selects a target environment (e.g., Production, Demo, Synthetic) and triggers a deploy action. The system evaluates the application state (e.g., empty, restricted) and user privileges against the `resolveBuilderHandoff` backend contract.

**Where they go next:**
Based on the resolution, distinct user-facing outcomes occur:
1. **Live Production App:** Deployed successfully and transitions to `/runtime/app/{appId}?version={version}`.
2. **Demo App:** Deployed to an ephemeral sandbox runtime, transitioning to `/runtime/demo/{appId}?version={version}`.
3. **Synthetic App:** Deployed to a synthetic environment with distinct badging, transitioning to `/runtime/synthetic/{appId}?version={version}`.
4. **Empty App (No Configs):** The deployment is blocked, preventing the user from launching an unconfigured app.
5. **Restricted App:** The deployment action is disabled/restricted due to lacking runtime privileges.

**How they return:**
Once in the runtime environment, standard platform navigation (e.g., breadcrumbs, origin context) provides the return path back to the builder or platform dashboard.

## State Validations
The handoff states (empty, blocked, demo, synthetic, and real-data/live) present distinct, commercially-oriented user-facing outcomes validated via the UI test page and backend contract tests, ensuring responsive and accessible navigation handling.

## Blockers
No blockers encountered. The pipeline closeout for the Builder to runtime handoff slice is complete.
