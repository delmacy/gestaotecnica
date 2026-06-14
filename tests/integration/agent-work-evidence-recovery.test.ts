import { test } from "node:test";
import * as assert from "node:assert";
import { persistRecoveredActivityReceipt } from "../../src/agent-work/services/evidence-recovery";
import { createAgentWorkDb, closeAgentWorkDb } from "../../src/agent-work/db";
import { agentActivityReceipts, agentWorkPackages } from "../../src/agent-work/schema";
import { eq } from "drizzle-orm";
import * as fs from "fs";

test("Evidence Recovery Integration: Persistence and Status", async (t) => {
  const dbUrl = process.env.AGENT_WORK_TEST_DATABASE_URL;
  if (!dbUrl) return;
  const db = createAgentWorkDb(dbUrl);
  const packageKey = "TEST-PKG-PERSIST-001";
  await db.delete(agentActivityReceipts).where(eq(agentActivityReceipts.packageKey, packageKey));
  await db.delete(agentWorkPackages).where(eq(agentWorkPackages.key, packageKey));

  await db.insert(agentWorkPackages).values({
    key: packageKey, title: "Test", moduleKey: "shared-contracts", laneKey: "L1", workerRole: "W", waveKey: "W1", packageSize: "S", priority: 1, status: "ready", objective: "O", expectedOutcome: "E", baseBranch: "B", baseSha: "S1", targetBranch: "T", integrationBranch: "I", ownedPaths: [], readOnlyPaths: [], forbiddenPaths: [], readFirst: [], requiredTests: [], acceptanceCriteria: [], documentationImpacts: [], integrationRisk: "L", mergeOrder: 1, createdBy: "T", contractsConsumed: [], contractsProduced: [], publicContractsChanged: [], knownConsumers: [], schemaImpacts: [], reviewBudget: {}
  });

  const input = { packageKey, originalWorkerKey: "W1", pullRequest: "1", baseSha: "S1", headSha: "S2", mergeCommitSha: "S3", targetBranch: "T", expectedFiles: [], verificationCommands: [], contractsConsumed: [], contractsProduced: [], documentationImpacts: [], frontendImpact: "N", handoff: "H", rollbackNotes: "R" };
  const pkg = (await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, packageKey)))[0];
  const diffInfo = { changedFiles: ["f1.ts"], ownershipResult: { valid: true, ownedFiles: ["f1.ts"], readOnlyViolations: [], forbiddenViolations: [], outsideOwnership: [] } };

  const receipt = await persistRecoveredActivityReceipt(input, pkg, diffInfo, []);
  assert.ok(receipt.id.startsWith("ACT-RECOVERY-"));

  const [dbReceipt] = await db.select().from(agentActivityReceipts).where(eq(agentActivityReceipts.id, receipt.id));
  assert.strictEqual(dbReceipt.status, "recovered_post_merge");

  if (fs.existsSync(dbReceipt.path)) fs.unlinkSync(dbReceipt.path);
  await db.delete(agentActivityReceipts).where(eq(agentActivityReceipts.packageKey, packageKey));
  await db.delete(agentWorkPackages).where(eq(agentWorkPackages.key, packageKey));
  await closeAgentWorkDb();
});
