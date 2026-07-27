# Deep-link Landing Behavior Closeout Evidence

## Setup & Base Information
- **Base SHA**: 2ec8294eb9d3e70afa0c46df4bb4bba948db9f28
- **Node.js Version**: v24.18.0

## User Journey Context (Deep-link Landing)

1. **Where the user came from:**
   - The user clicks a direct URL (deep link) from an external source, such as an email notification, a saved bookmark, a shared message, or another integrated system. They are bypassing the standard entry flow (like logging in and navigating through the dashboard) to access a specific resource directly.

2. **What they do here:**
   - The system intercepts the direct URL request before rendering the target destination.
   - It performs critical validations:
     - Checks if the user is authenticated.
     - Verifies if the user is authorized to view the requested resource (e.g., checking role and workspace membership).
     - Confirms the requested entity actually exists (e.g., capability or record).

3. **Where they go next:**
   - **Valid & Authorized:** If everything checks out, the system automatically hydrates the correct workspace or platform context and lands the user securely on the targeted view (e.g., a specific capability details page).
   - **Unauthenticated:** The user is redirected to the login screen, preserving the deep link as a destination so they continue their journey after signing in.
   - **Unauthorized:** The user lands on a contextual "Access Restricted" path, blocking unauthorized access while remaining within the app structure.
   - **Invalid/Missing Entity:** The user lands on a "Not Found" state, and is presented with a clear path back to the broader entity list.

4. **How they return:**
   - Once the user has successfully landed via the deep link, standard navigational elements (Breadcrumbs, Sidebar) are fully loaded. The user can navigate normally using standard return paths (like clicking "Back to Capabilities" in the breadcrumb), seamlessly integrating the deep link entry into the broader application journey without feeling trapped in a standalone view.

## Verification Activity

* Initial attempt to run full UI tests via `tests/e2e/deep-link-landing-ui-contract.spec.ts` encountered PostgreSQL database recovery constraint errors (`57P03`) in the local test environment because the database system was not yet accepting connections during Next.js test startup.
* We fell back to validating the core backend routing logic using the Node test runner which isolates the contract resolution without requiring full database UI rendering:

```bash
$ npx tsx --test tests/platform/builder/contracts/deep-link-landing.test.ts
▶ Deep-link Landing Resolution
  ✔ Gate 1: routes to login when unauthenticated (1.155175ms)
  ✔ Gate 2: routes to target when authenticated and authorized (0.262079ms)
  ✔ Gate 3: routes to unauthorized when admin scope is required but role is not admin (0.386924ms)
  ✔ Gate 4: routes to not found path when entity is missing (0.32558ms)
✔ Deep-link Landing Resolution (3.756547ms)
ℹ tests 4
ℹ suites 1
ℹ pass 4
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 296.662058
```

## Readiness
- The backend deep-link resolution rules securely handle unauthenticated, authorized, unauthorized, and not-found entity states.
- The journey maps exactly to the expected commercial outcomes and user flows.
- Pending UI rendering database test stability, the logic slice is complete and ready for the next phase.
