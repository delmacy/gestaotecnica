# Evidence: UX-NAV-02-040 Blocked/fallback paths closeout

## Base Commit
- Base SHA: `4fc052450d74f987b48cdd076bed63ef7e354c83`

## Execution Environment
- Node.js Version: `v24.18.0`
- Commands run:
  - `nvm use 24`
  - `node --version`
  - `npm install`
  - `npx playwright install`
  - `npm run dev`

## User Journey
- **Where the user came from:** The user attempted to navigate to a route or perform an action they do not have authorization for (e.g., clicking a restricted link, attempting to access a deleted capability).
- **What they do here:** The system intercepts the request and determines it cannot be fulfilled. The user is presented with a clear, contextual Blocked/Error state view instead of the requested resource.
- **Where they go next:** The system provides a primary fallback action. For unauthorized access, they are routed back to the immediate parent context, the Workspace Dashboard, or the Platform Dashboard. For a missing entity, they are routed back to the aggregate list view for that entity type. For a system error, they are routed to a safe global fallback (Dashboard).
- **How they return:** The fallback state includes explicit primary actions (e.g., a "Return to Dashboard" button) and retains structural navigation (Sidebar, Breadcrumbs), allowing users to utilize standard return paths.

## Validation and Blockers
- **Blockers:**
  - `npm run test` failed on multiple unit tests due to various environment issues (database not running `the database system is not yet accepting connections`, mismatched paths, and module boundary checks).
  - Playwright E2E tests for `ux-nav-02-039-blocked-fallback-paths.spec.ts` time out when waiting for `page.getByTestId('reason-select')`. The development server starts but the UI contracts page seems unreachable or fails to render the expected data-testids in the E2E environment.


## Test Output

The following test output was encountered when running the Playwright tests (`npx playwright test tests/e2e/ux-nav-02/ux-nav-02-039-blocked-fallback-paths.spec.ts`):

```
  3 failed
    [chromium] › tests/e2e/ux-nav-02/ux-nav-02-039-blocked-fallback-paths.spec.ts:10:9 › UX-NAV-02-039 Blocked Fallback Paths › should resolve forbidden_workspace fallback
    [chromium] › tests/e2e/ux-nav-02/ux-nav-02-039-blocked-fallback-paths.spec.ts:27:9 › UX-NAV-02-039 Blocked Fallback Paths › should resolve demo mode restriction without redirect
    [chromium] › tests/e2e/ux-nav-02/ux-nav-02-039-blocked-fallback-paths.spec.ts:42:9 › UX-NAV-02-039 Blocked Fallback Paths › should navigate to fallback path when Execute Navigation is clicked
```
Each failed with `Error: locator.selectOption: Test timeout of 30000ms exceeded.` while waiting for `getByTestId('reason-select')`.

## Readiness for next serial slice
- **Status: NOT READY.** Due to the E2E test failures indicating an unreachable UI or missing components on the UI contracts test page, and some unit test environment setup issues, the pipeline is not currently clean. The blockers must be addressed before moving to the next serial slice.
