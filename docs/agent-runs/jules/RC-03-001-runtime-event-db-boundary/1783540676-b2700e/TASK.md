# RC-03-001-runtime-event-db-boundary - RC-03-001 Runtime event DB boundary typing

        Objective: remove `db as any` casts around runtime event logging inside `src/features/workflow/runtime/runtime-step.service.ts` by introducing and using a narrow event repository DB boundary type from `src/features/workflow/runtime/events/events.repository.ts` if needed.

Allowed files:
- src/features/workflow/runtime/runtime-step.service.ts
- src/features/workflow/runtime/events/events.repository.ts
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
- src/features/workflow/runtime/runtime.service.ts
- docs/agent-runs/**

Requirements:
- Preserve public runtime behavior.
- Do not change database schema or migrations.
- Do not introduce new `any` casts.
- Keep edits minimal and focused on the event logging DB boundary.

Validation commands:
- npx tsx --test tests/unit/workflow-runtime-step-next-node.test.ts
- npm run build
