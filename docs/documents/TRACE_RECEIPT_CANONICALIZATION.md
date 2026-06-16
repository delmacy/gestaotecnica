# Trace Receipt Canonicalization

This document describes the deterministic canonicalization algorithm used for Trace Receipts in the `document-traceability` module.

## Algorithm Overview

The canonicalization process transforms a JSON-compatible value into a unique, stable string representation. This is essential for ensuring that the same logical data always produces the same hash, regardless of property order or minor structural variations that don't affect semantic meaning.

### Core Rules

- **Determinism**: The same logical structure always produces the same string output.
- **Purity**: The function has no side effects and does not mutate input values.
- **Immutability**: Works correctly with frozen objects and arrays.

## Rules for Different Types

### Objects
- **Key Ordering**: All own enumerable keys are sorted lexicographically before processing.
- **Recursive Processing**: Each property value is processed recursively.
- **Undefined Omission**: Properties with `undefined` values are omitted from the output.
- **Null Preservation**: `null` values are preserved as `"null"`.
- **Prototype Check**: Only literal objects (prototype is `Object.prototype`) or objects with a `null` prototype are accepted. Custom classes are rejected.

### Arrays
- **Order Preservation**: The original order of elements is strictly preserved.
- **Recursive Processing**: Each item is processed recursively.
- **Undefined Handling**: `undefined` items (or holes) are converted to `null` to match `JSON.stringify` semantics.
- **Null Preservation**: `null` items are preserved.

### Primitives
- **Strings**: Encoded using `JSON.stringify`.
- **Numbers**: Only finite numbers are accepted.
- **Booleans**: Encoded as `true` or `false`.
- **Null**: Encoded as `null`.

## Rejected Types

The following types are explicitly rejected to ensure canonical stability and prevent ambiguity:

- `BigInt`: Error code `NON_CANONICAL_BIGINT`
- `Function`: Error code `NON_CANONICAL_FUNCTION`
- `Symbol`: Error code `NON_CANONICAL_SYMBOL`
- `NaN`, `Infinity`, `-Infinity`: Error code `NON_CANONICAL_NON_FINITE_NUMBER`
- Special Objects (`Date`, `Map`, `Set`, `RegExp`, `ArrayBuffer`, etc.): Error code `NON_CANONICAL_OBJECT_TYPE`
- Custom Class Instances: Error code `NON_CANONICAL_OBJECT_TYPE`

## Safety and Security

### Circular References
Circular references are detected using a recursion stack tracker. If a cycle is detected, the process throws an error with code `NON_CANONICAL_CIRCULAR_REFERENCE`.

### Shared References
Multiple references to the same object (without forming a cycle) are allowed and will be serialized independently at each location.

### Accessor Safety
The algorithm avoids executing arbitrary getters or setters. It uses `Object.getOwnPropertyDescriptor` to ensure it only accesses data properties. Accessing a property with a getter/setter triggers `NON_CANONICAL_ACCESSOR_PROPERTY`.

### Proxy Protection
Operations like `Object.keys`, `Object.getPrototypeOf`, and property access are protected against hostile Proxies that might throw unexpected errors. These are caught and reported as `NON_CANONICAL_PROPERTY_ACCESS`.

## Package Scope and Future Work

This package (PKG-TRACE-RECEIPT-CANONICALIZATION-001) focuses solely on pure-function canonicalization.

**Future Packages:**
- `PKG-TRACE-RECEIPT-HASHING-001`: Will implement hashing logic using these canonical strings.
- `PKG-TRACE-RECEIPT-LINKING-001`: Will handle the linking of receipts into chains.
