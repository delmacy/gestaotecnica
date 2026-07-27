# Evidence: UX-NAV-02-034-runtime-evidence-handoff-e2e

## Node Version
v24.18.0

## Base SHA
99c47f6d0c127662fe1c41aa87e97043ebd919b5

## User Journey
- **Where the user came from:** The user originates from the Runtime environment (e.g., executing an operational step or active task).
- **What they do here:** The user triggers the handoff (e.g., "Submit to Record") to package and log the execution payload securely into the Evidence module.
- **Where they go next:** Upon successful handoff, the user sees a commercial confirmation receipt and can view the immutable record or return to their task queue.
- **How they return:** From the receipt view, actions such as "Return to Dashboard" or "Next Task" provide seamless routing back to the Runtime environment.

## Journey States Authenticated
- **Real-Data State:** "Official Record Captured" is shown when real records log to the immutable production vault.
- **Demo State:** "Logged to Demo Vault" badges mock environments accurately.
- **Synthetic Data State:** "Synthetic Record" visually separates generated tasks.
- **Blocked State:** "Submission Restricted" ensures users without permissions see a distinct failure reason.
- **Empty State:** "Required information missing" is correctly shown for mandatory fields missing.

## Acceptance and Tests
All end-to-end journey validation tests in `tests/e2e/runtime-evidence-handoff.spec.ts` pass, successfully testing the routing logic, authentication bypass, and UI distinct states across the Runtime to Evidence Handoff.

## Commands Run
- `npm install`
- `nvm install 24 && nvm use 24 && npm install`
- `npx playwright install`
- `kill $(lsof -t -i :3000) 2>/dev/null || true && npm run dev > /dev/null 2>&1 & sleep 10 && npx playwright test tests/e2e/runtime-evidence-handoff.spec.ts`
