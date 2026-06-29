import { describe, it, before } from "node:test";
import assert from "node:assert";
import { randomUUID } from "node:crypto";
import { EventWriter } from "@/platform/events/event-writer";
import type { WorkspaceContext } from "@/platform/workspace/workspace-context";
import { createTestWorkspace } from "../../helpers/event-test-helper";
import { EventStoreError } from "@/platform/events/errors/event-errors";

describe("EventWriter Batch Operations", () => {
  let workspaceId: string;
  let context: WorkspaceContext;

  before(async () => {
    workspaceId = await createTestWorkspace("Batch Test Workspace");
    context = {
      workspaceId,
      workspaceKey: "test-workspace",
      actor: { id: randomUUID(), type: "automation" },
      correlationId: randomUUID(),
      source: "system",
      enabledModules: [],
      scopes: [],
    };
  });

  it("should append a batch of 1 event", async () => {
    const events = [
      {
        eventType: "test.event.1",
        entityType: "test-entity",
        entityId: randomUUID(),
        payload: { key: "value1" },
      },
    ];

    const result = await EventWriter.appendDomainEventBatch(events, context);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].eventType, "test.event.1");
  });

  it("should append a batch of 2 events", async () => {
    const events = [
      {
        eventType: "test.event.2a",
        entityType: "test-entity",
        entityId: randomUUID(),
        payload: { key: "value2a" },
      },
      {
        eventType: "test.event.2b",
        entityType: "test-entity",
        entityId: randomUUID(),
        payload: { key: "value2b" },
      },
    ];

    const result = await EventWriter.appendDomainEventBatch(events, context);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].eventType, "test.event.2a");
    assert.strictEqual(result[1].eventType, "test.event.2b");
  });

  it("should append a batch of 10 events and preserve order", async () => {
    const correlationId = randomUUID();
    const batchContext = { ...context, correlationId };
    const events = Array.from({ length: 10 }).map((_, i) => ({
      eventType: `test.event.batch.${i}`,
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { index: i },
    }));

    const result = await EventWriter.appendDomainEventBatch(events, batchContext);
    assert.strictEqual(result.length, 10);

    // Verify returning order
    result.forEach((event, i) => {
      assert.strictEqual(event.eventType, `test.event.batch.${i}`);
      assert.strictEqual((event.payload as any).index, i);
      assert.strictEqual((event.metadata as any)._batchIndex, i);
    });

    // Verify stored order
    const stored = await EventWriter.getBatchEvents(correlationId, batchContext);
    assert.strictEqual(stored.length, 10);
    stored.forEach((event, i) => {
      assert.strictEqual(event.eventType, `test.event.batch.${i}`);
      assert.strictEqual((event.metadata as any)._batchIndex, i);
    });
  });

  it("should append a batch of exactly 100 events", async () => {
    const events = Array.from({ length: 100 }).map((_, i) => ({
      eventType: `test.event.large.${i}`,
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { i },
    }));

    const result = await EventWriter.appendDomainEventBatch(events, context);
    assert.strictEqual(result.length, 100);
  });

  it("should reject a batch exceeding 100 events", async () => {
    const events = Array.from({ length: 101 }).map((_, i) => ({
      eventType: `test.event.too-large.${i}`,
      entityType: "test-entity",
      entityId: randomUUID(),
      payload: { i },
    }));

    await assert.rejects(
      EventWriter.appendDomainEventBatch(events, context),
      (err: any) => err instanceof EventStoreError && err.code === "BATCH_LIMIT_EXCEEDED"
    );
  });

  it("should reject an empty batch", async () => {
    await assert.rejects(
      EventWriter.appendDomainEventBatch([], context),
      (err: any) => err instanceof EventStoreError && err.code === "EMPTY_BATCH"
    );
  });

  it("should rollback if the first event is invalid (Zod)", async () => {
    const events = [
      {
        eventType: "", // Invalid: empty string
        entityType: "test",
        entityId: randomUUID(),
        payload: {},
      },
      {
        eventType: "valid.event",
        entityType: "test",
        entityId: randomUUID(),
        payload: {},
      },
    ];

    const correlationId = randomUUID();
    const failContext = { ...context, correlationId };

    await assert.rejects(EventWriter.appendDomainEventBatch(events as any, failContext));

    const stored = await EventWriter.getBatchEvents(correlationId, failContext);
    assert.strictEqual(stored.length, 0);
  });

  it("should rollback if a middle event is invalid (Zod)", async () => {
    const events = [
      {
        eventType: "valid.1",
        entityType: "test",
        entityId: randomUUID(),
        payload: {},
      },
      {
        eventType: "", // Invalid
        entityType: "test",
        entityId: randomUUID(),
        payload: {},
      },
      {
        eventType: "valid.2",
        entityType: "test",
        entityId: randomUUID(),
        payload: {},
      },
    ];

    const correlationId = randomUUID();
    const failContext = { ...context, correlationId };

    await assert.rejects(EventWriter.appendDomainEventBatch(events as any, failContext));

    const stored = await EventWriter.getBatchEvents(correlationId, failContext);
    assert.strictEqual(stored.length, 0);
  });

  it("should rollback if the last event is invalid (Zod)", async () => {
    const events = [
      {
        eventType: "valid.1",
        entityType: "test",
        entityId: randomUUID(),
        payload: {},
      },
      {
        eventType: "valid.2",
        entityType: "test",
        entityId: randomUUID(),
        payload: {},
      },
      {
        eventType: "", // Invalid
        entityType: "test",
        entityId: randomUUID(),
        payload: {},
      },
    ];

    const correlationId = randomUUID();
    const failContext = { ...context, correlationId };

    await assert.rejects(EventWriter.appendDomainEventBatch(events as any, failContext));

    const stored = await EventWriter.getBatchEvents(correlationId, failContext);
    assert.strictEqual(stored.length, 0);
  });

  it("should rollback on REAL database failure in the middle of transaction", async () => {
    const nonExistentWorkspace = randomUUID();
    const failContext = { ...context, workspaceId: nonExistentWorkspace };

    const events = [
      {
        eventType: "event.1",
        entityType: "test",
        entityId: randomUUID(),
        payload: {},
      },
      {
        eventType: "event.2",
        entityType: "test",
        entityId: randomUUID(),
        payload: {},
      },
    ];

    // This should fail due to foreign key constraint on workspace_id
    await assert.rejects(
        EventWriter.appendDomainEventBatch(events, failContext),
        (err: any) => err instanceof EventStoreError && (err.code === "TRANSACTION_FAILURE" || err.code === "PERSISTENCE_FAILURE")
    );

    // Verify nothing was persisted
    const dbEvents = await EventWriter.getWorkspaceEventStream(failContext);
    assert.strictEqual(dbEvents.length, 0);
  });

  it("should reject context without workspace", async () => {
    await assert.rejects(
      EventWriter.appendDomainEventBatch([{ eventType: "t", entityType: "e", entityId: randomUUID(), payload: {} }], {} as any),
      (err: any) => err instanceof EventStoreError && err.code === "MISSING_WORKSPACE_CONTEXT"
    );
  });

  it("should reject invalid actorId in context", async () => {
    const badContext = { ...context, actor: { ...context.actor, id: "not-a-uuid" } };
    await assert.rejects(
      EventWriter.appendDomainEventBatch([{ eventType: "t", entityType: "e", entityId: randomUUID(), payload: {} }], badContext as any),
      (err: any) => err instanceof EventStoreError && err.code === "INVALID_ACTOR_ID"
    );
  });

  it("should ignore workspaceId in payload and use context", async () => {
    const otherWorkspace = randomUUID();
    const events = [
      {
        eventType: "test.isolation",
        entityType: "test",
        entityId: randomUUID(),
        workspaceId: otherWorkspace, // Should be ignored
        payload: {},
      },
    ];

    const result = await EventWriter.appendDomainEventBatch(events as any, context);
    assert.strictEqual(result[0].workspaceId, workspaceId);
    assert.notStrictEqual(result[0].workspaceId, otherWorkspace);
  });

  it("should handle two independent batches", async () => {
    const batch1 = [{ eventType: "b1.e1", entityType: "t", entityId: randomUUID(), payload: {} }];
    const batch2 = [{ eventType: "b2.e1", entityType: "t", entityId: randomUUID(), payload: {} }];

    const [res1, res2] = await Promise.all([
      EventWriter.appendDomainEventBatch(batch1, context),
      EventWriter.appendDomainEventBatch(batch2, context),
    ]);

    assert.strictEqual(res1.length, 1);
    assert.strictEqual(res2.length, 1);
    assert.notStrictEqual(res1[0].id, res2[0].id);
  });

  it("should preserve correlation and causation IDs", async () => {
    const correlationId = randomUUID();
    const causationId = randomUUID();
    const batchContext = { ...context, correlationId };

    const events = [
      {
        eventType: "test.ids",
        entityType: "test",
        entityId: randomUUID(),
        causationId,
        payload: {},
      },
    ];

    const result = await EventWriter.appendDomainEventBatch(events, batchContext);
    assert.strictEqual(result[0].correlationId, correlationId);
    assert.strictEqual(result[0].causationId, causationId);
  });

  it("should validate version (fixed to 1.0.0)", async () => {
    const result = await EventWriter.appendDomainEventBatch(
      [{ eventType: "v", entityType: "t", entityId: randomUUID(), payload: {} }],
      context
    );
    assert.strictEqual(result[0].schemaVersion, "1.0.0");
  });

  it("should maintain append-only behavior", async () => {
    const entityId = randomUUID();
    const events = [{ eventType: "append.only", entityType: "t", entityId, payload: { v: 1 } }];
    const result = await EventWriter.appendDomainEventBatch(events, context);
    const eventId = result[0].id;

    // Verify it exists
    const history = await EventWriter.getEntityHistory("t", entityId, context);
    assert.ok(history.find(e => e.id === eventId));
  });

  it("should not break individual append", async () => {
    const event = {
      eventType: "individual",
      entityType: "test",
      entityId: randomUUID(),
      payload: { type: "single" },
    };

    const result = await EventWriter.appendDomainEvent(event, context);
    assert.ok(result.id);
    assert.strictEqual(result.eventType, "individual");
  });
});
