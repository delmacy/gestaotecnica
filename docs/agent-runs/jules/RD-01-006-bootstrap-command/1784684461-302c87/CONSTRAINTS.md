# Constraints

- PR must target main.
- Before editing, sync with origin/main and record base SHA in evidence.
- Implement only this task and do not broaden scope.
- Do not weaken or delete existing tests.
- Do not introduce fake evidence or label synthetic data as real.
- If a real environment/database is unavailable, fail with exact blocker evidence instead of mocking success.
- All readiness/status changes must be code-driven or state-machine driven, not manual interpretation.
- Application/runtime DATABASE_URL must not use a Postgres superuser role.
- Separate database credentials by purpose: owner/migration, app_runtime, app_readonly/reporting, seed/maintenance, and break_glass.
- Break-glass/superuser credentials may exist only for controlled migration, destructive maintenance, and emergency recovery; they must not be used by app runtime, tests, or demo paths.
- Any destructive DB operation must require an explicit maintenance script or runbook, scoped target, dry-run evidence, and audit log entry.
- Database grants must be least-privilege by schema/table/function and documented with revocation/rollback commands.
- Do not hardcode credentials, print secrets, or commit env values.
- Do not introduce explicit TypeScript `any` in new or changed code (`as any`, `: any`, `Array<any>`, `Record<string, any>`, `Promise<any>`, `any[]`, or `z.any()`). Use `unknown`, generics, discriminated unions, schema-derived types, or domain DTOs; if typing cannot be done safely inside scope, stop with a blocker instead of weakening types.
