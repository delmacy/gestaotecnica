# UX-NAV-04-001 Builder persistence foundation

This task successfully implements the database/persistence foundation for the Builder identity, organization portfolio, and durable workspace selection product slice.

- Route/Screen/Action affected: `/builder` and the workspace selection switch that spans the navigation context.
- Database/persistence objects added: `builderWorkspaceSelections` table in the `builder` schema inside `src/db/runtime/schema/builder.ts` that relies on and maps to authenticated sessions (`userId`), enforcing workspace membership per the PR requirements.
- API/use case binding added: `resolveBuilderIdentity`, `resolveBuilderPortfolio`, `persistWorkspaceSelection`, and `resolveSelectedWorkspace` at `src/lib/builder-persistence.ts`.
- Tests added: `tests/integration/ux-nav-04-001-builder-persistence.integration.test.ts`.

Reproducible verification command:
```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agent_work_test"
export PLATFORM_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agent_work_test"
export RUNTIME_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agent_work_test"
npx tsx --test tests/integration/ux-nav-04-001-builder-persistence.integration.test.ts
```

```
Node.js:
v24.19.0
```
```
Base SHA:
d6c0206aebdbf93142b38867a454651df5243923
```
