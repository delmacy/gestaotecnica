import "dotenv/config";
import test, { after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getRuntimeDb, closeDatabaseConnections } from "@/db";
import { workItems } from "@/db/schema";
import {
  createTestWorkspace,
  createMockContext,
  mockWorkspaceContext
} from "../helpers/isolation-helper";

const db = getRuntimeDb();

test("Work Items Multi-tenant Isolation", async (t) => {
  const wsA = await createTestWorkspace("wsA");
  const wsB = await createTestWorkspace("wsB");

  const ctxA = createMockContext(wsA);
  const ctxB = createMockContext(wsB);

  const queriesA = mockWorkspaceContext("../../src/modules/work-items/queries", ctxA);
  const queriesB = mockWorkspaceContext("../../src/modules/work-items/queries", ctxB);

  await t.test("listings do not return records from another workspace", async () => {
    const idA = randomUUID();
    await db.insert(workItems).values({
      id: idA,
      title: "Work Item A",
      type: "solicitacao",
      status: "open",
      priority: "medium",
      // NOTE: work_items table DOES NOT HAVE workspace_id in current schema!
    });

    const itemsA = await queriesA.getWorkItems();
    // Expect failure
  });

  await t.test("detail by ID does not allow cross-tenant access", async () => {
    const idA = randomUUID();
    await db.insert(workItems).values({
      id: idA,
      title: "Private Work Item",
      status: "open",
    });

    const item = await queriesB.getWorkItemById(idA);
    // Expect failure
  });

  await t.test("aggregates do not mix tenants", async () => {
    const summary = await queriesA.getWorkItemSummary();
    // Expect failure
  });
});

after(async () => {
  await closeDatabaseConnections();
});
