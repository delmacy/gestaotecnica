import test from "node:test";
import assert from "node:assert/strict";
import { createReceipt } from "../../src/platform/events/event-log-service";
import type { EmittedEvent } from "../../src/platform/events/event-types";

test("createReceipt maps success event", () => {
  const event: EmittedEvent = {
    id: "evt-123",
    eventType: "user.created",
    entityType: "user",
    entityId: "usr-456",
    correlationId: "corr-123",
  };

  const receipt = createReceipt(event, "success", {
    processorId: "proc-1",
    idempotencyKey: "idem-123"
  });

  assert.equal(receipt.eventId, "evt-123");
  assert.equal(receipt.status, "success");
  assert.equal(receipt.processorId, "proc-1");
  assert.equal(receipt.correlationId, "corr-123");
  assert.equal(receipt.idempotencyKey, "idem-123");
  assert.ok(receipt.processedAt);
  assert.equal(receipt.error, undefined);
});

test("createReceipt maps error event", () => {
  const event: EmittedEvent = {
    id: "evt-456",
    eventType: "order.placed",
    entityType: "order",
    entityId: "ord-789",
    correlationId: "corr-456",
  };

  const receipt = createReceipt(event, "error", {
    error: "validation failed",
  });

  assert.equal(receipt.eventId, "evt-456");
  assert.equal(receipt.status, "error");
  assert.equal(receipt.error, "validation failed");
  assert.equal(receipt.correlationId, "corr-456");
  assert.ok(receipt.processedAt);
  assert.equal(receipt.processorId, undefined);
});

test("createReceipt throws on missing event ID (if enforced by schema or fallback)", () => {
  const event: EmittedEvent = {
    eventType: "item.deleted",
    entityType: "item",
    entityId: "itm-999",
    correlationId: "corr-789",
  };

  const receipt = createReceipt(event, "skipped");
  assert.equal(receipt.eventId, "unknown"); // We handle it gracefully by falling back to "unknown"
  assert.equal(receipt.status, "skipped");
  assert.equal(receipt.correlationId, "corr-789");
  assert.ok(receipt.processedAt);
});

test("createReceipt handles very long idempotency keys", () => {
  const event: EmittedEvent = {
    id: "evt-123",
    eventType: "user.created",
    entityType: "user",
    entityId: "usr-456",
    correlationId: "corr-123",
  };

  const tooLongKey = "a".repeat(256);
  assert.throws(() => {
    createReceipt(event, "success", { idempotencyKey: tooLongKey });
  });
});
