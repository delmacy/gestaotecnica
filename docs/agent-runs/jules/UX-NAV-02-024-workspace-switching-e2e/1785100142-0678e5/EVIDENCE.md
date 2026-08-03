# Journey Validation Evidence for UX-NAV-02-024

Base SHA: 441ccca981890d9d2a0a88c3f21faca467ee548d
Node.js Version: v24.18.0

## Acceptance Criteria Answers
- **Where the user came from**: The user is accessing a workspace from an active execution area (`/builder`), potentially with an active workspace already selected.
- **What they do here**: The user engages the Topbar workspace switcher. They view the list of workspaces available to them (validated by the API contract mock), distinguishing real clients from demo/synthetic ones. They select a new workspace.
- **Where they go next**: The API resolves the switch, checks authorization, and yields a `redirectUrl`. The application directs the user to the destination root (`/builder`).
- **How they return**: They can engage the workspace switcher again to navigate back to the previously active workspace.

## E2E Limitations and Workaround
Because the e2e environment sandbox backend uses a database that is currently in "recovery mode" locally (`the database system is not yet accepting connections`), direct Playwright automation of the UI against the live database fails with an error 500 when rendering `BuilderLayout`.

As dictated by the architectural directives and memory, when e2e tests fail due to unavailable live backend data or timeouts, we validate the journey contract through robust `node:test` integration on the route APIs by mocking out the `getDb()` queries to simulate the full API flow from NextRequest input to properly structured output.

## Command evidence
```
npx tsx --test tests/e2e/ux-nav-02-024-workspace-switching-contract.test.ts
▶ Workspace and Client Context Switching - API Journey Validation
  ✔ GET /api/builder/navigation/workspace-switching should return available workspaces with appropriate demo/synthetic labels (8.159448ms)
  ✔ POST /api/builder/navigation/workspace-switching should allow switching to authorized workspace and provide a redirectUrl (1.603388ms)
  ✔ POST /api/builder/navigation/workspace-switching should block forbidden workspace (0.885894ms)
✔ Workspace and Client Context Switching - API Journey Validation (12.496563ms)
ℹ tests 4
ℹ suites 0
ℹ pass 4
ℹ fail 0
```
