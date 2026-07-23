# Constraints

- PR must target main.
- Before editing, sync with origin/main and record base SHA in evidence.
- Implement only this task and do not broaden scope.
- Do not weaken or delete existing tests.
- Do not introduce fake evidence or label synthetic data as real.
- No new explicit TypeScript `any` in new or changed code (`as any`, `: any`, `Array<any>`, `Record<string, any>`, `Promise<any>`, `any[]`, or `z.any()`). Use `unknown`, generics, discriminated unions, schema-derived types, or domain DTOs; if typing cannot be done safely inside scope, stop with a blocker instead of weakening types.
- Keep execution serial: do not release or start the next task until the previous task is terminal clean by state machine.
- Frontend tasks must not invent mock data to compensate for missing backend contract; consume the contract, official fixture/seed, or record a blocker.
- Do not change authentication, database privileges, or route protection semantics unless the task explicitly says so.
