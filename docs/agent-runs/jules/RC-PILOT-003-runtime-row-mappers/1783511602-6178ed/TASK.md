# RC-PILOT-003-runtime-row-mappers - Runtime repository row mappers

        You are Jules working in delmacy/gestaotecnica from GitHub main.

Task id: RC-PILOT-003-runtime-row-mappers
Title: Runtime repository row mappers
Risk: low

Objective:
Create pure row mapper helpers in runtime.repository.ts for ProcessInstanceRecord, ProcessPayloadRecord, and ActionExecutionRecord, including schema_version to schemaVersion mapping for process payload rows. Use those mappers in repository return paths.

Allowed files:
- src/features/workflow/runtime/runtime.repository.ts
- tests/unit/workflow-runtime-repository-mappers.test.ts

Forbidden files:
- src/features/workflow/runtime/runtime.types.ts
- src/features/workflow/runtime/runtime.validation.ts
- src/features/workflow/runtime/runtime.service.ts
- src/features/workflow/runtime/runtime-step.service.ts
- src/features/workflow/runtime/runtime.actions.ts
- src/db/**
- drizzle/**
- migrations/**
- package.json
- package-lock.json

Acceptance criteria:
- Repository exposes or internally uses pure mapper helpers.
- Process payload mapper maps schema_version to schemaVersion.
- New unit tests prove mapper output for process payload, process instance, and action execution rows.
- No query semantics or schema files are changed.

Required validation commands:
- npx tsx --test tests/unit/workflow-runtime-repository-mappers.test.ts
- npm run build

Operational rules:
- Keep the PR small and scoped to the allowed files.
- Do not modify database schema, migrations, drizzle config, generated files, package metadata, or UI files.
- Do not run or include drizzle/db migration changes in the PR.
- If a validation command fails because the environment database is missing tables, report that as an environment/setup note and do not change DB schema.
- Open a Pull Request against main when complete.
