import { describe, it } from "node:test";
import assert from "node:assert";
import { EventWriter } from "../../../src/platform/events/event-writer";
import { randomUUID } from "node:crypto";
import type { WorkspaceContext } from "../../../src/platform/workspace/workspace-context";
import { getRuntimeDb } from "../../../src/db";
import { events } from "../../../src/db/runtime/schema/workflow";
import { eq, count } from "drizzle-orm";
import { createTestWorkspace, createMockContext } from "../../helpers/event-test-helper";
import { EventStoreError } from "../../../src/platform/events/errors/event-errors";

describe("EventWriter Batch Operations", () => {
  const db = getRuntimeDb();

  it("should append a batch of 1 event", async () => {
    const ws = await createTestWorkspace("batch-1");
    const ctx = createMockContext(ws) as any;
    const batch = [{ eventType: "e1", entityType: "ent", entityId: randomUUID(), payload: {} }];
    const results = await EventWriter.appendDomainEventBatch(batch, ctx);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].metadata?._batchIndex, 0);
  });

  it("should append a batch of 2 events", async () => {
    const ws = await createTestWorkspace("batch-2");
    const ctx = createMockContext(ws) as any;
    const batch = [
        { eventType: "e1", entityType: "ent", entityId: randomUUID(), payload: {} },
        { eventType: "e2", entityType: "ent", entityId: randomUUID(), payload: {} }
    ];
    const results = await EventWriter.appendDomainEventBatch(batch, ctx);
    assert.strictEqual(results.length, 2);
    assert.strictEqual(results[0].metadata?._batchIndex, 0);
    assert.strictEqual(results[1].metadata?._batchIndex, 1);
  });

  it("should append a batch of 10 events and preserve order", async () => {
    const ws = await createTestWorkspace("batch-10");
    const ctx = createMockContext(ws) as any;
    const entityId = randomUUID();
    // In EventWriter, context.correlationId takes precedence if present.
    // If not present, event.correlationId is used.
    // Let's use the one from context to be sure.
    const correlationId = ctx.correlationId;
    const batch = Array.from({ length: 10 }, (_, i) => ({
      eventType: `test.event.${i}`,
      entityType: "test-batch-entity",
      entityId,
      payload: { index: i }
    }));

    const results = await EventWriter.appendDomainEventBatch(batch, ctx);

    assert.strictEqual(results.length, 10);
    results.forEach((res, i) => {
      assert.strictEqual(res.eventType, `test.event.${i}`);
      assert.strictEqual(res.payload.index, i);
      assert.strictEqual(res.workspaceId, ws.id);
      assert.strictEqual(res.metadata?._batchIndex, i);
    });

    const history = await EventWriter.getBatchEvents(correlationId, ctx);
    assert.strictEqual(history.length, 10, "Should retrieve all 10 events of the batch");

    // Verify sequence is preserved in DB readout (ordered by _batchIndex ASC)
    for(let i = 0; i < 10; i++) {
        assert.strictEqual(history[i].metadata?._batchIndex, i);
        assert.strictEqual(history[i].eventType, `test.event.${i}`);
    }
  });

  it("should append a batch of exactly 100 events", async () => {
    const ws = await createTestWorkspace("batch-100");
    const ctx = createMockContext(ws) as any;
    const batch = Array.from({ length: 100 }, (_, i) => ({
        eventType: "e",
        entityType: "ent",
        entityId: randomUUID(),
        payload: { i }
    }));
    const results = await EventWriter.appendDomainEventBatch(batch, ctx);
    assert.strictEqual(results.length, 100);
    assert.strictEqual(results[99].metadata?._batchIndex, 99);
  });

  it("should reject a batch exceeding 100 events", async () => {
    const ws = await createTestWorkspace("batch-101");
    const ctx = createMockContext(ws) as any;
    const batch = Array.from({ length: 101 }, () => ({
      eventType: "too.many",
      entityType: "limit-test",
      entityId: randomUUID(),
      payload: {},
    }));

    await assert.rejects(async () => {
      await EventWriter.appendDomainEventBatch(batch, ctx);
    }, (err: any) => err instanceof EventStoreError && err.code === "BATCH_LIMIT_EXCEEDED");
  });

  it("should reject an empty batch", async () => {
    const ws = await createTestWorkspace("empty");
    const ctx = createMockContext(ws) as any;
    await assert.rejects(async () => {
      await EventWriter.appendDomainEventBatch([], ctx);
    }, (err: any) => err instanceof EventStoreError && err.code === "EMPTY_BATCH");
  });

  it("should rollback if the first event is invalid (Zod)", async () => {
    const ws = await createTestWorkspace("fail-first");
    const ctx = createMockContext(ws) as any;
    const batch = [
        { eventType: "", entityType: "ent", entityId: randomUUID(), payload: {} }, // Invalid
        { eventType: "valid", entityType: "ent", entityId: randomUUID(), payload: {} }
    ];

    await assert.rejects(async () => {
        await EventWriter.appendDomainEventBatch(batch as any, ctx);
    });

    const rowCount = await db.select({ val: count() }).from(events).where(eq(events.workspaceId, ws.id));
    assert.strictEqual(rowCount[0].val, 0);
  });

  it("should rollback if a middle event is invalid (Zod)", async () => {
    const ws = await createTestWorkspace("fail-middle");
    const ctx = createMockContext(ws) as any;
    const batch = [
        { eventType: "v1", entityType: "ent", entityId: randomUUID(), payload: {} },
        { eventType: "", entityType: "ent", entityId: randomUUID(), payload: {} }, // Invalid
        { eventType: "v2", entityType: "ent", entityId: randomUUID(), payload: {} }
    ];

    await assert.rejects(async () => {
        await EventWriter.appendDomainEventBatch(batch as any, ctx);
    });

    const rowCount = await db.select({ val: count() }).from(events).where(eq(events.workspaceId, ws.id));
    assert.strictEqual(rowCount[0].val, 0);
  });

  it("should rollback if the last event is invalid (Zod)", async () => {
    const ws = await createTestWorkspace("fail-last");
    const ctx = createMockContext(ws) as any;
    const batch = [
        { eventType: "v1", entityType: "ent", entityId: randomUUID(), payload: {} },
        { eventType: "v2", entityType: "ent", entityId: randomUUID(), payload: {} },
        { eventType: "", entityType: "ent", entityId: randomUUID(), payload: {} } // Invalid
    ];

    await assert.rejects(async () => {
        await EventWriter.appendDomainEventBatch(batch as any, ctx);
    });

    const rowCount = await db.select({ val: count() }).from(events).where(eq(events.workspaceId, ws.id));
    assert.strictEqual(rowCount[0].val, 0);
  });

  it("should rollback on REAL database failure in the middle of transaction", async () => {
    const ws = await createTestWorkspace("fail-db-real");
    const nonExistentWsId = randomUUID();
    const badWsCtx = createMockContext({ id: nonExistentWsId, key: "none" }) as any;

    const batch = [
        { eventType: "e1", entityType: "ent", entityId: randomUUID(), payload: {} },
        { eventType: "e2", entityType: "ent", entityId: randomUUID(), payload: {} }
    ];

    await assert.rejects(async () => {
        await EventWriter.appendDomainEventBatch(batch, badWsCtx);
    }, (err: any) => {
        return err.code === "TRANSACTION_FAILURE" || err.message.includes("foreign key") || err.code === "PERSISTENCE_FAILURE";
    });

    const rowCount = await db.select({ val: count() }).from(events).where(eq(events.workspaceId, ws.id));
    assert.strictEqual(rowCount[0].val, 0);
  });

  it("should reject context without workspace", async () => {
    const batch = [{ eventType: "e1", entityType: "ent", entityId: randomUUID(), payload: {} }];
    await assert.rejects(async () => {
        await EventWriter.appendDomainEventBatch(batch, {} as any);
    }, (err: any) => err instanceof EventStoreError && err.code === "MISSING_WORKSPACE_CONTEXT");
  });

  it("should reject invalid actorId in context", async () => {
    const ws = await createTestWorkspace("invalid-actor");
    const ctx = createMockContext(ws) as any;
    ctx.actor.id = "not-a-uuid";
    const batch = [{ eventType: "e1", entityType: "ent", entityId: randomUUID(), payload: {} }];
    await assert.rejects(async () => {
        await EventWriter.appendDomainEventBatch(batch, ctx);
    }, (err: any) => err instanceof EventStoreError && err.code === "INVALID_ACTOR_ID");
  });

  it("should ignore workspaceId in payload and use context", async () => {
    const ws = await createTestWorkspace("ws-protection");
    const ctx = createMockContext(ws) as any;
    const otherWsId = randomUUID();
    const batch = [{
        eventType: "e1",
        entityType: "ent",
        entityId: randomUUID(),
        payload: {},
        workspaceId: otherWsId
    } as any];

    const results = await EventWriter.appendDomainEventBatch(batch, ctx);
    assert.strictEqual(results[0].workspaceId, ws.id);
    assert.notStrictEqual(results[0].workspaceId, otherWsId);
  });

  it("should handle two independent batches", async () => {
    const ws = await createTestWorkspace("two-batches");
    const ctx = createMockContext(ws) as any;

    await EventWriter.appendDomainEventBatch([{ eventType: "b1", entityType: "ent", entityId: randomUUID(), payload: {} }], ctx);
    await EventWriter.appendDomainEventBatch([{ eventType: "b2", entityType: "ent", entityId: randomUUID(), payload: {} }], ctx);

    const rowCount = await db.select({ val: count() }).from(events).where(eq(events.workspaceId, ws.id));
    assert.strictEqual(rowCount[0].val, 2);
  });

  it("should preserve correlation and causation IDs", async () => {
    const ws = await createTestWorkspace("ids");
    const ctx = createMockContext(ws) as any;
    const corr = `corr-${randomUUID()}`;
    ctx.correlationId = corr;
    const caus = randomUUID();
    const batch = [{
        eventType: "e",
        entityType: "ent",
        entityId: randomUUID(),
        payload: {},
        causationId: caus
    }];

    const results = await EventWriter.appendDomainEventBatch(batch, ctx);
    assert.strictEqual(results[0].correlationId, corr);
    assert.strictEqual(results[0].causationId, caus);
  });

  it("should validate version (fixed to 1.0.0)", async () => {
    const ws = await createTestWorkspace("version");
    const ctx = createMockContext(ws) as any;
    const batch = [{
        eventType: "e",
        entityType: "ent",
        entityId: randomUUID(),
        payload: {}
    }];

    const results = await EventWriter.appendDomainEventBatch(batch, ctx);
    assert.strictEqual(results[0].schemaVersion, "1.0.0");
  });

  it("should maintain append-only behavior", async () => {
    const ws = await createTestWorkspace("append-only");
    const ctx = createMockContext(ws) as any;
    const entityId = randomUUID();

    await EventWriter.appendDomainEventBatch([{ eventType: "e1", entityType: "ent", entityId, payload: {v: 1} }], ctx);
    await EventWriter.appendDomainEventBatch([{ eventType: "e1", entityType: "ent", entityId, payload: {v: 2} }], ctx);

    const history = await EventWriter.getEntityHistory("ent", entityId, ctx);
    assert.strictEqual(history.length, 2);
  });

  it("should not break individual append", async () => {
    const ws = await createTestWorkspace("regress-indiv");
    const ctx = createMockContext(ws) as any;
    const result = await EventWriter.appendDomainEvent({ eventType: "indiv", entityType: "ent", entityId: randomUUID(), payload: {} }, ctx);
    assert.ok(result.id);

    const rowCount = await db.select({ val: count() }).from(events).where(eq(events.workspaceId, ws.id));
    assert.strictEqual(rowCount[0].val, 1);
  });
});
