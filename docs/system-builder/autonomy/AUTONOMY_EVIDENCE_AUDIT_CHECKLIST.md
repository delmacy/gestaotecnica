# Autonomy Evidence Audit Checklist

This checklist is used to audit whether an autonomous task has accumulated sufficient, verifiable evidence for review, acceptance, integration, and final archival. It enforces the rules defined in the Operational Evidence Ledger.

*Note: All evidence must be explicitly observed. Do not infer success or state. Missing evidence must be recorded as `MISSING` or `UNKNOWN`. Examples provided are simulated.*

---

## 1. Task and Session Identity
- [ ] **Task ID Verified:** The ID (e.g., `TASK-GT-...`) is explicitly recorded in the agent's ledger entry. *(Source: Agent work ledger/markdown logs)*
- [ ] **Session/Event ID Present:** Identifiers for the execution session are logged. *(Source: Agent terminal output or ledger entry)*

## 2. Source Control Evidence (Repository, Branch, Commit, PR)
- [ ] **Target Repository Correct:** The operation targeted the designated repository (e.g., `delmacy/gestaotecnica`). *(Source: GitHub API response / PR metadata)*
- [ ] **Branch Structure Valid:** A specific target branch was created from the base branch. *(Source: GitHub PR "from/to" branches)*
- [ ] **Commit SHA Logged:** The full commit SHA for the change is recorded in the operational ledger. *(Source: `git log` or GitHub API)*
- [ ] **Pull Request Created:** A PR number and URL exist and are documented. *(Source: GitHub PR URL / Ledger)*

## 3. Validation Depth (Documentary vs. Code Tasks)
- [ ] **Task Type Delineation:** Check if the task is strictly **Documentary** (Markdown, schemas) or **Code/Product** (TypeScript, Next.js, etc.). *(Source: PR file diff)*
  - **For Documentary Tasks:** Verification requires checking linting, formatting, or semantic validity (e.g., `npm run check:architecture`).
  - **For Code Tasks:** Verification requires full test suites (e.g., `npm run test`, `test:e2e`, or `build`) and runtime validation.

## 4. Execution Evidence (Comments, Checks, Tests, and Omissions)
- [ ] **CI/CD Checks Executed:** Appropriate GitHub Actions or local equivalents ran. *(Source: GitHub PR Checks tab or local terminal logs)*
- [ ] **Test Evidence Provided:** Actual terminal logs or Playwright HTML/images of tests passing exist. If missing, they are marked `MISSING`. *(Source: Terminal output / Playwright reports)*
- [ ] **Reviewer Feedback Processed:** If comments were made via `NEED_COMMENT_PR`, the agent appropriately registered the `NEEDS_CHANGES` state and pushed updates. *(Source: GitHub PR comment history)*
- [ ] **Known Omissions Explicit:** Any checks that failed or were skipped due to environment constraints are explicitly logged as such, not fabricated as success. *(Source: Agent ledger notes)*

## 5. Delivery vs. Merge Separability
- [ ] **Acceptance Evidence:** The delivery has been accepted (State: `ACCEPTED`). A human reviewer or external system approved the PR contents against the task criteria. *(Source: GitHub PR Review "Approved" status)*
- [ ] **Merge Evidence (Separate):** If merged, there is distinct evidence of the merge event (State: `MERGED`), separate from the acceptance event. *(Source: GitHub PR "Merged" badge)*

## 6. Autonomy and Intervention Markers
- [ ] **No Direct Human Commits:** No commits on the target branch were made by a human user after the `DISPATCHED` state. *(Source: GitHub commit author logs)*
- [ ] **No Environment Hacks:** No manual intervention (e.g., fixing sandbox state manually for the agent) occurred mid-sprint. *(Source: Audit of session recordings/logs)*
- [ ] **Autonomy Maintained:** If human intervention occurred, the sprint is marked `INVALIDATED_BY_MANUAL_INTERVENTION`. *(Source: Operational ledger status)*

## 7. Final Disposition and Archival Readiness
- [ ] **Final State Conclusive:** The ledger reflects a terminal state (e.g., `ACCEPTED`, `MERGED`, `INVALIDATED_BY_MANUAL_INTERVENTION`). *(Source: Operational Ledger)*
- [ ] **Receipts Recorded:** API receipts (e.g., GitHub GraphQL response IDs) for project updates are present. *(Source: Agent ledger/logs)*
- [ ] **Archival Ready:** The task is ready to be closed or synchronized to the Engineering Control Center (Project V2) based on complete, factual evidence. *(Source: Ledger completeness)*

---

## Simulated Example Entry (Do Not Use for Real Validations)
*The following is a simulated example of an audit row, explicitly labeled as not real.*

- **Task ID:** `[SIMULATED] TASK-GT-AUDIT-EXAMPLE`
- **Missing Evidence Handling:** "E2E tests could not be run due to sandbox constraints. Recorded as `MISSING`."
- **Autonomy Check:** "No human commits detected. Sprint autonomy remains valid."
