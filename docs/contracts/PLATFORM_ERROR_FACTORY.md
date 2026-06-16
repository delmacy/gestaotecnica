# Platform Error Factory

Deterministic and pure factory for creating `PlatformErrorEnvelope` objects.

## Objective

Provide a single, reliable way to create platform error envelopes while enforcing strict control over identity and timing fields.

## Signature

```typescript
export function createPlatformError(
  input: CreatePlatformErrorInput,
  context: PlatformErrorContext
): PlatformErrorEnvelope
```

## Controlled Fields

The following fields are strictly controlled by the `context` and cannot be overridden by the `input`:

- `id`: Unique identifier for the error instance.
- `timestamp`: ISO 8601 timestamp of when the error occurred.
- `workspaceId`: Optional identifier of the workspace context.
- `correlationId`: Optional identifier for request tracing.
- `causationId`: Optional identifier for the event that caused this error.

## Determinism

The factory is pure and deterministic. Given the same `input` and `context`, it will always return a structurally identical `PlatformErrorEnvelope`. It does not use any internal side effects like `Date.now()` or `crypto.randomUUID()`.

## Immutability

- The factory does not mutate the `input` or `context` objects.
- It works correctly with frozen input/context objects.
- It returns a frozen `PlatformErrorEnvelope` to prevent accidental mutation.

## Precedence

Context fields always take precedence. If the input (via type casting or other means) contains fields that overlap with the context, the values from the context will be used.

## Examples

### Minimal Example

```typescript
const context = {
  id: "err_123",
  timestamp: "2024-05-20T10:00:00Z"
};

const input = {
  code: "VALIDATION.FIELD.INVALID",
  category: "validation",
  severity: "error",
  message: "Invalid field value"
};

const error = createPlatformError(input, context);
```

### Complete Example

```typescript
const context = {
  id: "err_123",
  timestamp: "2024-05-20T10:00:00Z",
  workspaceId: "123e4567-e89b-12d3-a456-426614174000",
  correlationId: "corr_abc",
  causationId: "caus_xyz"
};

const input = {
  code: "DOMAIN.USER.NOT_FOUND",
  category: "not_found",
  severity: "error",
  message: "User not found",
  userMessage: "Usuário não encontrado.",
  details: { userId: "user_456" }
};

const error = createPlatformError(input, context);
```

## Package Boundaries

Out of scope for this package:

- Sanitization of unknown errors (see `PKG-ERROR-SANITIZER-001`)
- Serialization/Deserialization (see `PKG-ERROR-SERIALIZATION-001`)
- HTTP/API mapping (see `PKG-ERROR-HTTP-MAPPING-001`)
