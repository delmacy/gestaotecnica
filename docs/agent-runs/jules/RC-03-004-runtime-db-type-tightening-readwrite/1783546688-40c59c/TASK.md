# RC-03-004-runtime-db-type-tightening-readwrite - RC-03-004 RuntimeDb read/write method typing

        Objective: replace the `any` members in `RuntimeDb` with narrow callable method types that preserve current repository chaining without leaking Drizzle internals.

Allowed files:
- src/features/workflow/runtime/runtime.repository.ts
- tests/unit/workflow-runtime-repository-mappers.test.ts

Forbidden files:
- src/db/**
- drizzle/**
- migrations/**
- package.json
- package-lock.json
- src/features/workflow/runtime/runtime-step.service.ts
- src/features/workflow/runtime/runtime.actions.ts
- src/features/workflow/runtime/runtime.service.ts
- docs/agent-runs/**

Requirements:
- Do not alter repository query logic.
- Keep this as a type-only boundary improvement.
- Avoid new explicit `any`; prefer `unknown` or minimal structural types.

Validation commands:
- npx tsx --test tests/unit/workflow-runtime-repository-mappers.test.ts
- npm run build
