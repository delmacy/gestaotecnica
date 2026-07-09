# RC-05-001-events-action-db-boundary - RC-05-001 Events action DB boundary

        Objective: replace the remaining `db as any` in `events.actions.ts` by importing `EventDb`, casting `getRuntimeDb()` once as `EventDb`, and passing that typed value to `getTimelineForInstance`.

    Allowed files:
    - src/features/workflow/runtime/events/events.actions.ts

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
- src/features/workflow/runtime/events/events.repository.ts
- src/features/workflow/runtime/events/events.server.ts
- tests/**

    Required validation:
    - npm run build

    Implementation rules:
    - No DB/schema/migration/package-lock changes unless explicitly allowed.
    - Only allowed files may be changed.
    - Starting branch must be main.
    - Do not commit docs/agent-runs context files in the implementation PR.
    - Do not broaden runtime behavior, auth, workspace isolation, UI, or workflow semantics.
    - If the scope cannot be completed exactly, open a blocker/question instead of editing extra files.
