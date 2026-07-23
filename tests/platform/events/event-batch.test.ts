import { describe, it, before } from "node:test";
import assert from "node:assert";
import { randomUUID } from "node:crypto";
import { EventWriter } from "../../../src/platform/events/event-writer";
import { getRuntimeDb } from "../../../src/db";
import { workspaces } from "../../../src/db/runtime/schema/workspace";
import type { WorkspaceContext } from "../../../src/platform/workspace/workspace-context";
import { EventStoreError } from "../../../src/platform/events/errors/event-errors";
import { sql } from "drizzle-orm";

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
    environmentMode: "real",
    enabledModules: ["events"],
    scopes: ["*"],
    correlationId: `test-corr-${randomUUID()}`,
  };
}

describe("EventWriter - Transactional Batch", () => {
  let workspace1: { id: string; key: string };
  let workspace2: { id: string; key: string };
  let ctx1: WorkspaceContext;
  let ctx2: WorkspaceContext;

  before(async () => {
      workspace1 = await createTestWorkspace("ws-batch-" + randomUUID());
      workspace2 = await createTestWorkspace("ws-batch-" + randomUUID());
      ctx1 = createMockContext(workspace1);
      ctx2 = createMockContext(workspace2);
  });

  it("should append a batch with 1 event", async () => {
    const batch = [
      { eventType: "batch.e1", entityType: "ent", entityId: randomUUID(), payload: { step: 1 } },
    ];
    const results = await EventWriter.appendDomainEventBatch(batch, ctx1);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].eventType, "batch.e1");
  });

  it("should append a batch with 2 events", async () => {
    const batch = [
      { eventType: "batch.e1", entityType: "ent", entityId: randomUUID(), payload: { step: 1 } },
      { eventType: "batch.e2", entityType: "ent", entityId: randomUUID(), payload: { step: 2 } },
    ];
    const results = await EventWriter.appendDomainEventBatch(batch, ctx1);
    assert.strictEqual(results.length, 2);
  });

  it("should append a batch with 10 events", async () => {
    const batch = Array.from({ length: 10 }, (_, i) => ({
      eventType: `batch.e${i}`,
      entityType: "ent",
      entityId: randomUUID(),
      payload: { step: i },
    }));
    const results = await EventWriter.appendDomainEventBatch(batch, ctx1);
    assert.strictEqual(results.length, 10);
  });

  it("should append a batch exactly at the limit (100)", async () => {
    const batch = Array.from({ length: 100 }, (_, i) => ({
      eventType: `batch.limit.e${i}`,
      entityType: "ent",
      entityId: randomUUID(),
      payload: { step: i },
    }));
    const results = await EventWriter.appendDomainEventBatch(batch, ctx1);
    assert.strictEqual(results.length, 100);
  });

  it("should reject batch above the limit", async () => {
    const batch = Array.from({ length: 101 }, (_, i) => ({
      eventType: `batch.over.e${i}`,
      entityType: "ent",
      entityId: randomUUID(),
      payload: { step: i },
    }));
    await assert.rejects(
      EventWriter.appendDomainEventBatch(batch, ctx1),
      (err: any) => err instanceof EventStoreError && err.code === "BATCH_LIMIT_EXCEEDED"
    );
  });

  it("should reject empty batch", async () => {
    await assert.rejects(
      EventWriter.appendDomainEventBatch([], ctx1),
      (err: any) => err instanceof EventStoreError && err.code === "EMPTY_BATCH"
    );
  });

  it("should fail and rollback if first event is invalid", async () => {
    const batch = [
      { eventType: "", entityType: "ent", entityId: randomUUID(), payload: {} },
      { eventType: "valid", entityType: "ent", entityId: randomUUID(), payload: {} },
    ];
    await assert.rejects(EventWriter.appendDomainEventBatch(batch as any, ctx1));
  });

  it("should fail and rollback if middle event is invalid", async () => {
    const batch = [
      { eventType: "valid1", entityType: "ent", entityId: randomUUID(), payload: {} },
      { eventType: "", entityType: "ent", entityId: randomUUID(), payload: {} },
      { eventType: "valid2", entityType: "ent", entityId: randomUUID(), payload: {} },
    ];
    await assert.rejects(EventWriter.appendDomainEventBatch(batch as any, ctx1));
  });

  it("should fail and rollback if last event is invalid", async () => {
    const batch = [
      { eventType: "valid1", entityType: "ent", entityId: randomUUID(), payload: {} },
      { eventType: "", entityType: "ent", entityId: randomUUID(), payload: {} },
    ];
    await assert.rejects(EventWriter.appendDomainEventBatch(batch as any, ctx1));
  });

  it("should rollback all events if a database failure occurs mid-batch (trigger proof)", async () => {
    const db = getRuntimeDb();
    const traceType = "trace-rollback-" + randomUUID();
    const funcName = "fn_fail_on_trace_" + randomUUID().replace(/-/g, "_");
    const trigName = "trig_fail_on_trace_" + randomUUID().replace(/-/g, "_");

    // 2. Consulte a contagem inicial diretamente
    const initialRows = await db.execute(sql`
        SELECT count(*)::integer as count FROM "workflow"."events"
        WHERE "workspace_id" = ${ctx1.workspaceId} AND "event_type" = ${traceType}
    `);
    const initialCount = Number(initialRows[0].count);

    try {
        // 3. Crie função PL/pgSQL que execute RAISE EXCEPTION
        await db.execute(sql`
            CREATE OR REPLACE FUNCTION ${sql.raw(funcName)}()
            RETURNS TRIGGER AS $$
            BEGIN
                IF NEW.event_type = ${traceType} AND (NEW.payload->>'n') = '2' THEN
                    RAISE EXCEPTION 'Simulated failure on second item';
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // 4. Crie trigger BEFORE INSERT
        await db.execute(sql`
            CREATE TRIGGER ${sql.raw(trigName)}
            BEFORE INSERT ON "workflow"."events"
            FOR EACH ROW
            EXECUTE FUNCTION ${sql.raw(funcName)}();
        `);

        // 5. Execute appendDomainEventBatch com dois eventos
        const batch = [
            { eventType: traceType, entityType: "ent", entityId: randomUUID(), payload: { n: 1 } },
            { eventType: traceType, entityType: "ent", entityId: randomUUID(), payload: { n: 2 } },
        ];

        // 6. Valide EventStoreError.code === "TRANSACTION_FAILURE"
        await assert.rejects(
            EventWriter.appendDomainEventBatch(batch, ctx1),
            (err: any) => err instanceof EventStoreError && err.code === "TRANSACTION_FAILURE"
        );

    } finally {
        // 7. Use try/finally para sempre executar DROP
        await db.execute(sql`DROP TRIGGER IF EXISTS ${sql.raw(trigName)} ON "workflow"."events"`);
        await db.execute(sql`DROP FUNCTION IF EXISTS ${sql.raw(funcName)}()`);
    }

    // 8. Consulte a contagem final diretamente e comprove igualdade
    const finalRows = await db.execute(sql`
        SELECT count(*)::integer as count FROM "workflow"."events"
        WHERE "workspace_id" = ${ctx1.workspaceId} AND "event_type" = ${traceType}
    `);
    const finalCount = Number(finalRows[0].count);

    assert.strictEqual(finalCount, initialCount, "No events should be persisted after rollback (trigger proof)");
  });

  it("should reject if workspace context is missing", async () => {
    await assert.rejects(
      EventWriter.appendDomainEventBatch([{ eventType: "e", entityType: "ent", entityId: randomUUID(), payload: {} }], {} as any),
      (err: any) => err instanceof EventStoreError && err.code === "MISSING_WORKSPACE_CONTEXT"
    );
  });

  it("should reject if actor ID is invalid UUID", async () => {
    const badCtx = { ...ctx1, actor: { ...ctx1.actor, id: "not-a-uuid" } } as any;
    await assert.rejects(
      EventWriter.appendDomainEventBatch([{ eventType: "e", entityType: "ent", entityId: randomUUID(), payload: {} }], badCtx),
      (err: any) => err instanceof EventStoreError && err.code === "INVALID_ACTOR_ID"
    );
  });

  it("should ignore workspaceId in payload and use context instead", async () => {
    const event: any = {
        eventType: "e",
        entityType: "ent",
        entityId: randomUUID(),
        payload: { workspaceId: "malicious-id" },
        workspaceId: "other-id"
    };
    const results = await EventWriter.appendDomainEventBatch([event], ctx1);
    assert.strictEqual(results[0].workspaceId, ctx1.workspaceId);
  });

  it("should maintain isolation between two workspaces", async () => {
    const batch1 = [{ eventType: "w1.e", entityType: "ent", entityId: randomUUID(), payload: {} }];
    const batch2 = [{ eventType: "w2.e", entityType: "ent", entityId: randomUUID(), payload: {} }];

    const [r1] = await EventWriter.appendDomainEventBatch(batch1, ctx1);
    const [r2] = await EventWriter.appendDomainEventBatch(batch2, ctx2);

    const h1 = await EventWriter.getWorkspaceEventStream(ctx1);
    const h2 = await EventWriter.getWorkspaceEventStream(ctx2);

    assert.ok(h1.some(e => e.id === r1.id));
    assert.ok(!h1.some(e => e.id === r2.id));
    assert.ok(h2.some(e => e.id === r2.id));
    assert.ok(!h2.some(e => e.id === r1.id));
  });

  it("should recover independent batches in original order", async () => {
    const batchA = [
        { eventType: "batch.A", entityType: "ent", entityId: randomUUID(), payload: { i: 0 } },
        { eventType: "batch.A", entityType: "ent", entityId: randomUUID(), payload: { i: 1 } },
    ];
    const batchB = [
        { eventType: "batch.B", entityType: "ent", entityId: randomUUID(), payload: { i: 0 } },
        { eventType: "batch.B", entityType: "ent", entityId: randomUUID(), payload: { i: 1 } },
    ];

    const resA = await EventWriter.appendDomainEventBatch(batchA, ctx1);
    const resB = await EventWriter.appendDomainEventBatch(batchB, ctx1);

    const batchIdA = (resA[0].metadata as any).batchId;
    const batchIdB = (resB[0].metadata as any).batchId;

    assert.ok(batchIdA);
    assert.ok(batchIdB);
    assert.notStrictEqual(batchIdA, batchIdB);

    const recoveredA = await EventWriter.getBatch(batchIdA, ctx1);
    const recoveredB = await EventWriter.getBatch(batchIdB, ctx1);

    assert.strictEqual(recoveredA.length, 2);
    assert.strictEqual(recoveredA[0].payload.i, 0);
    assert.strictEqual(recoveredA[1].payload.i, 1);

    assert.strictEqual(recoveredB.length, 2);
    assert.strictEqual(recoveredB[0].payload.i, 0);
    assert.strictEqual(recoveredB[1].payload.i, 1);
  });

  it("should preserve correlationId from context or event", async () => {
      const corrId = "custom-corr-" + randomUUID();
      const batch = [{ eventType: "e", entityType: "ent", entityId: randomUUID(), payload: {}, correlationId: corrId }];

      const results = await EventWriter.appendDomainEventBatch(batch, ctx1);
      assert.strictEqual(results[0].correlationId, ctx1.correlationId);

      const ctxNoCorr = { ...ctx1, correlationId: "" } as any;
      const results2 = await EventWriter.appendDomainEventBatch(batch, ctxNoCorr);
      assert.strictEqual(results2[0].correlationId, corrId);
  });

  it("should preserve causationId", async () => {
    const causId = "caus-" + randomUUID();
    const batch = [{ eventType: "e", entityType: "ent", entityId: randomUUID(), payload: {}, causationId: causId }];
    const results = await EventWriter.appendDomainEventBatch(batch, ctx1);
    assert.strictEqual(results[0].causationId, causId);
  });

  it("should have schemaVersion 1.0.0", async () => {
    const batch = [{ eventType: "e", entityType: "ent", entityId: randomUUID(), payload: {} }];
    const results = await EventWriter.appendDomainEventBatch(batch, ctx1);
    assert.strictEqual(results[0].schemaVersion, "1.0.0");
  });

  it("should preserve T07 idempotency within and across batches", async () => {
    const ideKey = "key-" + randomUUID();
    const event = { eventType: "e", entityType: "ent", entityId: randomUUID(), payload: {}, idempotencyKey: ideKey };

    const results = await EventWriter.appendDomainEventBatch([event, event], ctx1);
    assert.strictEqual(results[0].id, results[1].id, "Should return same event ID for duplicate idempotency key in batch");

    const results2 = await EventWriter.appendDomainEventBatch([event], ctx1);
    assert.strictEqual(results2[0].id, results[0].id, "Should return same event ID for duplicate idempotency key across batches");
  });

  it("should keep individual append working", async () => {
    const event = { eventType: "individual", entityType: "ent", entityId: randomUUID(), payload: {} };
    const result = await EventWriter.appendDomainEvent(event, ctx1);
    assert.strictEqual(result.eventType, "individual");
  });

  it("should throw EventStoreError with correct codes", async () => {
    try {
        await EventWriter.appendDomainEventBatch([], ctx1);
        assert.fail("Should have thrown");
    } catch (e: any) {
        assert.ok(e instanceof EventStoreError);
        assert.strictEqual(e.code, "EMPTY_BATCH");
    }
  });
});
