import { describe, it } from "node:test";
import assert from "node:assert";
import { mapToCanonicalEvent, EventMappingError } from "../../src/platform/events/mappers/event-mapper";
import { EventMapperInput } from "../../src/platform/events/types/input-types";

describe("Event Mappers", () => {
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

  it("should map a minimum valid envelope", () => {
    const result = mapToCanonicalEvent(validBaseInput);
    assert.strictEqual(result.eventId, validBaseInput.eventId);
    assert.strictEqual(result.eventType, validBaseInput.eventType);
    assert.strictEqual(result.occurredAt, "2023-10-27T10:00:00.000Z");
    assert.deepStrictEqual(result.payload, validBaseInput.payload);
  });

  it("should map a complete valid envelope with optional fields", () => {
    const completeInput: EventMapperInput = {
      ...validBaseInput,
      recordedAt: new Date("2023-10-27T10:05:00Z"),
      actor: { type: "worker", id: "worker-456" },
      causationId: "caus-789",
      metadata: { meta: "data" },
    };
    const result = mapToCanonicalEvent(completeInput);
    assert.strictEqual(result.recordedAt, "2023-10-27T10:05:00.000Z");
    assert.deepStrictEqual(result.actor, completeInput.actor);
    assert.strictEqual(result.causationId, completeInput.causationId);
    assert.deepStrictEqual(result.metadata, completeInput.metadata);
  });

  it("should throw error if eventId is not a valid UUID", () => {
    const invalidInput = { ...validBaseInput, eventId: "not-a-uuid" } as any;
    assert.throws(() => mapToCanonicalEvent(invalidInput), EventMappingError);
  });

  it("should throw error if eventType is missing", () => {
    const invalidInput = { ...validBaseInput, eventType: "" } as any;
    assert.throws(() => mapToCanonicalEvent(invalidInput), EventMappingError);
  });

  it("should throw error if eventVersion is invalid", () => {
    const invalidInput = { ...validBaseInput, eventVersion: "1.0" } as any;
    assert.throws(() => mapToCanonicalEvent(invalidInput), EventMappingError);
  });

  it("should throw error if timestamp is invalid", () => {
    const invalidInput = { ...validBaseInput, occurredAt: "invalid-date" } as any;
    assert.throws(() => mapToCanonicalEvent(invalidInput), EventMappingError);
  });

  it("should throw error if workspaceId is missing", () => {
    const invalidInput = { ...validBaseInput, workspaceId: undefined } as any;
    assert.throws(() => mapToCanonicalEvent(invalidInput), EventMappingError);
  });

  it("should preserve correlationId and causationId", () => {
    const input = { ...validBaseInput, correlationId: "c1", causationId: "ca1" };
    const result = mapToCanonicalEvent(input);
    assert.strictEqual(result.correlationId, "c1");
    assert.strictEqual(result.causationId, "ca1");
  });

  it("should handle structured payload correctly", () => {
    const payload = { complex: { object: [1, 2, 3] } };
    const input = { ...validBaseInput, payload };
    const result = mapToCanonicalEvent(input);
    assert.deepStrictEqual(result.payload, payload);
  });

  it("should not mutate the input payload", () => {
    const payload = { key: "value" };
    const input = { ...validBaseInput, payload };
    const result = mapToCanonicalEvent(input);
    result.payload.key = "changed";
    assert.strictEqual(payload.key, "value");
  });

  it("should be deterministic", () => {
    const result1 = mapToCanonicalEvent(validBaseInput);
    const result2 = mapToCanonicalEvent(validBaseInput);
    assert.deepStrictEqual(result1, result2);
  });

  it("should handle numeric timestamps", () => {
    const timestamp = 1698393600000; // 2023-10-27T08:00:00Z
    const input = { ...validBaseInput, occurredAt: timestamp };
    const result = mapToCanonicalEvent(input);
    assert.strictEqual(result.occurredAt, "2023-10-27T08:00:00.000Z");
  });
});
