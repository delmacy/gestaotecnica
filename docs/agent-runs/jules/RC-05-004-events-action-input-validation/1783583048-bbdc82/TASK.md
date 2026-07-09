# RC-05-004-events-action-input-validation - RC-05-004 Events action input validation

        Objective: use `getTimelineForInstanceInputSchema` inside `getTimelineForInstanceAction` to validate the mocked workspaceId and provided instanceId before calling the server function; return `INVALID_INPUT` on invalid input.

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
- src/features/workflow/runtime/events/events.validation.ts
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
