import { describe, it } from "node:test";
import assert from "node:assert";
import { EventWriter } from "../../../src/platform/events/event-writer";
import { randomUUID } from "node:crypto";
import type { WorkspaceContext } from "../../../src/platform/workspace/workspace-context";

function createMockContext(workspace: { id: string, key: string }): WorkspaceContext {
  return {
    workspaceId: workspace.id,
    workspaceKey: workspace.key,
    adaptationKey: "secao-tecnica",
    actor: {
      type: "user",
      id: randomUUID(),
      name: "Test User",
    },
    source: "ui",
    enabledModules: ["events"],
    scopes: ["*"],
    correlationId: `test-corr-${randomUUID()}`,
  };
}

describe("EventWriter", () => {
  const workspace1 = { id: randomUUID(), key: "ws-1" };
  const workspace2 = { id: randomUUID(), key: "ws-2" };
  const ctx1 = createMockContext(workspace1);
  const ctx2 = createMockContext(workspace2);

  it("should append a domain event and preserve workspace isolation", async () => {
    const event = {
      eventType: "test.event",
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { foo: "bar" },
    };

    const result = await EventWriter.appendDomainEvent(event, ctx1);

    assert.strictEqual(result.workspaceId, workspace1.id);
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
    const event = {
      eventType: "idempotent.event",
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { foo: "bar" },
      idempotencyKey: "unique-key-" + randomUUID(),
    };

    const result1 = await EventWriter.appendDomainEvent(event, ctx1);
    const result2 = await EventWriter.appendDomainEvent(event, ctx1);

    assert.strictEqual(result1.id, result2.id, "Second call with same idempotency key should return first event");

    const history = await EventWriter.getEntityHistory(event.entityType, event.entityId, ctx1);
    assert.strictEqual(history.length, 1, "Only one event should be persisted for same idempotency key");
  });

  it("should NOT leak idempotency across workspaces", async () => {
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

  it("should handle multiple events in batch", async () => {
    const events = [
      { eventType: "e1", entityType: "ent", entityId: "id1", payload: {} },
      { eventType: "e2", entityType: "ent", entityId: "id1", payload: {} },
    ];

    const results = await EventWriter.appendDomainEvents(events, ctx1);
    assert.strictEqual(results.length, 2);

    const history = await EventWriter.getEntityHistory("ent", "id1", ctx1);
    assert.strictEqual(history.length, 2);
  });

  it("should enforce schema validation", async () => {
    const invalidEvent = {
      eventType: "", // Invalid: min(1)
      entityType: "ent",
      entityId: "id",
      payload: {},
    };

    await assert.rejects(async () => {
      await EventWriter.appendDomainEvent(invalidEvent as any, ctx1);
    });
  });

  it("should handle correlation and causation IDs correctly", async () => {
    const event = {
      eventType: "child.event",
      entityType: "ent",
      entityId: randomUUID(),
      payload: {},
      causationId: "parent-event-id",
    };

    const result = await EventWriter.appendDomainEvent(event, ctx1);
    assert.strictEqual(result.causationId, "parent-event-id");
    assert.strictEqual(result.correlationId, ctx1.correlationId);
  });
});
