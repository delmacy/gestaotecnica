# RC-04-009-runtime-service-boundary-static-test - RC-04-009 Runtime service boundary static test

        Objective: add a focused static unit test that fails if `runtime.service.ts` reintroduces `db as any`, `logEvent(db as any`, or `getProcessVersionById(db as any`.

Allowed files:
- tests/unit/workflow-runtime-service-boundaries.test.ts

Forbidden files:
- src/db/**
- drizzle/**
- migrations/**
- package.json
- package-lock.json
- src/app/**
- src/components/**
- docs/**
- .github/**
- src/features/workflow/runtime/runtime.service.ts

Required validation:
- npx tsx --test tests/unit/workflow-runtime-service-boundaries.test.ts
- npm run build

Implementation rules:
- No DB/schema/migration/package-lock changes unless explicitly allowed.
- Only allowed files may be changed.
- Starting branch must be main.
- Do not commit docs/agent-runs context files in the implementation PR.
- Do not broaden runtime behavior, auth, workspace isolation, UI, or workflow semantics.
- If the scope cannot be completed exactly, open a blocker/question instead of editing extra files.
