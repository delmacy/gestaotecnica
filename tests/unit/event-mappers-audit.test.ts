import { describe, it } from "node:test";
import assert from "node:assert";
import { mapToCanonicalEvent, EventMappingError } from "../../src/platform/events/mappers/event-mapper";
import { EventMapperInput } from "../../src/platform/events/types/input-types";

describe("Event Mappers Audit", () => {
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
    payload: { key: "value" },
    schemaVersion: "1.0.0",
  };

  it("should be deterministic (same input produces same output)", () => {
    const result1 = mapToCanonicalEvent(validBaseInput);
    const result2 = mapToCanonicalEvent(validBaseInput);
    assert.deepStrictEqual(result1, result2);
  });

  it("should ensure non-mutation of input", () => {
    const input = JSON.parse(JSON.stringify(validBaseInput));
    mapToCanonicalEvent(input);
    assert.deepStrictEqual(input, validBaseInput);
  });

  it("should preserve workspaceId, correlationId and causationId", () => {
    const input: EventMapperInput = {
      ...validBaseInput,
      workspaceId: "550e8400-e29b-41d4-a716-446655440002",
      correlationId: "corr-audit-789",
      causationId: "caus-audit-012",
    };
    const result = mapToCanonicalEvent(input);
    assert.strictEqual(result.workspaceId, "550e8400-e29b-41d4-a716-446655440002");
    assert.strictEqual(result.correlationId, "corr-audit-789");
    assert.strictEqual(result.causationId, "caus-audit-012");
  });

  it("should reject invalid schemaVersion (must be major.minor.patch)", () => {
    const invalidInput: unknown = { ...validBaseInput, schemaVersion: "1.0" };
    assert.throws(() => mapToCanonicalEvent(invalidInput as EventMapperInput), (err: unknown) => {
      assert(err instanceof EventMappingError);
      return true;
    });
  });

  it("should reject timestamps without 'Z' designator", () => {
    const invalidInput: unknown = { ...validBaseInput, occurredAt: "2023-10-27T10:00:00" };
    assert.throws(() => mapToCanonicalEvent(invalidInput as EventMapperInput), (err: unknown) => {
      assert(err instanceof EventMappingError);
      return true;
    });
  });

  it("should reject timestamps with numeric offsets (strictly UTC required)", () => {
    const invalidInput: unknown = { ...validBaseInput, occurredAt: "2023-10-27T10:00:00+00:00" };
    assert.throws(() => mapToCanonicalEvent(invalidInput as EventMapperInput), (err: unknown) => {
      assert(err instanceof EventMappingError);
      return true;
    });
  });

  it("should document that payload remains a shallow copy", () => {
    const payload = { nested: { value: 1 } };
    const input = { ...validBaseInput, payload };
    const result = mapToCanonicalEvent(input);

    assert.notStrictEqual(result.payload, payload, "Payload is a new reference at top level");

    const resultPayload = result.payload as Record<string, unknown>;
    assert.strictEqual(resultPayload.nested, payload.nested, "Nested objects ARE SHARED (Shallow Copy)");
  });

  it("should not have any fallback for workspaceId (must be present)", () => {
    const { workspaceId: _, ...invalidInput } = validBaseInput;
    assert.throws(() => mapToCanonicalEvent(invalidInput as unknown as EventMapperInput), (err: unknown) => {
      assert(err instanceof EventMappingError);
      return true;
    });
  });

  it("should normalize eventId to lowercase", () => {
    const input: EventMapperInput = {
      ...validBaseInput,
      eventId: "550E8400-E29B-41D4-A716-446655440000",
    };
    const result = mapToCanonicalEvent(input);
    assert.strictEqual(result.eventId, "550e8400-e29b-41d4-a716-446655440000");
  });

  it("should normalize occurredAt and recordedAt timestamps correctly", () => {
    const dateInput = new Date("2023-10-27T10:00:00Z");
    const input: EventMapperInput = {
      ...validBaseInput,
      occurredAt: dateInput,
      recordedAt: dateInput.getTime(),
    };
    const result = mapToCanonicalEvent(input);
    assert.strictEqual(result.occurredAt, "2023-10-27T10:00:00.000Z");
    assert.strictEqual(result.recordedAt, "2023-10-27T10:00:00.000Z");
  });
});
