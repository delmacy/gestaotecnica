# Utility App Action Adapter

## Identification
- Package ID: `PKG-UTILITY-APP-ACTION-ADAPTER-001`
- Module: `utility-apps`
- Role: `application_adapter_worker`
- Type: pure contract adapter

## Overview
This adapter provides the contracts and pure functions necessary to define and manage how Utility Apps interact with Actions (either by consuming them or exposing implementations for them).

## Contracts

### UtilityAppActionBinding
Defines the declarative link between a Utility App and an Action Descriptor.

```typescript
{
  utilityAppKey: string;     // Key of the Utility App
  actionKey: string;         // Key of the Action Descriptor
  direction: "consumes" | "exposes";
  operationKey: string;      // Unique identifier for this operation within the app
  inputMapping?: Record<string, string>;  // { utilityField: actionField }
  outputMapping?: Record<string, string>; // { actionField: utilityField }
  enabled: boolean;
  metadata?: Record<string, unknown>; // Safe JSON metadata record
}
```

## Mapping Policy
Mappings are strictly declarative and support only field selection and renaming. No expressions, scripts, or complex transformations are allowed.

- **Input Mapping**: Defines how Utility App input fields are renamed to match the Action's expected input schema.
- **Output Mapping**: Defines how Action output fields are renamed to match the Utility App's expected output schema.

## Security
- **Safe Traversal**: Metadata and mappings are validated using `checkSafety` before being parsed by Zod to prevent execution of hostile getters or functions during validation.
- **Prototype Pollution**: The adapter explicitly rejects and prevents the use of `__proto__`, `prototype`, and `constructor` in mapping keys and values.
- **Getter Safety**: Runtime mapping uses `Object.getOwnPropertyDescriptor` and rejects any mapped field that is an accessor (getter/setter) to prevent side-effects during mapping.
- **Prototype-less Results**: Result objects are created using `Object.create(null)` to ensure they are prototype-safe.
- **Immutability**: Mapping functions do not mutate the provided input objects.

## Functions

### `validateUtilityAppActionBinding(binding: unknown)`
Validates that a binding object conforms to the `UtilityAppActionBindingSchema`.

### `mapUtilityAppInput(binding, utilityInput)`
Returns a new prototype-less object with fields renamed according to the `inputMapping`. Throws if a mapped field is an accessor.

### `mapActionOutput(binding, actionOutput)`
Returns a new prototype-less object with fields renamed according to the `outputMapping`. Throws if a mapped field is an accessor.
