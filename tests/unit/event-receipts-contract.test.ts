import test from "node:test";
import assert from "node:assert/strict";
import { EventReceiptSchema, EmittedEvent } from "../../src/platform/events/event-types";
import { EventWriter } from "../../src/platform/events/event-writer";
import { CanonicalEvent } from "../../src/platform/events/canonical-contract";
import { registerEvent, clearEvents } from "../../src/platform/events/event-registry";
import { CanonicalEventSchema } from "../../src/platform/events/types/canonical-event";
import { DEFAULT_EVENT_FIXTURES } from "../../src/platform/events/default-events";

test("EventReceiptSchema valid payloads", () => {
  const validPayload = {
    eventId: "evt-123",
    processorId: "proc-456",
    processedAt: new Date().toISOString(),
    status: "success",
    correlationId: "corr-789",
    idempotencyKey: "idem-abc",
    error: "something went wrong"
  };

  const result = EventReceiptSchema.safeParse(validPayload);
  assert.ok(result.success);
});

export const INVALID_FIXTURES: unknown[] = [
  // missing eventId
  {
    processedAt: new Date().toISOString(),
    status: "success"
  },
  // invalid status
  {
    eventId: "evt-123",
    processedAt: new Date().toISOString(),
    status: "done"
  },
  // missing processedAt
  {
    eventId: "evt-123",
    status: "success"
  },
  // invalid processedAt format
  {
    eventId: "evt-123",
    processedAt: "not-a-date",
    status: "success"
  },
  // wrong types
  {
    eventId: 123,
    processedAt: new Date().toISOString(),
    status: "success"
  },
  // idempotencyKey too long
  {
    eventId: "evt-123",
    processedAt: new Date().toISOString(),
    status: "success",
    idempotencyKey: "a".repeat(256)
  },
  null,
  undefined,
  "string"
];

test("EventReceiptSchema invalid payloads", () => {
  for (const fixture of INVALID_FIXTURES) {
    const result = EventReceiptSchema.safeParse(fixture);
    assert.equal(result.success, false);
  }
});

test("EmittedEvent to EventReceipt mapping falls back safely without bypassing validation", () => {
  const emittedEvent: EmittedEvent = {
    eventType: "user.created",
    entityType: "user",
    entityId: "usr-456",
    correlationId: "corr-123",
    // Note: id is deliberately omitted/undefined to test the fallback
  };

  const receiptCandidate = {
    eventId: emittedEvent.id ?? "", // Safe fallback to satisfy non-empty string requirement defensively
    processedAt: new Date().toISOString(),
    status: "success",
    correlationId: emittedEvent.correlationId
  };

  const result = EventReceiptSchema.safeParse(receiptCandidate);

  // Validation should fail securely without bypassing parser due to the empty string
  assert.equal(result.success, false);
  if (!result.success) {
    const issue = result.error.issues.find(i => i.path.includes("eventId"));
    assert.ok(issue);
    assert.equal(issue.code, "too_small");
  }
});

test("CanonicalEventSchema from types validates receipt fields correctly", () => {
  const event = {
    eventId: "3e5903b1-933e-4f76-804d-e9c5222f7b8c",
    eventType: "user.created",
    eventVersion: "1.0.0",
    occurredAt: new Date().toISOString(),
    workspaceId: "123e4567-e89b-12d3-a456-426614174000",
    subjectType: "user",
    subjectId: "usr-456",
    correlationId: "corr-123",
    idempotencyKey: "idem-456",
    source: "tests",
    payload: {},
    schemaVersion: "1.0.0",
  };

  const result = CanonicalEventSchema.safeParse(event);
  assert.ok(result.success);
});

test("EventWriter.createReceipt successfully maps CanonicalEvent", () => {
  const event: CanonicalEvent = {
    id: "3e5903b1-933e-4f76-804d-e9c5222f7b8c",
    workspaceId: "ws-123",
    eventType: "user.created",
    entityType: "user",
    entityId: "usr-456",
    actorId: "system",
    occurredAt: new Date().toISOString(),
    schemaVersion: "1.0.0",
    correlationId: "corr-123",
    idempotencyKey: "idem-456",
    payload: {},
  };

  const receipt = EventWriter.createReceipt(event, "success", {
    processorId: "proc-1",
  });

  assert.equal(receipt.eventId, event.id);
  assert.equal(receipt.correlationId, event.correlationId);
  assert.equal(receipt.idempotencyKey, event.idempotencyKey);
  assert.equal(receipt.status, "success");
  assert.equal(receipt.processorId, "proc-1");
  assert.ok(receipt.processedAt);
  assert.equal(receipt.error, undefined);
});

test("EventWriter.createReceipt maps error boundary", () => {
  const event: CanonicalEvent = {
    id: "3e5903b1-933e-4f76-804d-e9c5222f7b8c",
    workspaceId: "ws-123",
    eventType: "user.created",
    entityType: "user",
    entityId: "usr-456",
    actorId: "system",
    occurredAt: new Date().toISOString(),
    schemaVersion: "1.0.0",
    payload: {},
  };

  const receipt = EventWriter.createReceipt(event, "error", {
    error: "something failed",
  });

  assert.equal(receipt.eventId, event.id);
  assert.equal(receipt.correlationId, undefined);
  assert.equal(receipt.idempotencyKey, undefined);
  assert.equal(receipt.status, "error");
  assert.equal(receipt.processorId, undefined);
  assert.ok(receipt.processedAt);
  assert.equal(receipt.error, "something failed");
});

test("registerEvent is idempotent", () => {
  clearEvents();

  const eventDefinition = {
    key: "test.event",
    moduleKey: "test",
    description: "A test event"
  };

  const firstResult = registerEvent(eventDefinition);
  assert.equal(firstResult, eventDefinition);

  // Subsequent registrations with the same key should return the original
  const secondResult = registerEvent({
    key: "test.event",
    moduleKey: "different",
    description: "Different description"
  });

  assert.equal(secondResult, firstResult);
  assert.equal(secondResult.moduleKey, "test"); // Original is kept
  assert.equal(secondResult.description, "A test event");
});

test("DEFAULT_EVENT_FIXTURES produce audit-friendly receipts", () => {
  for (const fixture of DEFAULT_EVENT_FIXTURES) {
    const receipt = EventWriter.createReceipt(fixture, "success", {
      processorId: "audit-processor-1",
    });

    assert.equal(receipt.eventId, fixture.id);
    assert.equal(receipt.correlationId, fixture.correlationId);
    assert.equal(receipt.idempotencyKey, fixture.idempotencyKey);
    assert.equal(receipt.status, "success");
    assert.equal(receipt.processorId, "audit-processor-1");
    assert.ok(receipt.processedAt);
    assert.equal(receipt.error, undefined);
  }
});
