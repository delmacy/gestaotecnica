# Runtime Core Pilot — Jules Task Queue

Canonical task queue for the lean Codex/Jules/OpenCode flow.

## Operating Model

- Codex is the task manager and final gate.
- Jules executes one task at a time and opens PRs against `main`.
- OpenCode reviews/tests PRs and produces advisory verdicts.
- No database schema, migrations, Drizzle-generated files, UI, or package metadata are in scope for this pilot.
- If DB tables are missing during validation, use DB setup only as environment preparation; do not include DB changes in PRs.

## Queue

### 1. `RC-PILOT-001-runtime-payload-types` — Runtime payload public types

- Status in supervisor: `jules_running`
- Jules session: `7869268898033625061`
- Order: `100`

```text
You are Jules working in delmacy/gestaotecnica from GitHub main.

Task id: RC-PILOT-001-runtime-payload-types
Title: Runtime payload public types
Risk: low

Objective:
Create/export RuntimePayload = Record<string, unknown> in runtime.types.ts and replace public runtime payload fields that currently use Record<string, any>. Preserve runtime behavior.

Allowed files:
- src/features/workflow/runtime/runtime.types.ts

Forbidden files:
- src/features/workflow/runtime/runtime.validation.ts
- src/features/workflow/runtime/runtime.repository.ts
- src/features/workflow/runtime/runtime.service.ts
- src/features/workflow/runtime/runtime-step.service.ts
- src/features/workflow/runtime/runtime.actions.ts
- src/db/**
- drizzle/**
- migrations/**
- tests/**
- package.json
- package-lock.json

Acceptance criteria:
- RuntimePayload is exported from runtime.types.ts.
- No Record<string, any> remains in runtime.types.ts.
- Existing public type names remain exported.
- No files outside allowed scope are changed.

Required validation commands:
- npm run build

Operational rules:
- Keep the PR small and scoped to the allowed files.
- Do not modify database schema, migrations, drizzle config, generated files, package metadata, or UI files.
- Do not run or include drizzle/db migration changes in the PR.
- If a validation command fails because the environment database is missing tables, report that as an environment/setup note and do not change DB schema.
- Open a Pull Request against main when complete.
```

### 2. `RC-PILOT-002-runtime-validators` — Runtime payload validators

- Status in supervisor: `ready`
- Order: `200`

```text
You are Jules working in delmacy/gestaotecnica from GitHub main.

Task id: RC-PILOT-002-runtime-validators
Title: Runtime payload validators
Risk: low

Objective:
Replace z.any() with z.unknown() for runtime payload schemas and add focused unit tests for arbitrary object payloads and invalid UUID rejection.

Allowed files:
- src/features/workflow/runtime/runtime.validation.ts
- tests/unit/workflow-runtime-validation.test.ts

Forbidden files:
- src/features/workflow/runtime/runtime.types.ts
- src/features/workflow/runtime/runtime.repository.ts
- src/features/workflow/runtime/runtime.service.ts
- src/features/workflow/runtime/runtime-step.service.ts
- src/features/workflow/runtime/runtime.actions.ts
- src/db/**
- drizzle/**
- migrations/**
- package.json
- package-lock.json

Acceptance criteria:
- No z.any() remains in runtime.validation.ts.
- New unit test covers valid arbitrary payload object parsing.
- New unit test covers invalid UUID rejection for a runtime input.
- No database/schema files are changed.

Required validation commands:
- npx tsx --test tests/unit/workflow-runtime-validation.test.ts
- npm run build

Operational rules:
- Keep the PR small and scoped to the allowed files.
- Do not modify database schema, migrations, drizzle config, generated files, package metadata, or UI files.
- Do not run or include drizzle/db migration changes in the PR.
- If a validation command fails because the environment database is missing tables, report that as an environment/setup note and do not change DB schema.
- Open a Pull Request against main when complete.
```

### 3. `RC-PILOT-003-runtime-row-mappers` — Runtime repository row mappers

- Status in supervisor: `ready`
- Order: `300`

```text
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
```

### 4. `RC-PILOT-004-runtime-repository-update-types` — Runtime repository update typing

- Status in supervisor: `ready`
- Order: `400`

```text
You are Jules working in delmacy/gestaotecnica from GitHub main.

Task id: RC-PILOT-004-runtime-repository-update-types
Title: Runtime repository update typing
Risk: low

Objective:
Replace const updateData: any in updateActionExecutionStatus with an explicit partial update type compatible with the current actionExecutions update shape. Preserve the existing update behavior and where clauses.

Allowed files:
- src/features/workflow/runtime/runtime.repository.ts

Forbidden files:
- src/features/workflow/runtime/runtime.types.ts
- src/features/workflow/runtime/runtime.validation.ts
- src/features/workflow/runtime/runtime.service.ts
- src/features/workflow/runtime/runtime-step.service.ts
- src/features/workflow/runtime/runtime.actions.ts
- src/db/**
- drizzle/**
- migrations/**
- tests/**
- package.json
- package-lock.json

Acceptance criteria:
- No updateData: any remains in runtime.repository.ts.
- updateActionExecutionStatus still conditionally sets outputPayload, error, and finishedAt only when provided.
- No query where clauses are changed.
- No schema/migration files are changed.

Required validation commands:
- npm run build

Operational rules:
- Keep the PR small and scoped to the allowed files.
- Do not modify database schema, migrations, drizzle config, generated files, package metadata, or UI files.
- Do not run or include drizzle/db migration changes in the PR.
- If a validation command fails because the environment database is missing tables, report that as an environment/setup note and do not change DB schema.
- Open a Pull Request against main when complete.
```

### 5. `RC-PILOT-005-runtime-action-boundary-payloads` — Runtime action boundary payload types

- Status in supervisor: `ready`
- Order: `500`

```text
You are Jules working in delmacy/gestaotecnica from GitHub main.

Task id: RC-PILOT-005-runtime-action-boundary-payloads
Title: Runtime action boundary payload types
Risk: low

Objective:
Update runtime.actions.ts server action payload parameters to use RuntimePayload while keeping the current mocked workspace/user behavior unchanged.

Allowed files:
- src/features/workflow/runtime/runtime.actions.ts

Forbidden files:
- src/features/workflow/runtime/runtime.types.ts
- src/features/workflow/runtime/runtime.validation.ts
- src/features/workflow/runtime/runtime.repository.ts
- src/features/workflow/runtime/runtime.service.ts
- src/features/workflow/runtime/runtime-step.service.ts
- src/db/**
- drizzle/**
- migrations/**
- tests/**
- package.json
- package-lock.json

Acceptance criteria:
- No Record<string, any> remains in runtime.actions.ts.
- RuntimePayload is imported from runtime.types.ts.
- Workspace/user mock constants remain unchanged.
- No runtime.server.ts is created.
- No DB/schema files are changed.

Required validation commands:
- npm run build

Operational rules:
- Keep the PR small and scoped to the allowed files.
- Do not modify database schema, migrations, drizzle config, generated files, package metadata, or UI files.
- Do not run or include drizzle/db migration changes in the PR.
- If a validation command fails because the environment database is missing tables, report that as an environment/setup note and do not change DB schema.
- Open a Pull Request against main when complete.
```

## Gate

- Per-task validation follows each task prompt.
- Final batch gate: `npm run test:unit` and `npm run build`.
- PRs outside `main` must be closed and retried.
- PRs that touch forbidden files must be sent back to Jules or closed.
