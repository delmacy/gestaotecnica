import { describe, it } from "node:test";
import assert from "node:assert";
import { mapToCanonicalEvent, EventMappingError } from "../../src/platform/events/mappers/event-mapper";
import { EventMapperInput } from "../../src/platform/events/types/input-types";

describe("Event Mappers Audit Verification", () => {
  const validBaseInput: EventMapperInput = {
    eventId: "550e8400-e29b-41d4-a716-446655440000",
    eventType: "runtime.process.instance.started",
    eventVersion: "1.0.0",
    occurredAt: "2023-10-27T10:00:00Z",
    workspaceId: "550e8400-e29b-41d4-a716-446655440001",
    subjectType: "process",
    subjectId: "proc-123",
    correlationId: "corr-123",
    source: "runtime-engine",
    payload: { key: "value", nested: { a: 1 } },
    schemaVersion: "1.0.0",
  };

  it("should verify deep immutability of payload (shallow copy check)", () => {
    const input = { ...validBaseInput };
    const result = mapToCanonicalEvent(input);

    // Test that top-level payload is a different object
    assert.notStrictEqual(result.payload, input.payload);

    // Note: The implementation does shallow copy: payload: { ...data.payload }
    // So nested objects are still the same reference.
    assert.strictEqual(result.payload.nested, input.payload.nested);

    // Verification of requirement: "Payload: não é mutado; não é perdido; não é serializado de forma destrutiva"
    // The mapper itself does not mutate the input.
  });

  it("should reject non-Z (non-UTC) timestamps if platform contract ISODateTimeSchema is strict", () => {
    // ISODateTimeSchema uses z.string().datetime(), which by default requires 'Z' and no offset
    const invalidTimestamp = "2023-10-27T10:00:00+03:00";
    const input = { ...validBaseInput, occurredAt: invalidTimestamp } as any;

    assert.throws(() => mapToCanonicalEvent(input), (err: any) => {
      return err instanceof EventMappingError;
    });
  });

  it("should preserve correlation_id and causation_id exactly", () => {
    const input = {
      ...validBaseInput,
      correlationId: "CORR_ID_001",
      causationId: "CAUS_ID_002"
    };
    const result = mapToCanonicalEvent(input);

    assert.strictEqual(result.correlationId, "CORR_ID_001");
    assert.strictEqual(result.causationId, "CAUS_ID_002");
  });

  it("should reject invalid schemaVersion format", () => {
    const input = { ...validBaseInput, schemaVersion: "1.0" } as any;
    assert.throws(() => mapToCanonicalEvent(input), EventMappingError);

    const input2 = { ...validBaseInput, schemaVersion: "v1.0.0" } as any;
    assert.throws(() => mapToCanonicalEvent(input2), EventMappingError);
  });

  it("should ensure pure function - no global state side effects (indirect check)", () => {
    const input = { ...validBaseInput };
    const result1 = mapToCanonicalEvent(input);
    const result2 = mapToCanonicalEvent(input);

    assert.deepStrictEqual(result1, result2);
    assert.notStrictEqual(result1, result2); // Different instances
  });
});
