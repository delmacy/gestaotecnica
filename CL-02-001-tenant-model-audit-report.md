# Tenant Model Audit

## Objective
Audit the tenant/workspace/account model for first commercial use.

## Review Findings

* **`organizations` Table:** Contains `id`, `key`, `name`, `status`, `metadata`, `createdAt`, `updatedAt`.
* **`workspaces` Table:** Contains `id`, `organizationId` (references `organizations.id`), `key`, `name`, `status`, `config`, `metadata`, `adaptationKey`, `createdAt`, `updatedAt`.
* **`workspace_members` Table:** Connects users to workspaces via `workspaceId` and `userId` (implicitly referencing `identity.users.id`). Contains `status`, `joinedAt`.
* **`users` Table (Identity schema):** Contains `id`, `email`, `name`, `status`, `createdAt`, `updatedAt`.
* **Data Isolation:** All multi-tenant data structures, such as `dynamic_records`, `entity_definitions`, and workflow data, use a `workspace_id` reference to maintain isolation between workspaces.

## Conclusions
The current models provide a standard multi-tenant architecture:
* Users belong to Workspaces through `workspace_members`.
* Workspaces belong to Organizations.
* The structure supports proper data isolation via the `workspace_id` foreign key relationships on resources.
* No changes are strictly necessary for the first commercial use based on the current explicit constraints. The model supports standard RBAC and multi-tenancy requirements.
