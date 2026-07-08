# RC-03-003-runtime-result-error-code-narrowing - RC-03-003 Runtime step error code narrowing

        Objective: remove the literal assertion `decision.error.code as "INVALID_PROCESS_DEFINITION"` from `src/features/workflow/runtime/runtime-step.service.ts` by typing `PlanNextStepResult` error codes precisely.

Allowed files:
- src/features/workflow/runtime/runtime-step.service.ts
- tests/unit/workflow-runtime-step-next-node.test.ts

Forbidden files:
- src/db/**
- drizzle/**
- migrations/**
- package.json
- package-lock.json
- src/features/workflow/runtime/runtime.repository.ts
- src/features/workflow/runtime/runtime.actions.ts
- src/features/workflow/runtime/runtime.service.ts
- docs/agent-runs/**

Requirements:
- Preserve `RuntimeResult` shapes.
- Keep `planNextStep` pure.
- Add or adjust unit coverage only if needed to lock the error branch.

Validation commands:
- npx tsx --test tests/unit/workflow-runtime-step-next-node.test.ts
- npm run build
