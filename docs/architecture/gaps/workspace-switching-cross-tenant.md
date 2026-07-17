# Gap: Workspace Switching Cross-Tenant Isolation

## Context
Task CL-02-003-workspace-switching required verifying that workspace switching cannot leak cross-tenant data in UI flows.
The task execution was blocked because the required `allowed list` defining the execution boundaries was missing.

## Expected Guard
A test suite (or similar guard mechanism) should be present to ensure that when a user switches workspaces, any cross-tenant data from the previous workspace is properly cleared or isolated, preventing leakage.

## Follow-up Work
This gap must be addressed by providing the explicit allowed-list configuration to enable access to the required workspace-switching UI components, hooks, and routes (e.g., `src/pages/workspace/*`, `src/middleware/*`, `src/hooks/*`).
A placeholder skipped test (`tests/unit/workspace-switching-isolation.test.ts`) has been added to describe the expected behavior.

**Blocker**: The required verification of cross-tenant isolation during workspace switching cannot be implemented in the current PR because the explicit allowed-list configuration, which dictates access to necessary workspace UI components, routes, and hooks (`src/pages/workspace/*`, `src/middleware/*`, `src/hooks/*`), is missing. Strict task constraints prohibit broadening the scope or editing files outside the unprovided allowed list, meaning actual implementation or verification tests cannot be authored without violating rules.

Tracking Issue: [github.com/delmacy/gestaotecnica/issues/pending-allowed-list]
