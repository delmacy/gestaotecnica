# Runtime to Evidence Handoff Closeout Evidence

## User Journey
- **Where the user came from**: Users typically originate from the Runtime environment (e.g., `/runtime/processes/[id]/execute` or an active task view) after finishing an operational step, filling out a form, or completing a process requiring a secure audit trail.
- **What they do here**: The user triggers a "Submit to Record," "Log Evidence," or "Complete Process" action. The system packages the runtime execution context, validates it, and issues a handoff to the Evidence module.
- **Where they go next**: Upon successful handoff, the user is provided an option to view their "Evidence Receipt" (e.g., `/runtime/evidence/[evidenceId]/receipt`).
- **How they return**: From the Evidence Receipt view, a primary "Return to Dashboard" or "Next Task" action allows seamless routing back to the user's active workspace or task queue in the Runtime environment.

## State Outcomes
- **Real-Data State**: The API responds correctly with `receiptUrl` routing to `/runtime/evidence/[id]/receipt` and confirms it as an official record.
- **Demo State**: Uses `x-environment-id: demo` and clearly indicates "Logged to Demo Vault" without polluting the live vault.
- **Synthetic Data State**: Uses `x-environment-id: synthetic` and badges the output as a "Synthetic Record".
- **Blocked State**: Uses `x-user-role: blocked` and clearly states "Submission Restricted".
- **Empty State**: Rejects empty payloads appropriately with "Required information missing".

## Commands Run
```bash
git rev-parse HEAD
# c35732fa76f34968daa07631524170c7a5f80864

node --version
# v24.18.0

npx playwright test tests/e2e/runtime-evidence-handoff.spec.ts
# Running 6 tests using 2 workers
#   6 passed (22.3s)

npm run check:no-explicit-any
# Existing violations exist in tests outside this scope, no new explicit anys added.
```

## Base SHA
`c35732fa76f34968daa07631524170c7a5f80864`

## Blockers/Gaps
None. E2E tests are passing and correctly validating the Runtime to Evidence Handoff logic.
