# Boundaries: Human Resources Module

## Isolated Agent Scope
As Jules Dev HumanResourcesModule Isolated, I am restricted to working within the `src/modules/human-resources/` directory and related test files.

## Strict Prohibitions
- **Workforce Module:** Do not modify `src/modules/workforce/`.
- **Scheduling Module:** Do not modify `src/modules/schedules/` or related.
- **Auth Module:** Do not modify `src/modules/auth/` or `src/platform/auth/`.
- **Core Platform:** Do not modify `src/platform/kernel.ts`, `src/platform/actions/`, or `src/platform/modules.ts`.
- **Runtime Engine:** Do not modify `src/platform/runtime/`.
- **AppShell:** Do not modify `src/app/` (outside of potential module-specific routes if authorized).
- **Shared Migrations:** Do not modify `drizzle/` or `src/db/schema.ts`.
- **Kernel Central:** Do not modify the central kernel logic.

## Persistence Policy
- Do not use `process_candidates` as a definitive solution.
- Use `builder.process_candidates` as a temporary adapter to maintain domain decoupling and comply with isolation while dedicated persistence is not provisioned.
- Maintain strict `workspaceId` isolation for all operations.
