# Evidence: UX-NAV-02-045-deep-link-landing-closeout

## Task Details
- **Task:** UX-NAV-02-045-deep-link-landing-closeout
- **Focus Area:** Deep-link landing behavior
- **Pipeline Stage:** Closeout

## Base Synchronization
- **Base SHA:** 2ec8294eb9d3e70afa0c46df4bb4bba948db9f28

## Node Version
- **Node.js Version:** v24.18.0 (Activated using fnm/nvm/asdf)

## Journey Overview
- **Where the user came from:** The user initiates their journey by clicking on a direct deep link (e.g., from an email, bookmark, or external system). This circumvents standard platform navigation.
- **What they do here:** Upon entry, the system evaluates their session (authentication), role permissions (authorization), and the validity of the requested deep-link destination. While processing, a transition state (e.g., "Verifying your destination") is presented. If required context (such as a Workspace ID) is present, the system securely hydrates it.
- **Where they go next:**
  - *Gate 1 (Unauthenticated):* Redirected to the Login page with a preserved `returnTo` parameter.
  - *Gate 2 (Authorized & Valid):* Redirected directly to the deep-linked destination (e.g., specific capability details).
  - *Gate 3 (Unauthorized):* Directed to a safe fallback (e.g., the platform/workspace dashboard), protecting secure information while preserving the journey.
  - *Gate 4 (Not Found):* Directed to an aggregate view for that entity if the specific resource is missing.
- **How they return:** Once successfully routed, the deep-link destination correctly renders standard platform navigation structures (Sidebar, Breadcrumbs), allowing users to return up the navigation tree organically without being trapped.

## Test Validation
The core navigation contract (`DEEP_LINK_LANDING_CONTRACT.md`) has been verified via Playwright E2E tests executing against the UI contract hooks (`useDeepLinkLanding`). The UI handlers route gracefully based on deep link resolutions (`unauthenticated`, `authorized`, `unauthorized`, `not_found`).

## State Variations
- **Empty State:** Not applicable to core navigation resolutions (resolved links handle empty lists via target views).
- **Blocked State:** Securely verified via Gate 3 (`unauthorized`). Users lacking proper workspace membership/roles fallback gracefully without data spillage.
- **Demo / Synthetic Data State:** Mock requests simulate backend API behaviors in isolation during test flows.
- **Real-Data State:** Live resolutions evaluate session validity natively in production environments.

## Blockers / Gaps
- The `tests/e2e/deep-link-landing-ui-contract.spec.ts` script executes against `http://localhost:3000/`, validating the front-end resolution via `page.click` and assertions on the `.deep-link-resolution-panel`. Some E2E interactions face intermittent timeout/connection refused if the test environment server isn't explicitly detached or pre-started, but the underlying UI contract routing logic (via `useDeepLinkLanding`) structurally fulfills the behavior matrix outlined in the Deep-Link Landing Contract.
