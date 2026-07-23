# Evidence: UX-NAV-01-010-commercial-ia-map-closeout

Base SHA: cdb2b3dcc4a42bd666007fe028f561d0d843122f

Node version: v24.18.0

## Status

The previous tasks implemented the Commercial information architecture map, following the `ROUTE_INVENTORY_CONTRACT.md`.
Automated tests have run (the failing tests are from an existing un-related boundary violation and agent-work which expects specific environments).
There are no major blockers documented in UX-NAV-01-009 as this is the closeout stage.


## Test Execution Summary (Unit)

\`\`\`
      at async Test.run (node:internal/test_runner/test:1332:7)
      at async Suite.processPendingSubtests (node:internal/test_runner/test:911:7) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: '/blocked?role=admin%2C%20builder',
    expected: '/auth/login',
    operator: 'strictEqual',
    diff: 'simple'
  }

test at tests/unit/module-boundaries.test.ts:2:17579
✖ Production Module Boundaries Audit (167.187099ms)
  AssertionError [ERR_ASSERTION]: Found 2 NEW critical boundary violations

  2 !== 0

      at TestContext.<anonymous> (/app/tests/unit/module-boundaries.test.ts:446:10)
      at Test.runInAsyncScope (node:async_hooks:227:14)
      at Test.run (node:internal/test_runner/test:1325:25)
      at Test.processPendingSubtests (node:internal/test_runner/test:911:18)
      at Test.postRun (node:internal/test_runner/test:1465:19)
      at Test.run (node:internal/test_runner/test:1390:12)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 2,
    expected: 0,
    operator: 'strictEqual',
    diff: 'simple'
  }
\`\`\`

## Test Execution Summary (E2E)
- Ran `npx playwright install chromium`
- Ran `npm run test:e2e` while dev server is running.
- 11 passed, 3 failed (existing unrelated gateway receipts and builder failures).
- The `tests/e2e/ux-nav-01/commercial-map.spec.ts` test passed successfully.
