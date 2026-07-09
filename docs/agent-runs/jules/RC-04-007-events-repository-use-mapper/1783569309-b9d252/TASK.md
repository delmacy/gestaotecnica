# RC-04-007-events-repository-use-mapper - RC-04-007 Events repository uses mapper

        Objective: replace `record as EventRecord` and `records as EventRecord[]` in `events.repository.ts` with `mapEventRow` usage.

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
- src/features/workflow/runtime/runtime.repository.ts
- src/features/workflow/runtime/events/events.types.ts
- src/features/workflow/runtime/events/events.validation.ts

Required validation:
- npx tsx --test tests/unit/workflow-events-repository-mappers.test.ts
- npm run build

Implementation rules:
- No DB/schema/migration/package-lock changes unless explicitly allowed.
- Only allowed files may be changed.
- Starting branch must be main.
- Do not commit docs/agent-runs context files in the implementation PR.
- Do not broaden runtime behavior, auth, workspace isolation, UI, or workflow semantics.
- If the scope cannot be completed exactly, open a blocker/question instead of editing extra files.
