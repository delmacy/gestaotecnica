# RC-04-006-events-record-mapper-snake-case - RC-04-006 Events mapper snake_case support

        Objective: extend `mapEventRow` to accept snake_case DB row keys such as `workspace_id`, `instance_id`, `event_type`, `entity_type`, `entity_id`, `actor_type`, `actor_id`, `correlation_id`, `causation_id`, and `created_at`.

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
