# Security Audit - CL-02-009

## Objective

Run a focused auth/multitenancy security audit and record findings. The scope of this audit covers session handling, tenant isolation, and role enforcement.

## Scope Evaluated

- `src/modules/auth/access-profiles.ts`
- `src/modules/auth/authorization.ts`
- `src/modules/auth/session.ts`
- `src/db/runtime/schema/workspace.ts`
- `src/db/runtime/schema/identity.ts`
- `src/db/legacy/schema.ts`

## Findings

### Finding 1: Lack of Explicit Multitenancy/Workspace Context in Current Session

**Evidence**: `src/modules/auth/session.ts` (Lines 1-32)
**Description**: The `getCurrentUser` function retrieves the current session using `authSessions` and `users` from `src/db/legacy/schema`. It does not retrieve or enforce any active `workspaceId` or `organizationId` tied to the current session.
**Risk Rating**: **High**
**Conclusion**: Any request executing operations strictly based on `getCurrentUser` will not inherently have tenant context. Developers must pass `workspaceId` explicitly from other sources (e.g., path parameters) which introduces high risk for cross-tenant data access if not manually verified on every database query. Tenant isolation is not enforced at the session layer.

### Finding 2: Static Access Profiles Instead of Workspace-Aware Roles

**Evidence**: `src/modules/auth/access-profiles.ts`
**Description**: The system relies on static global string enums for authorization (`"builder" | "admin" | "operador"`). These profiles are evaluated in a global context via `canAccessRoute` and `requireAccessProfile`. There is no mechanism checking if the user holds this role _within a specific workspace_.
**Risk Rating**: **High**
**Conclusion**: If a user is an `"admin"` in Workspace A, the current global profile check may allow them to perform admin actions in Workspace B (if they can somehow bypass the UI or guess URLs), provided the backend queries do not strictly enforce `workspaceId` ownership. The new `src/db/runtime/schema/identity.ts` includes `roles` and `permissions`, but they are currently disconnected from the primary authorization layer (`requireAccessProfile`).

### Finding 3: Database Queries in Modules/Features May Lack Workspace Isolation

**Evidence**: Broad observation across the codebase via `workspaceId` usage.
**Description**: While newer runtime schemas (e.g., `src/db/runtime/schema/workflow.ts`, `documents.ts`) require a `workspaceId`, legacy queries might not explicitly scope by `workspaceId`. Since the session does not provide a trusted `workspaceId`, passing an arbitrary `workspaceId` via the API could allow access to another tenant's data.
**Risk Rating**: **Medium / High** (depending on the specific module)
**Conclusion**: A systematic enforcement of `workspaceId` (such as RLS in Postgres or a mandatory middleware query filter) is missing. This leaves tenant isolation up to the developer to implement on a per-query basis.

### Finding 4: Global Fallback in `canAccessRoute`

**Evidence**: `src/modules/auth/access-profiles.ts` (Lines 15-46)
**Description**: `canAccessRoute` explicitly grants access to paths based on string matching. However, there's no protection against path traversal or unexpected URL structures that might bypass these prefix checks if Next.js routing allows it.
**Risk Rating**: **Low**
**Conclusion**: The route authorization logic is simplistic and relies heavily on exact path matches or `startsWith`. Consider migrating to a robust middleware solution that evaluates paths based on robust pattern matching and standardizes workspace ID extraction from the URL.

## Summary

The current system architecture demonstrates a high risk regarding multitenancy and tenant isolation. The primary authorization and session mechanisms are legacy and operate on a global level, oblivious to the concept of a `workspaceId`. Significant remediation is required to fully enforce tenant isolation at both the session/middleware layer and the database layer before the platform can safely support true multitenancy.
