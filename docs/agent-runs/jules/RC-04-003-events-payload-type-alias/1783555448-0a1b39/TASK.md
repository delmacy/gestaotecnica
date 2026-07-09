# RC-04-003-events-payload-type-alias - RC-04-003 Events payload type alias

        Objective: create/export `EventPayload = Record<string, unknown>` in `events.types.ts` and use it for public event payload fields.

Allowed files:
- src/features/workflow/runtime/events/events.types.ts

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
- src/features/workflow/runtime/events/events.validation.ts

Required validation:
- npm run build

Implementation rules:
- No DB/schema/migration/package-lock changes unless explicitly allowed.
- Only allowed files may be changed.
- Starting branch must be main.
- Do not commit docs/agent-runs context files in the implementation PR.
- Do not broaden runtime behavior, auth, workspace isolation, UI, or workflow semantics.
- If the scope cannot be completed exactly, open a blocker/question instead of editing extra files.
