# Safe JSON Contract (PKG-SAFE-JSON-CONTRACT-001)

## Overview
The Safe JSON contract provides types, validation functions, and Zod schemas to ensure that JSON-like values are safe for serialization and transmission. It protects the platform against common security vulnerabilities related to object introspection, such as prototype pollution, unexpected code execution through getters, and infinite recursion via cycles.

## Types
- `SafeJsonPrimitive`: `null`, `string`, `boolean`, or finite `number`.
- `SafeJsonValue`: A recursive type representing any safe JSON-compatible value.
- `SafeJsonArray`: An array of `SafeJsonValue`.
- `SafeJsonRecord`: A plain object (prototype is `Object.prototype` or `null`) with string keys and `SafeJsonValue` values.

## Security Policies
The validation logic (`checkSafeJsonValue`) enforces the following strict security policies:

1. **Introspection Safety**: All object inspections are wrapped in `try/catch` to handle hostile or revoked proxies safely.
2. **No Prototype Traversal**: Only "own" properties are inspected. Prototype chain is ignored.
3. **No Code Execution**: Properties with getters or setters (accessors) are strictly rejected to prevent side effects during validation.
4. **Cycle Rejection**: Infinite recursion is prevented using an active path set. Cycles are rejected with a `CYCLE` reason.
5. **DAG Support**: Shared references to the same object in different branches of the tree are allowed (Directed Acyclic Graphs).
6. **Plain Objects Only**: Only objects with `Object.prototype` or `null` prototype are accepted. Custom classes and built-ins (like `Date`, `Map`, `Set`) are rejected.
7. **No Symbols**: Objects with symbol keys are rejected.
8. **Finite Numbers**: `NaN`, `Infinity`, and `-Infinity` are rejected.

## API
### `checkSafeJsonValue(value: unknown): SafeJsonCheckResult`
Returns a structured result indicating if the value is safe.
```typescript
type SafeJsonCheckResult =
  | { safe: true }
  | {
      safe: false;
      reason: "UNSUPPORTED_TYPE" | "NON_FINITE_NUMBER" | "ACCESSOR" | "SYMBOL_KEY" | "CYCLE" | "UNSUPPORTED_PROTOTYPE" | "HOSTILE_OBJECT";
      path: Array<string | number>;
    };
```

### Zod Schemas
- `SafeJsonValueSchema`: Validates any safe JSON value.
- `SafeJsonRecordSchema`: Validates safe JSON plain objects.

## Usage
```typescript
import { SafeJsonValueSchema } from "@/platform/contracts";

const result = SafeJsonValueSchema.safeParse(untrustedInput);
if (result.success) {
  // Value is safe to use and serialize
  const safeData = result.data;
} else {
  // Security issue or invalid type detected
  console.error(result.error.issues);
}
```
