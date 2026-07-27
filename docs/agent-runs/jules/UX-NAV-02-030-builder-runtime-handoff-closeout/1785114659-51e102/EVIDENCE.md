# Evidence: UX-NAV-02-030-builder-runtime-handoff-closeout

## 1. Journey Description (Product-Oriented)

**Where the user came from:**
Users arrive at the Builder handoff surface from the deployment sections of the Builder environment (e.g., `/builder/deploy`). They have finished configuring an application or process and are ready to deploy it.

**What they do here:**
Users initiate the deployment of their configurations to a runtime environment. They click a button to deploy, triggering validation and processing. Based on the app state (empty, blocked, demo, synthetic, live), the system provides distinct outcomes and visual cues, such as disabling buttons for empty/restricted apps or confirming a live deployment.

**Where they go next:**
Upon successful deployment, users can click "View in Runtime" to seamlessly navigate to the newly deployed runtime application URL (e.g., `/runtime/app/[appId]`).

**How they return:**
While in the Runtime view, users have access to a management toolbar or specific "Return to Builder" links (if they have the appropriate privileges) that allow them to route back to the original Builder configuration screen.

## 2. Distinct User-Facing Outcomes

*   **Empty State:** If an app has no deployable configurations, the deployment button is disabled, clearly stating "No configs to deploy". The app is labeled as "Empty".
*   **Blocked State:** If a user lacks the rights to deploy, the deployment button is disabled with text like "Pro Feature (Restricted)". The app is labeled as "Restricted".
*   **Demo State:** Handoff is successful, returning a "DEMO" result. The button specifically states "Deploy to Demo Runtime", and the user is routed to a `/runtime/demo/...` URL.
*   **Synthetic Data State:** Handoff handles synthetic apps safely, routing the user to a dedicated `/runtime/synthetic/...` URL upon success.
*   **Real-Data State:** Handoff for live production apps routes the user to the live `/runtime/app/...` URL upon success.

## 3. Base SHA

```
457e4bec976260d8fe6e11e693ff80ea4aa141c7
```

## 4. Test Evidence

All relevant E2E tests for the Builder to Runtime Handoff journey pass successfully.

```
$ npx playwright test tests/e2e/ux-nav-02/ux-nav-02-029-builder-runtime-handoff-e2e.spec.ts

Running 5 tests using 2 workers

  5 passed (30.8s)
```

## 5. Blockers / Gaps

None at this time. The contract is fully implemented and tested.
