import { test } from "node:test";
import assert from "node:assert/strict";
import proxyquire from "proxyquire";

test("Reporting queries ensure strict workspace isolation by blocking unisolated data", async () => {
  const { getOperationalReportData, getReports } = proxyquire("../../src/modules/reports/queries", {
    "@/db": { getDb: () => ({}) },
    "@/platform/workspaces/bootstrap": {
      ensureActiveWorkspaceConfig: async () => ({ id: "workspace-1" }),
    },
  });

  // Test Workspace 1
  const data1 = await getOperationalReportData();
  const reports1 = await getReports();

  assert.strictEqual(reports1.length, 0, "Reports should be empty for Workspace 1 due to missing isolation column");
  assert.strictEqual(data1.cards.find((c: any) => c.label === "Demandas")?.value, 0, "Aggregates should be 0 for Workspace 1");

  // Mock another workspace
  const { getOperationalReportData: getOps2, getReports: getReports2 } = proxyquire("../../src/modules/reports/queries", {
    "@/db": { getDb: () => ({}) },
    "@/platform/workspaces/bootstrap": {
      ensureActiveWorkspaceConfig: async () => ({ id: "workspace-2" }),
    },
  });

  // Test Workspace 2
  const data2 = await getOps2();
  const reports2 = await getReports2();

  assert.strictEqual(reports2.length, 0, "Reports should be empty for Workspace 2 due to missing isolation column");
  assert.strictEqual(data2.cards.find((c: any) => c.label === "Demandas")?.value, 0, "Aggregates should be 0 for Workspace 2");
});
