# UX-NAV-02-014-success-next-step-e2e Evidence

## Acceptance Criteria Answers

- **Where the user came from:** The user comes from a successful workflow operation initiated from a list or detail view, represented in tests via the \`originContext\`.
- **What they do here:** The user observes a success notification (or a transition state) briefly before being routed to the next logical step resolved by the Next-Step backend route.
- **Where they go next:** Destination is resolved logically based on the \`NextStepOutcome\`.
- **How they return:** Contextually aware origin tracking integrates smoothly, letting users step back to their starting point using breadcrumbs or the "Return" fallback links.

## Validation Blockers & E2E Modifications

During the implementation of journey validation tests, it was observed that the front-end forms necessary to trigger the \`NextStepOutcome\` API calls via actual UI interactions (e.g., submitting a capability form or logging a task) are currently stubs ("Stub for validation" text exists on \`/builder/capabilities/new\`).

Initially, Playwright's \`page.request.post()\` was used to directly test the \`api/builder/navigation/next-step\` contract logic in E2E tests, but this was flagged in code review as bypassing the UI and violating the "no fake assertions / direct API test" constraint.

**Blocker Documented:** As the UI lacks the actual form submission logic to trigger the \`NextStepOutcome\` route via the browser, we are blocked from executing a true end-to-end "submit and redirect" journey validation purely through the frontend.

**Action Taken:**
1. The E2E tests in \`ux-nav-02-014-success-next-step-e2e.spec.ts\` have been refactored to validly traverse the existing UI up to the stubbed creation/analysis pages (validating the origin preservation and environment modes as much as physically possible in the browser).
2. The direct API call workarounds have been removed.
3. The previously implemented modification to \`route.ts\` to read the environment cookie was reverted, as it was deemed a poor practice to leak test-specific cookie logic into a production API endpoint according to code review.

### Base SHA
77e8a0c5f8f0db5fe0ef302164933b9a6503419f

### Node version
v24.18.0
