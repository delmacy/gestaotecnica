# CL-02 Security Closeout

**Lane Status:** `blocked`

## Evidence

The security lane for CL-02 is blocked based on the findings documented in the security audit:
[Security Audit CL-02-009](../../operations/security-audit-CL-02-009.md)

## RBAC and Tenant Isolation Gaps

The security audit identified the following critical gaps preventing safe multi-tenant operation and RBAC enforcement:

1.  **Lack of Explicit Multitenancy/Workspace Context in Current Session (High Risk):** The session mechanism (`getCurrentUser`) does not retrieve or enforce any active `workspaceId` or `organizationId`. Tenant isolation is absent at the session layer, leading to high risk for cross-tenant data access if not manually verified on every database query.
2.  **Static Access Profiles Instead of Workspace-Aware Roles (High Risk):** The system relies on global static string enums (`"builder" | "admin" | "operador"`) evaluated via `canAccessRoute` and `requireAccessProfile`. There is no mechanism to check if a user holds a role within a specific workspace, allowing an `"admin"` in one workspace to potentially perform admin actions in another. The new roles and permissions in `src/db/runtime/schema/identity.ts` are disconnected from this primary authorization layer.
3.  **Database Queries in Modules/Features May Lack Workspace Isolation (Medium/High Risk):** While newer schemas require a `workspaceId`, legacy queries might not explicitly scope by it. Passing an arbitrary `workspaceId` via the API could allow access to another tenant's data due to the lack of systemic enforcement (like RLS or a mandatory middleware query filter).
4.  **Global Fallback in `canAccessRoute` (Low Risk):** The route authorization logic relies on simplistic path matching (e.g., exact matches or `startsWith`), which lacks protection against potential path traversal or unexpected URL structures that might bypass these checks.

## Recommendation

A follow-up CL-03 spike is recommended to comprehensively remediate these findings. The spike should focus on enforcing tenant isolation at both the session/middleware layer and the database layer (e.g., Row-Level Security), and migrating from static global profiles to workspace-aware roles integrated with the new identity schema.
