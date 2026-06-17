# PKG-ACTION-DESCRIPTOR-CONTRACT-001 - Action Descriptor Discovery Report

## Discovery

### Existing Assets

1.  **ActionDefinition (In-Memory)**: Located in `src/platform/actions/action-types.ts`. It includes the `handler` function directly and focuses on runtime registration.
2.  **ActionRegistry (Database)**: Located in `src/db/runtime/schema/workflow.ts` (table `action_registry`). Stores `key`, `name`, `description`, `input_schema`, and `output_schema`.
3.  **ProcessNode.actionKey**: Found in `src/platform/workflows/contracts/process-node-edge.ts`. Used as a reference to an action within a process.
4.  **Action Key Convention**: Real examples include `workspaces.update`, `organizations.update`, `schedules.create`. The convention appears to be `namespace.action_name` or `module.action`.

### Conflicts & Gaps

| Field | ActionDefinition (Current) | action_registry (DB) | ActionDescriptor (Proposed) | Conflict/Note |
| :--- | :--- | :--- | :--- | :--- |
| `key` | `string` | `text` | `string` | Mandatory across all. |
| `name` | N/A (uses `uiLabel`) | `text` | `string` | descriptor uses `name`. |
| `handler` | `ActionHandler` (Function) | N/A | N/A | **Descriptor MUST NOT contain functions.** |
| `handlerKey` | N/A | N/A | `string` | New field to decouple handler execution from definition. |
| `version` | N/A | N/A | `number` | New field for lifecycle management. |
| `status` | N/A | N/A | enum | New field for lifecycle management. |
| `inputSchema` | `ActionJsonSchema` | `jsonb` | `Record<string, unknown>` | Standardization to canonical platform contracts. |
| `executionMode` | N/A | N/A | `sync` \| `async` | New field. Evidence for "async" actions exists in remote actions. |
| `idempotent` | `boolean` | N/A | `boolean` | Present in `ActionDefinition`, needs to be in Descriptor. |
| `sideEffect` | N/A | N/A | enum | New field. |
| `timeoutMs` | N/A | N/A | `number` | New field. |

## Action Key Convention

The convention for `ActionDescriptorKey` will be:
`^[a-z0-9_]+(?:\.[a-z0-9_]+)+$`
Example: `workspaces.update`, `crm.leads.convert`.
This is compatible with `ProcessNode.actionKey` which is currently a non-empty string.

## Separation of Concerns

- **ActionDescriptor**: Static metadata and I/O contract. Serializable.
- **ActionHandler**: The actual implementation logic (function). Never serialized.
- **ActionInstance**: The usage of an action in a workflow (references `descriptor.key` and provides `config`).
- **ActionExecution**: The runtime record of an action being run (input, output, status, timestamps).
