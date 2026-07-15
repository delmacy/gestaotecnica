# Persistence and Multi-Tenancy Gap Audit

## 1. Context and Objective
This audit evaluates the persistence and multi-tenancy boundaries required for the minimum vertical flow (Client -> Workspace -> Capability -> Entity -> Form -> Process -> Publication -> Execution -> Timeline). The focus is specifically on identifying gaps related to Client/Workspace ownership, schema boundaries, and safe draft/publication storage.

## 2. Multi-Tenancy Boundary Audit

The architecture dictates a strict separation: Platform schemas are global, while Runtime schemas are isolated per workspace (multi-tenant).
A review of the `src/db/` directory confirms this split:
- **Platform schemas** (`src/db/platform/schema/`) house global configurations like `registry.ts` and `blueprints.ts`.
- **Runtime schemas** (`src/db/runtime/schema/`) house operational data like `workspace.ts`, `workflow.ts`, and `traceability.ts`.

### Gaps Identified in Multi-Tenancy Boundaries:
- **Platform Schema Leakage**: Found `workspaceId` definitions inside Platform schemas (`src/db/platform/schema/candidates.ts`, `src/db/platform/schema/workflow.ts`). This is an architectural violation since Platform schemas should be global and not bound to a specific workspace ID unless explicitly modeling cross-workspace mapping (which these do not appear to be).
- **Runtime Enforcement**: While all tables in `src/db/runtime/schema/workflow.ts` correctly include `workspaceId` (e.g., `processDefinitions`, `flowDefinitions`, `processInstances`), reliance solely on application-level filtering without PostgreSQL Row-Level Security (RLS) is vulnerable to "Data Bleed," as noted in historical audits ([AUDITORIA_ARQUITETURA.md](../../archive/audits/AUDITORIA_ARQUITETURA.md)).

## 3. Safe Draft and Publication Storage Audit

The workflow system requires safe transition mechanisms from draft modifications to published, immutable versions.

### Gaps Identified in Draft/Publication Storage:
- **State Coupling**: In `src/db/runtime/schema/workflow.ts`, the `process_versions` and `flow_definitions` tables handle status management via a simple `status` text column defaulting to `"draft"`.
- **Mutation Risks**: Draft definitions and published versions currently share the same table structures without explicit database-level immutability constraints for "published" records. This creates a risk where active publications could be inadvertently mutated by draft saves.
- **Client Client-Side vs DB Alignment**: The frontend UI contracts (`src/features/builder/persistence/builder-publish.client.ts`) assume a clean separation when transitioning an item to "published", but the database schema doesn't strictly enforce immutability post-publication.

## 4. Capability and Entity Ownership

- **Capability Mapping**: Capabilities are defined in the Platform registry (`src/db/platform/schema/registry.ts`). However, there is no explicit intersection table linking an active Capability to a specific Workspace in the Runtime schema (e.g., `workspace_capabilities`). This prevents fine-grained, workspace-level capability enablement.
- **Entity Definitions**: Entity definitions exist in `src/db/runtime/schema/workspace.ts` with correct `workspaceId` boundaries, but lack clear relationships to specific blueprints or capabilities that generated them.

## 5. Next Steps / Recommendations

1. **Schema Correction (Platform vs Runtime)**: Remove `workspaceId` columns from `src/db/platform/` schemas where they violate the global boundary.
2. **Immutability Mechanisms**: Introduce application or database-level constraints (e.g., triggers) to prevent modification of `process_versions` once marked as published.
3. **Capability Provisioning**: Design a `workspace_capabilities` schema in the Runtime boundary to explicitly manage module/capability subscriptions per workspace.
4. **Row-Level Security (RLS)**: Schedule an initiative to implement Postgres RLS for all `src/db/runtime/` tables to enforce the `workspaceId` multi-tenancy filter at the database engine level.

*(Note: No schema or code changes are executed in this audit task, following strict constraints).*
