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
- **Relationship**: The `handlerKey` in the descriptor matches the `key` property in the `ActionDefinition` registered in memory.

### 3. Action Instance
- **Definition**: The specific usage of an action within a workflow process node.
- **Reference**: Points to an `ActionDescriptor.key`.
- **Configuration**: Contains specific settings (config) for that usage.

### 4. Action Execution
- **Definition**: A runtime record of an action being invoked.
- **Data**: Includes input payload, output/result, status, error (if any), and timestamps.

## Schema Specification

The `ActionDescriptor` includes the following fields:

### Mandatory
- `key`: Unique identifier using qualified naming (e.g., `crm.leads.create`).
- `name`: Human-readable name.
- `handlerKey`: Reference to the implementation.
- `inputSchema`: JSON-serializable schema for input validation.
- `outputSchema`: JSON-serializable schema for output validation.

### Optional (Future Extensions)
- `version`: Positive integer.
- `status`: Lifecycle state (`draft`, `published`, `deprecated`, `archived`).
- `executionMode`: `sync` or `async`.
- `sideEffect`: `none`, `read`, `write`, or `external`.
- `idempotent`: Boolean indicating if the action can be safely retried.
- `timeoutMs`: Maximum execution time.
- `tags`: Array of unique descriptive tags.

## Implementation Details

- **Strictness**: The schema is strict and rejects unknown fields.
- **Safe Traversal**: Input and output schemas are checked using safe property traversal to ensure they do not contain functions, avoiding prototype traversal or getter execution.
- **Key Convention**: Requires at least one dot to encourage namespacing/qualification (e.g., `module.action`).
