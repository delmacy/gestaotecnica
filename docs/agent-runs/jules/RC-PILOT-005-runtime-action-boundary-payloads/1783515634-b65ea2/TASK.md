# RC-PILOT-005-runtime-action-boundary-payloads - Runtime action boundary payload types

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
