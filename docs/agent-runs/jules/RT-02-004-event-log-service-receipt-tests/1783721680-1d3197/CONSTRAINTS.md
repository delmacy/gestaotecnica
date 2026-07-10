# Constraints

- Prefer a test-only PR; touch src/platform/events/event-log-service.ts only for a tiny helper/testability change if absolutely necessary.
- Do not edit, delete, stage, or include docs/** or docs/agent-runs/** files.
- No database schema changes.
- No migrations or drizzle-generated files.
- No package.json or package-lock.json changes.
- Do not edit event-types.ts.
- Do not implement real database idempotency or onConflictDoUpdate.
- PR must target main.
- Do not weaken or delete existing tests.
- Do not edit files outside the allowed files list.
