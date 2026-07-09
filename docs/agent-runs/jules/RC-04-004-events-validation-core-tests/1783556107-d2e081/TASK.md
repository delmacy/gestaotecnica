# RC-04-004-events-validation-core-tests - RC-04-004 Events validation core tests

        Objective: add focused unit coverage for `logEventInputSchema`: valid minimal process.started input, invalid workspace uuid, invalid event type, and default empty payload.

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
- src/features/workflow/runtime/events/events.validation.ts
- src/features/workflow/runtime/events/events.types.ts

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
