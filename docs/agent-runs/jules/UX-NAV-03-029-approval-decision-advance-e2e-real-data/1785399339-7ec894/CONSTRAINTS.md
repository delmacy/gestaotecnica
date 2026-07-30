# Constraints

- Use Node.js 24.x for dependency install, tests, typecheck, build, and evidence commands; run `node --version` before implementation and record it in the task/PR evidence; if the environment starts on Node.js 20 or 22, first try to activate Node.js 24 with the available version manager (`nvm`, `fnm`, `volta`, `mise`, `asdf`) or a local non-destructive Node.js 24 install; only report a blocker if switching to Node.js 24 fails, and include every command attempted plus exact output.
- PR must target main.
- Before editing, sync with origin/main and record base SHA in PR evidence.
- Implement only this task and do not broaden scope.
- Do not weaken or delete existing tests.
- Do not introduce fake evidence or label synthetic data as real.
- No new explicit TypeScript `any` in new or changed code (`as any`, `: any`, `Array<any>`, `Record<string, any>`, `Promise<any>`, `any[]`, or `z.any()`). Use `unknown`, generics, discriminated unions, schema-derived types, or domain DTOs; if typing cannot be done safely inside scope, stop with a blocker instead of weakening types.
- Keep execution serial: do not release or start the next task until the previous task is terminal clean by state machine.
- Every implementation slice must preserve the through-line: database -> domain -> contract -> use case/API -> UI/navigation/actions -> validation evidence.
- Frontend may not invent mock data to compensate for missing backend contract; consume persisted data, official seed/fixture, or record an exact blocker.
- Each completed product slice must have a visible route/screen outcome and a real persistence/read path, unless the task explicitly records why that layer is not needed.
- Do not create database migrations unless this task explicitly discovers a blocking schema gap and documents it instead of applying it.
