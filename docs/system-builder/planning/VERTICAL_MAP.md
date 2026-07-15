# Minimum Vertical System Builder Flow Contract Map

This document maps the minimum vertical System Builder flow from Client -> Workspace -> Capability -> Entity -> Form -> Process -> Publication -> Execution -> Timeline using existing contracts in the `gestaotecnica` repository.

## Map

1.  **Client**
    *   **Existing Files:** `src/features/builder/persistence/builder-publish.client.ts`, `src/features/builder/persistence/builder-save.client.ts`, `src/features/builder/persistence/builder-load.client.ts`
    *   **Gap Analysis:** Missing formal contract schema definition for standard client/frontend builder interactions, although client functions exist.

2.  **Workspace**
    *   **Existing Contract:** `WorkspaceContextSchema` in `src/platform/contracts/workspace.ts`
    *   **Gap Analysis:** No gap. Contract exists.

3.  **Capability**
    *   **Existing Contract:** `CapabilityItem` interface and related types (e.g., `CapabilityCategory`, `CapabilityStatus`) in `src/components/builder/capabilities/capability-types.ts`.
    *   **Gap Analysis:** The types are currently UI-centric interfaces, missing a canonical Zod schema in `src/platform/contracts/`.

4.  **Entity**
    *   **Existing Contract:** `identitySchema`, `usersTable`, `roles`, `permissions` in `src/db/runtime/schema/identity.ts` (Database schema representations).
    *   **Gap Analysis:** Missing a unified canonical Zod schema for a generic "Entity" or "Identity" context independent of the direct Drizzle DB schema in `src/platform/contracts/`.

5.  **Form**
    *   **Existing Contract:** `FormDefinitionSchema` in `src/platform/forms/contracts/form-definition.ts`
    *   **Gap Analysis:** No gap. Contract exists.

6.  **Process**
    *   **Existing Contract:** `ProcessDefinitionSchema`, `ProcessVersionSchema`, `ProcessDefinitionEnvelopeSchema` in `src/platform/workflows/contracts/process-definition.ts`
    *   **Gap Analysis:** No gap. Contract exists.

7.  **Publication**
    *   **Existing Contract:** `PublicationResultEnvelopeSchema` in `src/platform/workflows/contracts/process-definition.ts`, `PublishProcessVersionInput` / `PublishProcessVersionResult` in `src/features/workflow/definitions/process-definition-publication.types.ts`.
    *   **Gap Analysis:** No gap. Types and result envelopes exist.

8.  **Execution**
    *   **Existing Contract:** `ActionExecutionSchema` in `src/platform/workflows/runtime/types/action-execution.ts`
    *   **Gap Analysis:** No gap. Canonical schema exists.

9.  **Timeline**
    *   **Existing Contract:** `TimelineItem` interface in `src/platform/observability/application/timeline.service.ts`
    *   **Gap Analysis:** Types are defined within the service, missing a canonical Zod schema in `src/platform/contracts/` or `src/platform/observability/contracts/`.
