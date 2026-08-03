# Blocked/Error/Fallback Paths - Frontend Experience Evidence

## Goal
Implement the user-facing route/menu/flow experience for Blocked, Error, and Fallback Paths according to the contract, ensuring proper interception and user-friendly messaging without inventing new backend behavior.

## Base SHA
```
486392bbd02fd2703aae1b41400c1aa330331ceb
```

## User Journey
The implementation ensures a clear and commercial user experience when a failure or blockage is encountered:

*   **Where the user came from:** The user initiates an action or navigates to a route within the application (e.g., trying to access a restricted capability or encountering an error).
*   **What they do here:** The system intercepts the request (via Next.js `error.tsx`, `not-found.tsx`, or the custom `useBlockedFallback` hook for API/action failures). Instead of raw errors or codes, the user sees a commercial message. For example:
    *   **Unauthorized:** "Please log in to continue."
    *   **Blocked Workspace:** "This configuration requires Workspace Admin privileges."
    *   **Demo Restricted:** "Action restricted in Demo Simulation. No changes were made."
    *   **Missing Entity:** "Configuration Unavailable."
    *   **System Error:** "Temporary Disruption. Please try again later or contact support."
*   **Where they go next:** The system provides a safe primary fallback action. For workspace errors, it routes back to the parent workspace or list view. For unauthorized access, it routes to `/auth/login`. For system errors, it provides a "Retry" or return to dashboard option.
*   **How they return:** The fallback state retains structural navigation (if possible) and provides explicit primary actions (like "Return to Workspace" or "Retry") to guide the user back to a known safe state.

## Implementation Details
1.  **Frontend Hook (`useBlockedFallback`)**: Added a React hook to communicate with the `blocked-fallback` API endpoint.
2.  **UI Contracts Testing App**: Created a dedicated testing interface at `src/app/(builder)/builder/ui-contracts/blocked-fallback-test/page.tsx` to mount the hook and execute routing logic for all state scenarios natively within the browser context.
3.  **Global & Scoped Error Boundaries**: Updated `src/app/error.tsx` and created `src/app/(builder)/builder/error.tsx` to use product-oriented language ("Temporary Disruption") instead of generic stack traces. Created `src/app/(builder)/builder/not-found.tsx` to handle 404 paths with "Configuration Unavailable" and a safe return action.

## Validation
A Playwright E2E test suite (`tests/e2e/builder/blocked-fallback-contract.spec.ts`) was executed successfully, validating all specific contract conditions natively through the UI layer.

```
$ npx playwright test tests/e2e/builder/blocked-fallback-contract.spec.ts

  4 passed (8.8s)
```
