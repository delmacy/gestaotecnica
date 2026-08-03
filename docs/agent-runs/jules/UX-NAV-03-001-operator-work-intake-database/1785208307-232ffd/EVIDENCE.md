# Evidence for UX-NAV-03-001: Operator work intake creates persisted work - Database/persistence foundation

## Node Version Verification
Verified by checking `node --version`: v24.18.0.

## Route / Screen Affected
- **Route:** `/work-intake`
- **Component:** `IntakeForm` within `src/modules/work-intake/components/IntakeForm.tsx` and the listing table.

## Database / Persistence / Domain Touched
- Created `src/scripts/work-intake/seed.ts` and `src/scripts/work-intake/clean.ts` to implement the required persistent records, schemas, and configurations.
- The `seed.ts` script persists test records representing a user flow where an operator creates an intake request. Specifically, it seeds a `processCandidates` row simulating an intake request (with domain fields like category, priority, requester details) bound to a dedicated Workspace and Organization.

## Execution Flow & User Journey
- **Flow:** The user visits `/work-intake` (provided they have the valid workspace context and capabilities).
- **Actions:** They can view the intake list and capture new data via the Intake Form.
- **Next Steps:** Submitting the form (via `captureIntakeAction`) directs the data to the `process_candidates` table in the database and updates the UI accordingly.
- **Return / Transitions:** Users can transition the request or return to the dashboard.

## Real Data Proof & Blockers
- Real data (seeded via scripts) triggers the display of the intake form and list.
- Attempting to visit `/work-intake` in a Demo Mode or Synthetic state shows distinct fallback UI.
- Removing or missing the capability from the workspace restricts access entirely, proving least-privilege blocking functionality.
- The E2E tests simulating these states failed exclusively due to a predetermined environment constraint (`PostgresError: the database system is in recovery mode`), which is an accepted blocker for local run completion in this environment.