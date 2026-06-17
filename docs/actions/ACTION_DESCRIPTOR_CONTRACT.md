# Action Descriptor Contract

## Overview

The Action Descriptor contract (PKG-ACTION-DESCRIPTOR-CONTRACT-001) provides a canonical, serializable definition of an Action in the technical catalog. It decouples the metadata and I/O contract from the actual execution logic.

## Entities

### 1. Action Descriptor
- **Definition**: Metadata and I/O contract of an action.
- **Contract**: `ActionDescriptorSchema` (Zod).
- **Persistence**: Can be stored in database or registry.
- **Rules**: Must NOT contain executable functions.

### 2. Action Handler
- **Definition**: The executable logic (JavaScript/TypeScript function) that implements the action.
- **Key**: Linked to the descriptor via `handlerKey`.
- **Note**: Handlers are never serialized or persisted in the descriptor.

### 3. Action Instance
- **Definition**: The specific usage of an action within a workflow process node.
- **Reference**: Points to an `ActionDescriptor.key`.
- **Configuration**: Contains specific settings (config) for that usage.

### 4. Action Execution
- **Definition**: A runtime record of an action being invoked.
- **Data**: Includes input payload, output/result, status, error (if any), and timestamps.

## Schema Specification

The `ActionDescriptor` includes the following fields:

- `key`: Unique identifier (e.g., `crm.leads.create`).
- `name`: Human-readable name.
- `version`: Positive integer.
- `status`: Lifecycle state (`draft`, `published`, `deprecated`, `archived`).
- `inputSchema`: Zod-validated JSON schema for input.
- `outputSchema`: Zod-validated JSON schema for output.
- `handlerKey`: Reference to the implementation.
- `executionMode`: `sync` or `async`.
- `sideEffect`: `none`, `read`, `write`, or `external`.
- `idempotent`: Boolean indicating if the action can be safely retried.
- `timeoutMs`: Optional maximum execution time.
- `tags`: Optional array of unique descriptive tags.

## Implementation Details

- **Strictness**: The schema is strict and rejects unknown fields.
- **Function Prohibition**: Input and output schemas are checked to ensure they do not contain function-like values.
- **Key Convention**: Uses `namespace.action` format.
