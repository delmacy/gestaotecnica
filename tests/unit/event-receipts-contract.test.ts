import test from "node:test";
import assert from "node:assert/strict";
import { EventReceiptSchema } from "../../src/platform/events/event-types";

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
