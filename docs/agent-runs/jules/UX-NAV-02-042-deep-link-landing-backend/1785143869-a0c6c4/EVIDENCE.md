# Evidence: UX-NAV-02-042-deep-link-landing-backend

## Base Information
- **Base SHA**: `d025ebed059bdd1fe45ab882898da868779b3bab`
- **Node.js version**: `v24.18.0`

## Commands Run
\`\`\`bash
$ npm run check:architecture

> gestaotecnica@0.1.0 check:architecture
> npx tsx scripts/validate-architecture-rules.ts

=== Validação de Arquitetura do System Builder ===

Validando domínios obrigatórios:
✅ [OK] Domínio obrigatório encontrado: src/platform

Validando domínios futuros (geram warnings, não bloqueiam):

==================================================
✅ Validação de arquitetura aprovada!

$ npx tsx --test tests/platform/builder/contracts/deep-link-landing.test.ts
▶ Deep-link Landing Resolution
  ✔ Gate 1: routes to login when unauthenticated (1.715261ms)
  ✔ Gate 2: routes to target when authenticated and authorized (0.4803ms)
  ✔ Gate 3: routes to unauthorized when admin scope is required but role is not admin (0.358939ms)
  ✔ Gate 4: routes to not found path when entity is missing (0.584287ms)
✔ Deep-link Landing Resolution (5.346785ms)
ℹ tests 4
ℹ suites 1
ℹ pass 4
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 233.747983
\`\`\`

## User Flow
The backend deep-link landing resolution ensures proper routing and state hydration based on where the user entered from (external deep-link direct access).

1. **Where the user came from:** The user originates from an external source (email, browser bookmark, external system share) bypassing the standard entry funnel. They attempt direct access to a specific configuration detail or capability view.
2. **What they do here:** Our interception mechanism catches this request at `/api/builder/navigation/deep-link-landing`. We verify their authentication state, authorization mapping and their target entity's existence.
3. **Where they go next:**
    - If unauthenticated, we protect the system state and route them to log in with a URL-encoded `returnTo` payload (`/auth/login?returnTo=...`) so they don't lose context.
    - If properly authorized, we seamlessly hydrate the application context (e.g. Workspace selection) and provide them access to the requested URL directly.
    - If they do not have the required product authorization levels for that scope (e.g. trying to hit an admin endpoint with a builder role), we deny access and route them to the appropriate product dashboard (`/builder`).
    - If the requested configuration is unavailable or deleted, we provide a safe landing by dropping them to the related aggregate list (e.g. `/builder/capabilities`) to continue their work.
4. **How they return:** After successfully landing, since the standard UI chromes and Context are hydrated in state, the standard navigation paradigms (breadcrumbs, sidebar) are active, allowing them to traverse the system normally or step backwards from their deep-link.

## Blockers
- None.
