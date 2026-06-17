# Action Descriptor Registry Bridge (PKG-ACTION-DESCRIPTOR-REGISTRY-BRIDGE-001)

The Action Descriptor Registry Bridge provides compatibility between the declarative `ActionDescriptor` and the executable `ActionDefinition` managed by the `ActionRegistry`.

## Purpose

- **Compatibility**: Allows legacy `ActionDefinition` instances to be used where `ActionDescriptor` is required.
- **Verification**: Provides tools to ensure a descriptor is compatible with its executable implementation.
- **Cataloging**: Enables the generation of deterministic snapshots of the action catalog for technical documentation and registry synchronization.

## Public API

### `toActionDescriptor(definition: ActionDefinition): ActionDescriptor`

Converts an executable `ActionDefinition` into a persistible `ActionDescriptor`.

- Maps `uiLabel` to `name`.
- Maps `description` or `uiDescription` to `description` (truncated to 2000 chars).
- Reuses `key` as `handlerKey`.
- Ensures schema safety and structural integrity.

### `validateDescriptorAgainstDefinition(descriptor, definition): ActionDescriptorCompatibilityReport`

Validates that a descriptor correctly represents a definition.

- Checks for key mismatches.
- Enforces `handlerKey` identity policy.
- Verifies schema safety (no functions, no accessors).
- Performs structural comparison of input/output schemas.

### `createActionCatalogSnapshot(definitions: readonly ActionDefinition[]): ActionDescriptor[]`

Creates a deterministic, sorted list of descriptors from a collection of definitions. Useful for generating snapshots.

## Policies

### handlerKey Policy

The `handlerKey` in `ActionDescriptor` MUST be identical to the `key` of the `ActionDefinition`. This ensures that the technical catalog can correctly identify and link to the executable handler in memory without inventing new aliases or mapping layers.

### Safety and Immutability

- The bridge never executes the `handler` function.
- Input definitions are treated as immutable and never modified.
- All schemas are verified for safety to prevent execution of hostile code (getters, etc.) during serialization.
