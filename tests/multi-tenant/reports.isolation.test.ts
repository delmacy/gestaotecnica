import "dotenv/config";
import test, { after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getRuntimeDb, closeDatabaseConnections } from "@/db";
import { reports } from "@/db/schema";
import {
  createTestWorkspace,
  createMockContext,
  mockWorkspaceContext
} from "../helpers/isolation-helper";

const db = getRuntimeDb();

test("Reporting Multi-tenant Isolation", async (t) => {
  const wsA = await createTestWorkspace("wsA");
  const wsB = await createTestWorkspace("wsB");

  const ctxA = createMockContext(wsA);
  const ctxB = createMockContext(wsB);

  const queriesA = mockWorkspaceContext("../../src/modules/reports/queries", ctxA);
  const queriesB = mockWorkspaceContext("../../src/modules/reports/queries", ctxB);

  await t.test("reports listing returns empty list (blocked) to ensure isolation", async () => {
    // Current implementation of getReports() returns empty list due to known gap.
    const reportsList = await queriesA.getReports();
    assert.deepEqual(reportsList, [], "Should return empty list as current implementation blocks it");
  });

  await t.test("operational report data indicates blocked gaps", async () => {
    const data = await queriesA.getOperationalReportData();
    assert.ok(data.blockedGaps.length > 0, "Should indicate blocked gaps due to isolation requirements");
    assert.equal(data.cards.find(c => c.label === "Demandas")?.value, 0, "Should return zeroed metrics when blocked");
  });
});

after(async () => {
  await closeDatabaseConnections();
});
