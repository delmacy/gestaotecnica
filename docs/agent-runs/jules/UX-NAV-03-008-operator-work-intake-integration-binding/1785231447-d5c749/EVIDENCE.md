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
- **Expected Redirect:** `/work-intake/[id]`

## Layers already complete (from prior UX-NAV-03 tasks)
- **Database:** `intakeRequests` table (UX-NAV-03-001)
- **Domain:** state machine rules (UX-NAV-03-002)
- **Contracts:** `CreateIntakeInput` / `TransitionIntakeInput` schemas (UX-NAV-03-003)
- **Use case/API:** server action + `/api/work-intake` route (UX-NAV-03-004)
- **UI:** form + detail pages (UX-NAV-03-005/006)
- **Audit:** `work_intake.write` scope on kernel actions (UX-NAV-03-007)

## Precise blocker
Three registration calls are required in `src/platform/kernel.ts`:
- `registerModule(workIntakeManifest)`
- `registerAction(captureIntakeKernelAction)`
- `registerAction(transitionIntakeKernelAction)`

## Why blocked
`src/platform/**` is explicitly outside the allowed scope for this task (`src/app/**`, `src/components/**`, `src/server/**`, `src/services/**`, `src/lib/**`, `tests/**`, `docs/**`).
The kernel registration gap correctly belonged to tasks UX-NAV-03-002 (core-domain) or UX-NAV-03-004 (usecase-api), which should have registered the actions when defining the kernel-action boundary. Because this task cannot edit `kernel.ts`, the E2E binding is completely blocked.

## Unblock path
A follow-up task is needed — "Register work-intake module and kernel actions in platform kernel" — which requires a scope that includes the `src/platform/kernel.ts` file.
