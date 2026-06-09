1. **Database changes**:
   - Update `src/db/legacy/schema.ts` to add `accessProfileEnum` ("builder", "admin", "operador").
   - Update `users` table in `src/db/legacy/schema.ts` to include `accessProfile` using `accessProfileEnum`. Set default value to "operador".
   - Create a Drizzle migration using `npm run db:generate` to apply the changes.

2. **Auth Domain**:
   - Create `src/modules/auth/access-profiles.ts` to define the enum `AccessProfile` and helper functions:
     - `getDefaultRouteForProfile(profile: AccessProfile): string`
     - `canAccessRoute(profile: AccessProfile, pathname: string): boolean`
   - Create `src/modules/auth/authorization.ts` with helper functions:
     - `requireCurrentUser()`
     - `requireAccessProfile(allowedProfiles: AccessProfile[])`
   - Update `src/modules/auth/session.ts` to fetch `accessProfile` along with user details in `getCurrentUser()`.

3. **Auth Actions**:
   - Update `src/modules/auth/actions.ts`:
     - `setupFirstAdmin` should create a user with `accessProfile = "builder"`.
     - `setupFirstAdmin` and `login` should redirect the user based on `getDefaultRouteForProfile(accessProfile)` after successful auth.

4. **Proxy**:
   - Update `src/proxy.ts` to continue protecting by cookie, but add comments/documentation indicating that specific routes must call `requireCurrentUser()` and `requireAccessProfile()`.
   - Update `src/components/layout/AppShell.tsx` if possible to use `getCurrentUser()` and only show menu items available to the user. Note: I will just use server actions/guards at the page level for admin routes if layout update is too invasive.

5. **Server-side Guards**:
   - Add `await requireAccessProfile(["builder"])` to `src/app/admin/layout.tsx` (or `page.tsx` of admin pages).
   - Add `await requireAccessProfile(["admin", "operador"])` or specific to `src/app/operations/layout.tsx` (if exists).

6. **Tests**:
   - Create `tests/unit/auth-access-profiles.test.ts` for unit testing the routing logic.
   - Create `tests/integration/auth-login.integration.test.ts` to test login and session creation.
   - Create `tests/e2e/auth-login-profiles.spec.ts` for E2E testing of the login flows.

7. **Documentation**:
   - Create `docs/phases/AUTH_01.md` with the required contents.
   - Update `docs/00-current/NEXT_PHASE.md`, `docs/00-current/WORK_BOARD.md`, `docs/00-current/STATUS_DAS_FASES.md`, and `docs/00-current/DECISOES_ATIVAS.md` to indicate Phase 30B is paused and AUTH-01 is complete.

8. **Pre-commit and Verification**:
   - Follow pre-commit instructions to ensure everything is solid.
   - Verify all tests pass, build succeeds, and lint passes.
