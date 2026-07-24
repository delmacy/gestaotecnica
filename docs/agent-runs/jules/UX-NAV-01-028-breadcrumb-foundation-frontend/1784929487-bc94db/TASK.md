# UX-NAV-01-028-breadcrumb-foundation-frontend - Breadcrumb and hierarchy foundation - Frontend experience

        Task UX-NAV-01-028-breadcrumb-foundation-frontend: Breadcrumb and hierarchy foundation - Frontend experience

Repository: delmacy/gestaotecnica
Base branch: main
Execution model: SERIAL ONLY - one Jules task at a time
Pipeline stage: Frontend experience
Sprint: UX-NAV-01 - Navigation IA and Global Menu Foundation

Objective:
Implement the user-facing route/menu/flow experience against the agreed contract, without inventing new backend behavior. Focus area: Breadcrumb and hierarchy foundation.

Allowed files only:
- src/app/**
- src/components/**
- docs/**
- tests/**

Dependencies:
- UX-NAV-01-027-breadcrumb-foundation-backend

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
- Pipeline discipline is respected: this task completes only the frontend experience stage for Breadcrumb and hierarchy foundation.
