# Evidence: UX-NAV-03-008-operator-work-intake-integration-binding

## Node.js version
```
v24.18.0
```

## Base SHA
```
39a5f1fe8d8cf459c94ba24909b5d8a124600a88
```

## Route/screen/menu/button affected
- **Route:** `/work-intake`
- **Component:** `IntakeCaptureForm`
- **Button:** "Capturar Solicitação" (submit button)

## Persistence object, domain object, contract, use case/API path touched
- **Persistence object:** The underlying data relies on the `process_candidates` table in PostgreSQL.
- **Contract/API:** The E2E tests target the full stack Next.js app running locally.

## User Journey
- The user navigates to `/work-intake`.
- They fill out the form for capturing an intake request (Title, Category, Priority, Description, Name, Contact, Department).
- They click "Capturar Solicitação".
- Expected next: They are redirected to `/work-intake/[id]` where they view the details.

## Real-data proof or precise blocker
**BLOCKER:**
To complete this task fully, I needed to register the module in `src/platform/kernel.ts`. However, based on the OpenCode Governor clarification, `src/platform/kernel.ts` is strictly out of the allowed scope. The allowed scope only includes:
- src/app/**
- src/components/**
- src/server/**
- src/services/**
- src/lib/**
- tests/**
- docs/**

Without modifying `src/platform/kernel.ts` (which is located in `src/platform/`), the server action `runAction("work_intake.capture", ...)` throws an error because the module and kernel actions are not registered with the platform kernel. The e2e test captures this by timing out during the redirect, because the server action silently fails underneath or fails to resolve the action key, preventing the creation of the record and the subsequent redirect to the details page. A follow-up task is required to register the `workIntakeManifest`, `captureIntakeKernelAction`, and `transitionIntakeKernelAction` in the core platform kernel by a human or an agent with permissions to modify `src/platform/kernel.ts`.
