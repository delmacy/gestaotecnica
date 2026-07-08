# RC-03-005-runtime-no-any-sweep-tests - RC-03-005 Runtime no-any sweep validation

        Objective: add a focused unit/static test that protects the runtime core files touched in RC-01 through RC-03 from reintroducing obvious `Record<string, any>`, `z.any()`, and `as any` patterns.

Allowed files:
- tests/unit/workflow-runtime-no-any-sweep.test.ts
- package.json

Forbidden files:
- src/db/**
- drizzle/**
- migrations/**
- package-lock.json
- src/features/workflow/runtime/**
- docs/agent-runs/**

Requirements:
- Prefer a plain Node/tsx test that reads target files and checks forbidden strings.
- Do not change production code in this task.
- Only touch package.json if an existing test script needs a minimal include; otherwise leave it untouched.

Validation commands:
- npx tsx --test tests/unit/workflow-runtime-no-any-sweep.test.ts
- npm run build
