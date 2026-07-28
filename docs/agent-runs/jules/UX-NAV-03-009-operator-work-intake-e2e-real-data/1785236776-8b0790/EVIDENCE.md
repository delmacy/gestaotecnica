# Evidence - Operator work intake creates persisted work - Real-data journey validation

## Blocker Report

**Affected Route:** `/work-intake` (list view) and `/work-intake/[id]` (detail view).

**Persistence Path:** `builder.process_candidates` table (via the `captureIntakeKernelAction` handler).

**Precise Blocker:**
The real-data journey validation cannot proceed due to missing registrations in the platform kernel and missing initialization in the Server Action context, both of which are outside the allowed scope of this task.

Specifically:
1. `initializePlatformKernel()` in `src/platform/kernel.ts` does not register the work-intake module (`workIntakeManifest`) nor its actions (`captureIntakeKernelAction`, `transitionIntakeKernelAction`).
2. The Server Action file `src/modules/work-intake/actions.ts` does not call `initializePlatformKernel()`, and there is no boot hook (`instrumentation.ts` or `middleware.ts`) to initialize the kernel for Server Actions.
3. Both `src/platform/` and `src/modules/` are outside the allowed scope for this task (`tests/**`, `src/app/**`, `src/components/**`, `src/server/**`, `docs/**`).

Without registration in `kernel.ts` or manual initialization and registration in the Server Action bundle, the `work_intake.capture` action cannot resolve, returning `Action nao encontrada: work_intake.capture`.

This task cannot proceed. A follow-up task with an expanded scope (allowing edits to `src/platform/kernel.ts` and/or `src/modules/work-intake/actions.ts`) is required to resolve this integration gap.
