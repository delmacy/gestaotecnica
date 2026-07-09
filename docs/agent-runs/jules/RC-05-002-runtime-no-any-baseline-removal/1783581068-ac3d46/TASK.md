# RC-05-002-runtime-no-any-baseline-removal - RC-05-002 Runtime no-any baseline removal

        Objective: remove the `events.actions.ts` baseline allowlist from `workflow-runtime-no-any-sweep.test.ts` now that the runtime action boundary no longer needs `as any`.

    Allowed files:
    - tests/unit/workflow-runtime-no-any-sweep.test.ts

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
- src/features/workflow/runtime/**

    Required validation:
    - npx tsx --test tests/unit/workflow-runtime-no-any-sweep.test.ts
- npm run build

    Implementation rules:
    - No DB/schema/migration/package-lock changes unless explicitly allowed.
    - Only allowed files may be changed.
    - Starting branch must be main.
    - Do not commit docs/agent-runs context files in the implementation PR.
    - Do not broaden runtime behavior, auth, workspace isolation, UI, or workflow semantics.
    - If the scope cannot be completed exactly, open a blocker/question instead of editing extra files.
