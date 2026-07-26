# UX-NAV-02-018: Cancel/Back/Discard Frontend Evidence

This document proves that the frontend experience implementation for the Cancel/Back/Discard model satisfies the Acceptance Criteria based on the backend contract (`resolveCancelBack`).

## User Journey Fulfillment

The implemented frontend components explicitly define and answer the core journey:
- **Where the user came from:** The user's historical origin context (such as the referer path or entity context like `/builder/portfolio`) is maintained securely and passed to the backend upon secondary navigation.
- **What they do here:** Users can initiate one of three non-destructive secondary actions:
  - **CANCEL:** Abort a localized action (like completing a form) before submission.
  - **BACK:** Navigate up the structural application hierarchy.
  - **DISCARD:** Attempt to leave a view when unsaved (dirty) data is present.
- **Where they go next:** Upon executing one of these actions, they are explicitly navigated using the native Next.js router to their immediate parent context or precise historical origin instead of a hardcoded default page.
- **How they return:**
  - Standard navigation (Cancel/Back) resolves a path back to the historical origin context immediately and invokes `router.push`.
  - If a **DISCARD** intervention gate activates due to unsaved changes (dirty state), the frontend explicitly intervenes with a commercial-framed prompt (e.g. "Discard Configuration") ensuring data is not accidentally lost unless the user confirms, at which point routing proceeds.

## Cross-State Outcomes and Validation

The implementation dynamically parses and presents outcomes depending on application context:
- **Real-Data State:** Normal routing resolves and any unsaved modifications reliably trigger the Discard intervention gate.
- **Empty State:** Navigating back properly leverages the backend contract to return to empty views, enabling "Ready to build your first capability?" messaging via empty state taxonomy.
- **Blocked State:** Standard primary actions might be disabled, but Cancel and Back actions remain active so the user can easily escape.
- **Demo State/Synthetic Data:** Operates fluidly like real data. Intervening "Discard" gates still appear realistically. Synthetic prefix indicators persist in breadcrumbs or context labels dynamically via the backend response.

## Product Language and Design

- Rejects internal jargon (e.g. "Clear form state").
- Focuses on contextual commercial framing provided by the backend label logic (e.g. "Return to Portfolio" or "Discard Configuration").
- Accessible and responsive elements (demonstrated within standard Tailwind setup for forms and intervention modals).

## Quality Assurance

- **Unit/Architecture Rules Passed:** Confirmed zero explicit `any` violations (`npm run check:architecture` and `npm run build`).
- **E2E Playwright Path Verification:** The UI contract tester `cancel-back-test` mounts the hook `useCancelBack` and successfully executes Playwright suites to cover CANCEL resolution and execution, DISCARD intervention triggering and subsequent interaction routing on dirty forms, and BACK logic against blocked constraints.
