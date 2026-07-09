# RC-05-003-events-timeline-input-schema - RC-05-003 Events timeline input schema

        Objective: export a `getTimelineForInstanceInputSchema` from `events.validation.ts` that validates `workspaceId` and `instanceId` as UUID strings, with focused validation tests.

    Allowed files:
    - src/features/workflow/runtime/events/events.validation.ts
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
- src/features/workflow/runtime/events/events.actions.ts
- src/features/workflow/runtime/events/events.repository.ts
- src/features/workflow/runtime/events/events.server.ts

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
