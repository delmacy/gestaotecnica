# PKG-ACTION-DESCRIPTOR-CONTRACT-001 - Action Descriptor Discovery Report

## Discovery

### Existing Assets

1.  **ActionDefinition (In-Memory)**: Located in `src/platform/actions/action-types.ts`. It includes the `handler` function directly and focuses on runtime registration.
2.  **ActionRegistry (Database)**: Located in `src/db/runtime/schema/workflow.ts` (table `action_registry`). Stores `key`, `name`, `description`, `input_schema`, and `output_schema`.
3.  **ProcessNode.actionKey**: Found in `src/platform/workflows/contracts/process-node-edge.ts`. Used as a reference to an action within a process.
4.  **Action Key Convention**: Real examples include `workspaces.update`, `organizations.create`, `schedules.create`, `work_items.transition`. All confirmed existing actions use a `prefix.action` format.

### Conflicts & Gaps

| Field | ActionDefinition (Current) | action_registry (DB) | ActionDescriptor (Proposed) | Status |
| :--- | :--- | :--- | :--- | :--- |
| `key` | `string` | `text` | `string` | Mandatory. |
| `name` | N/A (uses `uiLabel`) | `text` | `string` | Mandatory. |
| `handler` | `ActionHandler` (Function) | N/A | N/A | **Excluded (Not serializable).** |
| `handlerKey` | N/A | N/A | `string` | Mandatory (Decoupling identifier). |
| `inputSchema` | `ActionJsonSchema` | `jsonb` | `UnknownRecord` | Mandatory. |
| `outputSchema` | `ActionJsonSchema` | `jsonb` | `UnknownRecord` | Mandatory. |
| `version` | N/A | N/A | `number` | **Optional (Extension).** |
| `status` | N/A | N/A | enum | **Optional (Extension).** |
| `executionMode` | N/A | N/A | `sync` \| `async` | **Optional (Extension).** |
| `idempotent` | `boolean` | N/A | `boolean` | **Optional (Extension).** |
| `sideEffect` | N/A | N/A | enum | **Optional (Extension).** |
| `timeoutMs` | N/A | N/A | `number` | **Optional (Extension).** |

## Action Key Convention

The convention for `ActionDescriptorKey` is:
`^[a-z0-9_]+(?:\.[a-z0-9_]+)+$`
Example: `workspaces.update`, `crm.leads.convert`.
This matches 100% of the surveyed actions in the `src/modules/` and `src/platform/` directories.

## Separation of Concerns

- **ActionDescriptor**: Static metadata and I/O contract. Serializable.
- **ActionHandler**: The actual implementation logic (function). Never serialized. Linked via `handlerKey`.
- **ActionInstance**: The usage of an action in a workflow (references `descriptor.key`).
- **ActionExecution**: The runtime record of an action being run.

## Security & Integrity

The contract implements **Safe Traversal** for function detection in schemas:
- No prototype traversal.
- No getter execution.
- Cycle detection.
- Revoked proxy handling.
- Hostile property rejection.
