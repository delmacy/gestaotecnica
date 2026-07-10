import test from "node:test";
import assert from "node:assert/strict";
import { EventReceiptSchema } from "../../src/platform/events/event-types";
import { EventWriter } from "../../src/platform/events/event-writer";
import { CanonicalEvent } from "../../src/platform/events/canonical-contract";

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
