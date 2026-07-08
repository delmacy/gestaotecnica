# RC-02-002-runtime-repository-snake-case-fallbacks - Runtime repository snake_case mapper fallbacks

        You are Jules working in delmacy/gestaotecnica from GitHub main.

Task id: RC-02-002-runtime-repository-snake-case-fallbacks
Title: Runtime repository snake_case mapper fallbacks
Sprint: RC-02 Runtime Core Hardening
Front: Gestao Tecnica Runtime
Risk: low

Objective:
Add snake_case fallback support to process instance and action execution row mappers, matching the schema_version fallback already present for process payload rows.

Allowed files:
- src/features/workflow/runtime/runtime.repository.ts
- tests/unit/workflow-runtime-repository-mappers.test.ts

Forbidden files:
- src/features/workflow/runtime/runtime.service.ts
- src/features/workflow/runtime/runtime-step.service.ts
- src/features/workflow/runtime/runtime.actions.ts
- src/features/workflow/runtime/runtime.types.ts
- src/db/**
- drizzle/**
- migrations/**
- app/**
- components/**
- package.json
- package-lock.json

Acceptance criteria:
- Process instance mapper handles workspace_id, process_version_id, current_state_id, created_by_id, created_at, and updated_at fallbacks.
- Action execution mapper handles workspace_id, instance_id, action_key, actor_id, input_payload, output_payload, started_at, and finished_at fallbacks.
- Existing camelCase mapping remains supported.
- Tests prove both camelCase and snake_case source rows for at least process instance and action execution.

Required validation commands:
- npx tsx --test tests/unit/workflow-runtime-repository-mappers.test.ts
- npm run build

Operational rules:
- Keep the PR small and scoped to the allowed files.
- Do not modify database schema, migrations, drizzle config, generated files, package metadata, or UI files.
- Do not run or include drizzle/db migration changes in the PR.
- If a validation command fails because the environment database is missing tables, report that as an environment/setup note and do not change DB schema.
- Open a Pull Request against main when complete.
