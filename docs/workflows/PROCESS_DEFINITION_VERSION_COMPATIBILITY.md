# Process Definition Version Compatibility

## Overview
This document inventories the fields involved in process definition compatibility checks and describes how the runtime evaluates compatibility against the underlying platform blueprints.

## Fields in `ProcessDefinition`
The `ProcessDefinitionSchema` in `src/platform/workflows/contracts/process-definition.ts` provides the structural foundation for compatibility metadata:
- `blueprintKey: string` (optional): Connects a process definition to a system blueprint.
- `blueprintVersion: integer` (optional): Stores the exact blueprint version that was used to generate or validate the workflow graph.

## Compatibility Check Model
When the runtime or system builder needs to evaluate if an existing process version remains compatible with the current active platform blueprint, it relies on the standard `BlueprintCompatibilityCheckResultEnvelopeSchema` defined in `src/platform/blueprints/contracts/blueprint-compatibility-check-result-envelope.ts`.

### Payload Structure
| Property | Type | Description |
| :--- | :--- | :--- |
| `compatible` | `boolean` | `true` if the process graph semantics align with the blueprint constraints. |
| `warnings` | `string[]` | Array of non-blocking messages (e.g., deprecated node types). |
| `blockers` | `string[]` | Array of critical errors preventing execution (e.g., missing required inputs). |

## Inventory Findings
Currently, the data types and contracts exist on both sides (Workflow and Blueprint), but a formalized service implementation mapping one to the other is absent. The system can store the origin reference (`blueprintKey` + `blueprintVersion`), and it has a canonical envelope to return the validation result, but the runtime lacks a concrete bridge to invoke this check natively.
