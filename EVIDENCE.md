# Evidence for UX-NAV-03-014-form-submit-to-work-usecase-api

- The task implements the required Work Status API Route mapping to `resolveWorkStatus`.
- Route Affected: `src/app/api/builder/work-status/route.ts` creates the `/api/builder/work-status` endpoint.
- Domain Path Used: This route wraps `resolveWorkStatus` and extracts `workspaceContext` properly using `resolveWorkspaceContext`.
- Context Data: Passed to the domain logic properly by mapping `x-environment-mode` to correctly resolve `demo`, `synthetic` and `real` data.
- Base Sync: This branch is based on origin/main, which has SHA `05241ac05d70b735c55defd319be8c5018cf16f4`
- User Journey: The user lands on a module or form that requires tracking a submission's status. They fill out a form or trigger an action (Form Submission). This API binding `POST /api/builder/work-status` provides a structured endpoint where the runtime state handles returning a `WorkStatusResolution`. Depending on the environment headers passed by the frontend (demo/synthetic/blocked), this determines whether the user receives a demo message, a forbidden error, or a successful route redirect (`destination`) to their newly created WorkItem detail screen or dashboard.

Node.js Environment:
v24.18.0
