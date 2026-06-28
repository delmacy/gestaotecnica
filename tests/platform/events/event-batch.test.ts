import { describe, it } from "node:test";
import assert from "node:assert";
import { EventWriter } from "../../../src/platform/events/event-writer";
import { randomUUID } from "node:crypto";
import type { WorkspaceContext } from "../../../src/platform/workspace/workspace-context";
import { getRuntimeDb } from "../../../src/db";
import { events } from "../../../src/db/runtime/schema/workflow";
import { eq, count } from "drizzle-orm";
import { createTestWorkspace, createMockContext } from "../../helpers/event-test-helper";

describe("EventWriter Batch Operations", () => {
  let workspace1: { id: string, key: string };
  let ctx1: WorkspaceContext;
  const db = getRuntimeDb();

  it("should append a batch of 10 events successfully and preserve order", async () => {
    workspace1 = await createTestWorkspace("batch-1");
    ctx1 = createMockContext(workspace1) as any;

    const entityId = randomUUID();
    const batch = Array.from({ length: 10 }, (_, i) => ({
      eventType: `test.event.${i}`,
      entityType: "test-batch-entity",
      entityId,
      payload: { index: i },
    }));

    const results = await EventWriter.appendDomainEventBatch(batch, ctx1);

    assert.strictEqual(results.length, 10);
    results.forEach((res, i) => {
      assert.strictEqual(res.eventType, `test.event.${i}`);
      assert.strictEqual(res.payload.index, i);
      assert.strictEqual(res.workspaceId, workspace1.id);
      assert.strictEqual(res.metadata?._batchIndex, i);
    });

    const history = await EventWriter.getEntityHistory("test-batch-entity", entityId, ctx1);
    assert.strictEqual(history.length, 10);

    // Verify all batch indices are present
    const foundIndices = history.map(h => h.metadata?._batchIndex).sort((a, b) => Number(a) - Number(b));
    for(let i = 0; i < 10; i++) {
        assert.strictEqual(foundIndices[i], i);
    }
  });

  it("should rollback the entire batch if an intermediate event is invalid", async () => {
    const wsRollback = await createTestWorkspace("rollback");
    const ctxRollback = createMockContext(wsRollback) as any;
    const entityId = randomUUID();

    const validEvent = {
      eventType: "valid.event",
      entityType: "test-rollback",
      entityId,
      payload: {},
    };
    const invalidEvent = {
      eventType: "", // Invalid
      entityType: "test-rollback",
      entityId,
      payload: {},
    };

    const batch = [validEvent, invalidEvent, validEvent];

    const countBefore = await db
      .select({ val: count() })
      .from(events)
      .where(eq(events.workspaceId, wsRollback.id));

    await assert.rejects(async () => {
      await EventWriter.appendDomainEventBatch(batch as any, ctxRollback);
    }, (err: any) => {
      return err.name === 'ZodError' || err.message.toLowerCase().includes('validation');
    });

    const countAfter = await db
      .select({ val: count() })
      .from(events)
      .where(eq(events.workspaceId, wsRollback.id));

    assert.strictEqual(countAfter[0].val, countBefore[0].val, "No events should be persisted if batch fails");

    const history = await EventWriter.getEntityHistory("test-rollback", entityId, ctxRollback);
    assert.strictEqual(history.length, 0, "No history should exist for failed batch");
  });

  it("should reject an empty batch", async () => {
    const wsEmpty = await createTestWorkspace("empty");
    const ctxEmpty = createMockContext(wsEmpty) as any;
    await assert.rejects(async () => {
      await EventWriter.appendDomainEventBatch([], ctxEmpty);
    }, /empty batch/i);
  });

  it("should reject a batch exceeding the limit", async () => {
    const wsLimit = await createTestWorkspace("limit");
    const ctxLimit = createMockContext(wsLimit) as any;
    const largeBatch = Array.from({ length: 101 }, () => ({
      eventType: "too.many",
      entityType: "limit-test",
      entityId: randomUUID(),
      payload: {},
    }));

    await assert.rejects(async () => {
      await EventWriter.appendDomainEventBatch(largeBatch, ctxLimit);
    }, /exceeds limit/i);
  });

  it("should maintain workspace isolation in batch appends", async () => {
    const wsIso1 = await createTestWorkspace("iso-1");
    const wsIso2 = await createTestWorkspace("iso-2");
    const ctxIso1 = createMockContext(wsIso1) as any;
    const ctxIso2 = createMockContext(wsIso2) as any;

    const entityId = randomUUID();
    const batch1 = [{ eventType: "e.ws1", entityType: "ent", entityId, payload: {} }];
    const batch2 = [{ eventType: "e.ws2", entityType: "ent", entityId, payload: {} }];

    await EventWriter.appendDomainEventBatch(batch1, ctxIso1);
    await EventWriter.appendDomainEventBatch(batch2, ctxIso2);

    const history1 = await EventWriter.getEntityHistory("ent", entityId, ctxIso1);
    const history2 = await EventWriter.getEntityHistory("ent", entityId, ctxIso2);

    assert.strictEqual(history1.length, 1);
    assert.strictEqual(history1[0].eventType, "e.ws1");
    assert.strictEqual(history2.length, 1);
    assert.strictEqual(history2[0].eventType, "e.ws2");
  });

  it("should preserve input order in result return", async () => {
    const wsOrder = await createTestWorkspace("order-result");
    const ctxOrder = createMockContext(wsOrder) as any;
    const entityId = randomUUID();

    const batch = [
      { eventType: "first", entityType: "order", entityId, payload: {} },
      { eventType: "second", entityType: "order", entityId, payload: {} },
      { eventType: "third", entityType: "order", entityId, payload: {} },
    ];

    const results = await EventWriter.appendDomainEventBatch(batch, ctxOrder);
    assert.strictEqual(results[0].eventType, "first");
    assert.strictEqual(results[1].eventType, "second");
    assert.strictEqual(results[2].eventType, "third");
  });
});
