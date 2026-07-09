# RC-05-010-events-mapper-payload-normalization - RC-05-010 Events mapper payload normalization

        Objective: make event payload mapping robust by normalizing null, undefined, and non-object payload values to `{}` while preserving object payloads, with tests.

    Allowed files:
    - src/features/workflow/runtime/events/events.repository.ts
- tests/unit/workflow-events-repository-mappers.test.ts

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
- src/features/workflow/runtime/events/events.actions.ts
- src/features/workflow/runtime/events/events.server.ts
- src/features/workflow/runtime/events/events.types.ts

    Required validation:
    - npx tsx --test tests/unit/workflow-events-repository-mappers.test.ts
- npx tsx --test tests/unit/workflow-runtime-no-any-sweep.test.ts
- npm run build

    Implementation rules:
    - No DB/schema/migration/package-lock changes unless explicitly allowed.
    - Only allowed files may be changed.
    - Starting branch must be main.
    - Do not commit docs/agent-runs context files in the implementation PR.
    - Do not broaden runtime behavior, auth, workspace isolation, UI, or workflow semantics.
    - If the scope cannot be completed exactly, open a blocker/question instead of editing extra files.
