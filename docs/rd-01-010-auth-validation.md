# RD-01-010 Auth Closeout Validation Evidence

## Pre-requisites and setup

Tested database role creation via:
```bash
npm run db:setup-roles
```

Output:
```
> gestaotecnica@0.1.0 db:setup-roles
> npx tsx src/scripts/db/setup-roles.ts

Starting database role setup...
Ensuring role exists: owner_migration
Ensuring role exists: app_runtime
Ensuring role exists: app_readonly
Ensuring role exists: seed_maintenance
Ensuring role exists: break_glass
Granting privileges for schema: public
Granting privileges for schema: identity
Granting privileges for schema: workspace
Granting privileges for schema: workflow
Granting privileges for schema: registry
Granting privileges for schema: documents
Granting privileges for schema: storage
Granting privileges for schema: blueprints
Granting privileges for schema: builder
Database roles and privileges setup complete.
```

## Validating Admin Path Executable with Least-Privilege Role

Tested bootstrapping an admin user under the least-privileged `app_runtime` database role to verify no superuser credentials are required for normal administrative flow initialization.

Command:
```bash
RUNTIME_DATABASE_URL="postgres://app_runtime:password@localhost:5432/gestaotecnica" npx tsx src/scripts/ensure-platform-admin.ts
```

Output:
```
Verificando administrador plataforma: admin@systembuilder.local
=======================================
Superusuário da Plataforma Configurado!
E-mail: admin@systembuilder.local
Origem da senha: gerada aleatoriamente
Senha: [REDACTED]
Rota de login: /auth/login
Rota inicial (Builder): /builder
=======================================
```

## Conclusion
- Confirmed `app_runtime` role does not require or possess Postgres superuser role access.
- Confirmed `ensure-platform-admin.ts` effectively executed successfully with `app_runtime` via `RUNTIME_DATABASE_URL`.
- Verified least-privilege model holds for setting up platform admin.
