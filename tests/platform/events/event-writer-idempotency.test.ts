import { describe, it, before } from "node:test";
import assert from "node:assert";
import { EventWriter } from "../../../src/platform/events/event-writer";
import { randomUUID } from "node:crypto";
import { getRuntimeDb } from "../../../src/db";
import { workspaces } from "../../../src/db/runtime/schema/workspace";
import type { WorkspaceContext } from "../../../src/platform/workspace/workspace-context";

async function createTestWorkspace(key: string) {
    const db = getRuntimeDb();
    const id = randomUUID();
    await db.insert(workspaces).values({
        id,
        key,
        name: `Test Workspace ${key}`,
    });
    return { id, key };
}

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

describe("EventWriter - Concurrent Idempotency", () => {
  let workspace1: { id: string; key: string };
  let workspace2: { id: string; key: string };
  let ctx1: WorkspaceContext;
  let ctx2: WorkspaceContext;

  before(async () => {
      workspace1 = await createTestWorkspace("ws-" + randomUUID());
      workspace2 = await createTestWorkspace("ws-" + randomUUID());
      ctx1 = createMockContext(workspace1);
      ctx2 = createMockContext(workspace2);
  });

  it("should create event on first recording", async () => {
    const event = {
      eventType: "test.event",
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { foo: "bar" },
      idempotencyKey: "first-write-" + randomUUID(),
    };

    const result = await EventWriter.appendDomainEventInternal(event, ctx1);
    assert.strictEqual(result.status, "created");
    assert.strictEqual(result.event.idempotencyKey, event.idempotencyKey);
  });

  it("should return existing event on sequential repetition", async () => {
    const event = {
      eventType: "test.event",
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { foo: "bar" },
      idempotencyKey: "seq-rep-" + randomUUID(),
    };

    const result1 = await EventWriter.appendDomainEventInternal(event, ctx1);
    const result2 = await EventWriter.appendDomainEventInternal(event, ctx1);

    assert.strictEqual(result1.status, "created");
    assert.strictEqual(result2.status, "existing");
    assert.strictEqual(result1.event.id, result2.event.id);
  });

  it("should persist only one event on two concurrent writes", async () => {
    const event = {
      eventType: "test.event",
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { foo: "bar" },
      idempotencyKey: "concurrent-2-" + randomUUID(),
    };

    const [r1, r2] = await Promise.all([
      EventWriter.appendDomainEventInternal(event, ctx1),
      EventWriter.appendDomainEventInternal(event, ctx1),
    ]);

    const results = [r1, r2];
    const created = results.filter(r => r.status === "created");
    const existing = results.filter(r => r.status === "existing");

    assert.strictEqual(created.length, 1, "Exactly one event should be created");
    assert.strictEqual(existing.length, 1, "One request should identify existing event");
    assert.strictEqual(r1.event.id, r2.event.id, "Both should return same event ID");
  });

  it("should persist only one event on ten concurrent writes", async () => {
    const event = {
      eventType: "test.event",
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { foo: "bar" },
      idempotencyKey: "concurrent-10-" + randomUUID(),
    };

    const results = await Promise.all(
      Array.from({ length: 10 }).map(() => EventWriter.appendDomainEventInternal(event, ctx1))
    );

    const created = results.filter(r => r.status === "created");
    const existing = results.filter(r => r.status === "existing");

    assert.strictEqual(created.length, 1, "Exactly one event should be created");
    assert.strictEqual(existing.length, 9, "Nine requests should identify existing event");

    const firstId = results[0].event.id;
    results.forEach(r => assert.strictEqual(r.event.id, firstId));
  });

  it("should allow same key in different workspaces", async () => {
    const key = "shared-key-" + randomUUID();
    const event = {
      eventType: "test.event",
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { foo: "bar" },
      idempotencyKey: key,
    };

    const r1 = await EventWriter.appendDomainEventInternal(event, ctx1);
    const r2 = await EventWriter.appendDomainEventInternal(event, ctx2);

    assert.strictEqual(r1.status, "created");
    assert.strictEqual(r2.status, "created");
    assert.notStrictEqual(r1.event.id, r2.event.id);
  });

  it("should create distinct events for different keys in same workspace", async () => {
    const event1 = {
      eventType: "test.event",
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { foo: "bar" },
      idempotencyKey: "key-A-" + randomUUID(),
    };
    const event2 = {
      ...event1,
      idempotencyKey: "key-B-" + randomUUID(),
    };

    const r1 = await EventWriter.appendDomainEventInternal(event1, ctx1);
    const r2 = await EventWriter.appendDomainEventInternal(event2, ctx1);

    assert.strictEqual(r1.status, "created");
    assert.strictEqual(r2.status, "created");
    assert.notStrictEqual(r1.event.id, r2.event.id);
  });

  it("should return original event even if payload differs for same key", async () => {
    const key = "payload-diff-" + randomUUID();
    const event1 = {
      eventType: "test.event",
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { original: true },
      idempotencyKey: key,
    };
    const event2 = {
      ...event1,
      payload: { modified: true },
    };

    const r1 = await EventWriter.appendDomainEventInternal(event1, ctx1);
    const r2 = await EventWriter.appendDomainEventInternal(event2, ctx1);

    assert.strictEqual(r1.status, "created");
    assert.strictEqual(r2.status, "existing");
    assert.deepStrictEqual(r2.event.payload, event1.payload, "Should return original payload");
  });

  it("should return original event even if actor differs for same key", async () => {
    const key = "actor-diff-" + randomUUID();
    const event = {
      eventType: "test.event",
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { foo: "bar" },
      idempotencyKey: key,
    };

    const ctxA = createMockContext(workspace1);
    const ctxB = createMockContext(workspace1);

    const r1 = await EventWriter.appendDomainEventInternal(event, ctxA);
    const r2 = await EventWriter.appendDomainEventInternal(event, ctxB);

    assert.strictEqual(r1.status, "created");
    assert.strictEqual(r2.status, "existing");
    assert.strictEqual(r2.event.actorId, ctxA.actor.id, "Should return original actor");
  });

  it("should not reserve key on validation failure", async () => {
    const key = "val-fail-" + randomUUID();
    const invalidEvent = {
      eventType: "", // Should fail validation
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: {},
      idempotencyKey: key,
    };

    await assert.rejects(async () => {
      await EventWriter.appendDomainEventInternal(invalidEvent as any, ctx1);
    });

    const validEvent = {
      ...invalidEvent,
      eventType: "valid.event",
    };

    const result = await EventWriter.appendDomainEventInternal(validEvent, ctx1);
    assert.strictEqual(result.status, "created", "Key should be available after previous failure");
  });

  it("should reject context without workspaceId", async () => {
    const event = {
      eventType: "test.event",
      entityType: "ent",
      entityId: randomUUID(),
      payload: {},
    };
    const badCtx = { ...ctx1, workspaceId: undefined } as any;

    await assert.rejects(async () => {
      await EventWriter.appendDomainEventInternal(event, badCtx);
    }, /Workspace context is required/);
  });

  it("should validate idempotency key format", async () => {
    const eventBase = {
      eventType: "test.event",
      entityType: "ent",
      entityId: randomUUID(),
      payload: {},
    };

    await assert.rejects(async () => {
      await EventWriter.appendDomainEventInternal({ ...eventBase, idempotencyKey: "" }, ctx1);
    }, /cannot be empty/);

    await assert.rejects(async () => {
      await EventWriter.appendDomainEventInternal({ ...eventBase, idempotencyKey: "   " }, ctx1);
    }, /cannot be empty/);

    await assert.rejects(async () => {
      await EventWriter.appendDomainEventInternal({ ...eventBase, idempotencyKey: 123 as any }, ctx1);
    }, /must be a string/);
  });

  it("should ignore workspaceId in payload and use context workspaceId", async () => {
    const maliciousWorkspaceId = randomUUID();
    const event = {
      eventType: "test.event",
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { foo: "bar" },
      workspaceId: maliciousWorkspaceId, // Attempt to override
    };

    const result = await EventWriter.appendDomainEvent(event as any, ctx1);
    assert.strictEqual(result.workspaceId, ctx1.workspaceId);
    assert.notStrictEqual(result.workspaceId, maliciousWorkspaceId);
  });
});
