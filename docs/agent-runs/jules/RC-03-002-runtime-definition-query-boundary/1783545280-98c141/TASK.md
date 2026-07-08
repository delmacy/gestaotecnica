# RC-03-002-runtime-definition-query-boundary - RC-03-002 Runtime definition query DB boundary typing

        Objective: remove the remaining `db as any` cast around `getProcessVersionById` in `src/features/workflow/runtime/runtime-step.service.ts` by defining the narrowest practical query DB type at the boundary that owns `getProcessVersionById`.

Allowed files:
- src/features/workflow/runtime/runtime-step.service.ts
- src/features/workflow/definitions/process-definition.queries.ts
- tests/unit/workflow-runtime-step-next-node.test.ts

Forbidden files:
- src/db/**
- drizzle/**
- drizzle-agent-work/**
- migrations/**
- package.json
- package-lock.json
- src/features/workflow/runtime/runtime.repository.ts
- src/features/workflow/runtime/runtime.actions.ts
- docs/agent-runs/**

Requirements:
- Preserve existing query behavior.
- Do not widen runtime service responsibilities.
- Do not introduce new explicit `any` casts.

Validation commands:
- npx tsx --test tests/unit/workflow-runtime-step-next-node.test.ts
- npm run build
