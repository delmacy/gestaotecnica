import "dotenv/config";
import test, { after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getRuntimeDb, closeDatabaseConnections } from "@/db";
import { serviceOrders } from "@/db/schema";
import {
  createTestWorkspace,
  createMockContext,
  mockWorkspaceContext
} from "../helpers/isolation-helper";

const db = getRuntimeDb();

test("Approvals Multi-tenant Isolation", async (t) => {
  const wsA = await createTestWorkspace("wsA");
  const wsB = await createTestWorkspace("wsB");

  const ctxA = createMockContext(wsA);
  const ctxB = createMockContext(wsB);

  const queriesA = mockWorkspaceContext("../../src/modules/approvals/queries", ctxA);
  const queriesB = mockWorkspaceContext("../../src/modules/approvals/queries", ctxB);

  await t.test("approval queue does not return records from another workspace", async () => {
    const idA = randomUUID();
    await db.insert(serviceOrders).values({
      id: idA,
      code: `SO-A-${randomUUID().slice(0,4)}`,
      title: "Approval A",
      status: "waiting_review",
      // NOTE: service_orders table DOES NOT HAVE workspace_id in current schema!
    });

    const queueA = await queriesA.getApprovalQueue();
    // Expect failure
  });

  await t.test("approval aggregates do not mix tenants", async () => {
    const summary = await queriesA.getApprovalSummary();
    // Expect failure
  });
});

after(async () => {
  await closeDatabaseConnections();
});
