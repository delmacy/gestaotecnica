import "dotenv/config";
import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { getRuntimeDb, closeDatabaseConnections } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import {
  createTestWorkspace,
  createMockContext,
  mockWorkspaceContext
} from "../helpers/isolation-helper";

const db = getRuntimeDb();

test("Work Intake Multi-tenant Isolation", async (t) => {
  const wsA = await createTestWorkspace("wsA");
  const wsB = await createTestWorkspace("wsB");

  const ctxA = createMockContext(wsA);
  const ctxB = createMockContext(wsB);

  // Import queries with mocked context
  const queriesA = mockWorkspaceContext("../../src/modules/work-intake/queries", ctxA);
  const queriesB = mockWorkspaceContext("../../src/modules/work-intake/queries", ctxB);

  await t.test("listings do not return records from another workspace", async () => {
    // Seed record for WS A
    const idA = randomUUID();
    await db.insert(processCandidates).values({
      id: idA,
      workspaceId: wsA.id,
      name: "Request A",
      status: "new",
      origin: "manual",
    });

    // Seed record for WS B
    const idB = randomUUID();
    await db.insert(processCandidates).values({
      id: idB,
      workspaceId: wsB.id,
      name: "Request B",
      status: "new",
      origin: "manual",
    });

    const requestsA = await queriesA.getIntakeRequests();
    const requestsB = await queriesB.getIntakeRequests();

    assert.ok(requestsA.some((r: any) => r.id === idA), "WS A listing should contain its own record");
    assert.ok(!requestsA.some((r: any) => r.id === idB), "WS A listing should NOT contain WS B record");

    assert.ok(requestsB.some((r: any) => r.id === idB), "WS B listing should contain its own record");
    assert.ok(!requestsB.some((r: any) => r.id === idA), "WS B listing should NOT contain WS A record");
  });

  await t.test("detail by ID does not allow cross-tenant access", async () => {
    const idA = randomUUID();
    await db.insert(processCandidates).values({
      id: idA,
      workspaceId: wsA.id,
      name: "Private A",
      status: "new",
    });

    const request = await queriesB.getIntakeRequestById(idA);
    assert.equal(request, null, "Should not be able to fetch record from another workspace by ID");
  });

  await t.test("history does not mix events", async () => {
    const idA = randomUUID();
    const idB = randomUUID();

    await db.insert(processCandidates).values([
      { id: idA, workspaceId: wsA.id, name: "A", status: "new" },
      { id: idB, workspaceId: wsB.id, name: "B", status: "new" },
    ]);

    await db.insert(eventLogs).values([
      {
        id: randomUUID(),
        workspaceId: wsA.id,
        entityId: idA,
        entityType: "process_candidate",
        eventType: "work_intake.created",
        payload: { title: "A created" }
      },
      {
        id: randomUUID(),
        workspaceId: wsB.id,
        entityId: idB,
        entityType: "process_candidate",
        eventType: "work_intake.created",
        payload: { title: "B created" }
      },
    ]);

    const historyA = await queriesA.getIntakeHistory(idA);
    const historyB = await queriesB.getIntakeHistory(idB);

    assert.equal(historyA.length, 1);
    assert.equal((historyA[0].payload as any).title, "A created");

    assert.equal(historyB.length, 1);
    assert.equal((historyB[0].payload as any).title, "B created");

    // Attempt to read A's history using B's context
    const historyAcross = await queriesB.getIntakeHistory(idA);
    assert.equal(historyAcross.length, 0, "History should be empty when accessing cross-tenant entity");
  });
});

after(async () => {
  await closeDatabaseConnections();
});
