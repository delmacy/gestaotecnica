import { describe, it } from "node:test";
import assert from "node:assert";
import { EventWriter } from "../../../src/platform/events/event-writer";
import { randomUUID } from "node:crypto";
import { createTestWorkspace, createMockContext } from "../../helpers/event-test-helper";

describe("EventWriter Individual Appends", () => {
  it("should append a domain event and preserve workspace isolation", async () => {
    const ws1 = await createTestWorkspace("indiv-1");
    const ws2 = await createTestWorkspace("indiv-2");
    const ctx1 = createMockContext(ws1) as any;
    const ctx2 = createMockContext(ws2) as any;

    const event = {
      eventType: "test.event",
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { foo: "bar" },
    };

    const result = await EventWriter.appendDomainEvent(event, ctx1);

    assert.strictEqual(result.workspaceId, ws1.id);
    assert.strictEqual(result.eventType, event.eventType);
    assert.deepStrictEqual(result.payload, event.payload);
    assert.ok(result.id);
    assert.ok(result.occurredAt);

    // Verify isolation by trying to fetch from another workspace
    const history1 = await EventWriter.getEntityHistory(event.entityType, event.entityId, ctx1);
    assert.strictEqual(history1.length, 1);
    assert.strictEqual(history1[0].id, result.id);

    const history2 = await EventWriter.getEntityHistory(event.entityType, event.entityId, ctx2);
    assert.strictEqual(history2.length, 0);
  });

  it("should enforce idempotency when idempotencyKey is provided", async () => {
    const ws = await createTestWorkspace("idempotency");
    const ctx = createMockContext(ws) as any;
    const event = {
      eventType: "idempotent.event",
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { foo: "bar" },
      idempotencyKey: "unique-key-" + randomUUID(),
    };

    const result1 = await EventWriter.appendDomainEvent(event, ctx);
    const result2 = await EventWriter.appendDomainEvent(event, ctx);

    assert.strictEqual(result1.id, result2.id, "Second call with same idempotency key should return first event");

    const history = await EventWriter.getEntityHistory(event.entityType, event.entityId, ctx);
    assert.strictEqual(history.length, 1, "Only one event should be persisted for same idempotency key");
  });

  it("should NOT leak idempotency across workspaces", async () => {
    const ws1 = await createTestWorkspace("leak-1");
    const ws2 = await createTestWorkspace("leak-2");
    const ctx1 = createMockContext(ws1) as any;
    const ctx2 = createMockContext(ws2) as any;
    const key = "shared-key-" + randomUUID();
    const event = {
      eventType: "idempotent.event",
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { foo: "bar" },
      idempotencyKey: key,
    };

    const result1 = await EventWriter.appendDomainEvent(event, ctx1);
    const result2 = await EventWriter.appendDomainEvent(event, ctx2);

    assert.notStrictEqual(result1.id, result2.id, "Different workspaces should have different events even with same idempotency key");
  });

  it("should handle multiple events sequentially (legacy)", async () => {
    const ws = await createTestWorkspace("sequential");
    const ctx = createMockContext(ws) as any;
    const entityId = randomUUID();
    const events = [
      { eventType: "e1", entityType: "ent", entityId, payload: {} },
      { eventType: "e2", entityType: "ent", entityId, payload: {} },
    ];

    const results = await EventWriter.appendDomainEvents(events, ctx);
    assert.strictEqual(results.length, 2);

    const history = await EventWriter.getEntityHistory("ent", entityId, ctx);
    assert.strictEqual(history.length, 2);
  });

  it("should enforce schema validation", async () => {
    const ws = await createTestWorkspace("schema-val");
    const ctx = createMockContext(ws) as any;
    const invalidEvent = {
      eventType: "", // Invalid: min(1)
      entityType: "ent",
      entityId: "id",
      payload: {},
    };

    await assert.rejects(async () => {
      await EventWriter.appendDomainEvent(invalidEvent as any, ctx);
    });
  });

  it("should handle correlation and causation IDs correctly", async () => {
    const ws = await createTestWorkspace("correlation");
    const ctx = createMockContext(ws) as any;
    const event = {
      eventType: "child.event",
      entityType: "ent",
      entityId: randomUUID(),
      payload: {},
      causationId: "parent-event-id",
    };

    const result = await EventWriter.appendDomainEvent(event, ctx);
    assert.strictEqual(result.causationId, "parent-event-id");
    assert.strictEqual(result.correlationId, ctx.correlationId);
  });
});
