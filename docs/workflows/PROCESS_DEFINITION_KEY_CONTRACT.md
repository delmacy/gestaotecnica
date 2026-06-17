# Process Definition Key Contract

## Identification

* Protocol: `PKG-PROCESS-DEFINITION-KEY-CONTRACT-001`
* Status: `canonical`
* Scope: `workflows`

## Definition

The `ProcessDefinitionKey` is a standardized string identifier used across the workflow system to identify process definitions and nodes uniquely within their context.

### Schema

```ts
import { z } from "zod";

export const ProcessDefinitionKeySchema = z
  .string()
  .min(3)
  .max(100)
  .regex(/^[a-z](?:[a-z0-9]|-(?!-))*[a-z0-9]$/);

export type ProcessDefinitionKey = z.infer<typeof ProcessDefinitionKeySchema>;
```

### Constraints

| Rule | Description |
|------|-------------|
| Length | 3 to 100 characters |
| Starting character | Must start with a lowercase letter `[a-z]` |
| Allowed characters | Lowercase letters `[a-z]`, numbers `[0-9]`, and hyphens `-` |
| Hyphen placement | No leading hyphen, no trailing hyphen |
| Consecutive hyphens | No consecutive hyphens (e.g., `my--key` is invalid) |

## Usage

This contract is a leaf module to avoid circular dependencies between `ProcessDefinition` and `ProcessNode`.

- Location: `src/platform/workflows/contracts/process-definition-key.ts`
- Consumed by: `ProcessDefinitionSchema`, `ProcessNodeSchema`, `ProcessVersionSchema` (indirectly).
