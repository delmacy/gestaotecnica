# RC-05-008-events-validation-payload-contract-tests - RC-05-008 Events validation payload contract tests

        Objective: add tests that document the event payload contract: object payloads with unknown nested values pass, omitted payload defaults to `{}`, and non-object top-level payload is rejected.

    Allowed files:
    - tests/unit/workflow-events-validation.test.ts

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
    - npx tsx --test tests/unit/workflow-events-validation.test.ts
- npm run build

    Implementation rules:
    - No DB/schema/migration/package-lock changes unless explicitly allowed.
    - Only allowed files may be changed.
    - Starting branch must be main.
    - Do not commit docs/agent-runs context files in the implementation PR.
    - Do not broaden runtime behavior, auth, workspace isolation, UI, or workflow semantics.
    - If the scope cannot be completed exactly, open a blocker/question instead of editing extra files.
