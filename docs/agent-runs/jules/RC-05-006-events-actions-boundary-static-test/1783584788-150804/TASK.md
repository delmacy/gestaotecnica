# RC-05-006-events-actions-boundary-static-test - RC-05-006 Events actions boundary static test

        Objective: add a focused static unit test that guards `events.actions.ts` against reintroducing `db as any`, requires the `EventDb` boundary, and verifies the validation schema is used.

    Allowed files:
    - tests/unit/workflow-events-actions-boundary.test.ts

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
    - npx tsx --test tests/unit/workflow-events-actions-boundary.test.ts
- npm run build

    Implementation rules:
    - No DB/schema/migration/package-lock changes unless explicitly allowed.
    - Only allowed files may be changed.
    - Starting branch must be main.
    - Do not commit docs/agent-runs context files in the implementation PR.
    - Do not broaden runtime behavior, auth, workspace isolation, UI, or workflow semantics.
    - If the scope cannot be completed exactly, open a blocker/question instead of editing extra files.
