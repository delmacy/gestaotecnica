Base SHA: 01eb7ffd00be665b255200a8c1410c0fc1a406af
Node version: v22.22.1

Journey Test Execution:
```

Running 2 tests using 2 workers

[1/2] [chromium] › tests/e2e/journey-logic-ui.spec.ts:12:7 › Journey Logic Regression Gate › should execute START action
[2/2] [chromium] › tests/e2e/journey-logic-ui.spec.ts:26:7 › Journey Logic Regression Gate › should execute DISCARD action
  2 passed (2.7s)
```

Acceptance Criteria:
- The user journey starts by engaging with the Start Action and finishes by confirming setup cancellation or completing it. The test confirms correct handling of real states.
