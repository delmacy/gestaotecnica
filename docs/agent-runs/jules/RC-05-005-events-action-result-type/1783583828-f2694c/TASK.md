# RC-05-005-events-action-result-type - RC-05-005 Events action result type

        Objective: give `getTimelineForInstanceAction` an explicit return type using `RuntimeResult<EventRecord[]>` without changing its public success/error shape.

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
- src/features/workflow/runtime/events/events.types.ts
- src/features/workflow/runtime/runtime.errors.ts
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
