# UX-NAV-01-037-empty-state-taxonomy-backend - Empty and unavailable state taxonomy - Backend/data binding

        Task UX-NAV-01-037-empty-state-taxonomy-backend: Empty and unavailable state taxonomy - Backend/data binding

Repository: delmacy/gestaotecnica
Base branch: main
Execution model: SERIAL ONLY - one Jules task at a time
Pipeline stage: Backend/data binding
Sprint: UX-NAV-01 - Navigation IA and Global Menu Foundation

Objective:
Implement or expose the minimal real data/API/server-action support required by the agreed contract, without UI scope creep. Focus area: Empty and unavailable state taxonomy.

Allowed files only:
- src/app/api/**
- src/db/**
- src/modules/**
- src/platform/**
- src/scripts/**
- docs/**
- tests/**

Dependencies:
- UX-NAV-01-036-empty-state-taxonomy-contract

Constraints:
- PR must target main.
- Before editing, sync with origin/main and record base SHA in evidence.
- Implement only this task and do not broaden scope.
- Do not weaken or delete existing tests.
- Do not introduce fake evidence or label synthetic data as real.
- No new explicit TypeScript `any` in new or changed code (`as any`, `: any`, `Array<any>`, `Record<string, any>`, `Promise<any>`, `any[]`, or `z.any()`). Use `unknown`, generics, discriminated unions, schema-derived types, or domain DTOs; if typing cannot be done safely inside scope, stop with a blocker instead of weakening types.
- Keep execution serial: do not release or start the next task until the previous task is terminal clean by state machine.
- Frontend tasks must not invent mock data to compensate for missing backend contract; consume the contract, official fixture/seed, or record a blocker.
- Do not change authentication, database privileges, or route protection semantics unless the task explicitly says so.

Acceptance criteria:
- The work explicitly answers: where the user came from, what they do here, where they go next, and how they return.
- Empty, blocked, demo, synthetic, and real-data states have distinct user-facing outcomes.
- User-facing language is commercial/product oriented, not implementation-training oriented.
- Navigation remains responsive and accessible on desktop and mobile.
- Focused tests or documented validation evidence are included in the PR.
- PR body includes base SHA, commands run, screenshots or route evidence where relevant, and any honest blockers.
- Pipeline discipline is respected: this task completes only the backend/data binding stage for Empty and unavailable state taxonomy.
