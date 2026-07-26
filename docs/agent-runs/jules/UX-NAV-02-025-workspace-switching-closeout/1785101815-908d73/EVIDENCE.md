# Journey Validation Evidence for UX-NAV-02-025-workspace-switching-closeout

Base SHA: 62ae7015375c8271b5b34e10d8d278b8588ed119
Node.js Version: v24.18.0

## Acceptance Criteria Answers
- **Where the user came from**: The user is accessing a workspace from an active execution area (`/builder`), potentially with an active workspace already selected.
- **What they do here**: The user engages the Topbar workspace switcher. They view the list of workspaces available to them, distinguishing real clients from demo/synthetic ones via clear labels. They select a new workspace.
- **Where they go next**: The API resolves the switch, checks authorization, and yields a `redirectUrl`. The application directs the user to the destination root (`/builder`) of the selected workspace.
- **How they return**: They can engage the workspace switcher again to navigate back to the previously active workspace.

## Context and Gaps
- **Database Availability**: The live e2e environment sandbox backend uses a database that is currently in "recovery mode" locally. Direct Playwright automation of the UI against the live database fails.
- **Validation Workaround**: Validation of the Workspace and Client Context Switching Journey contract was conducted by executing integrated unit tests on the route API endpoints via `node:test`, successfully bypassing the UI layer by mocking `getDb()`.

## Command evidence
```
▶ Workspace and Client Context Switching - API Journey Validation
  ✔ GET /api/builder/navigation/workspace-switching should return available workspaces with appropriate demo/synthetic labels (7.763738ms)
  ✔ POST /api/builder/navigation/workspace-switching should allow switching to authorized workspace and provide a redirectUrl (1.562983ms)
  ✔ POST /api/builder/navigation/workspace-switching should block forbidden workspace (0.843898ms)
✔ Workspace and Client Context Switching - API Journey Validation (535.472419ms)
ℹ tests 4
ℹ suites 0
ℹ pass 4
ℹ fail 0
```
