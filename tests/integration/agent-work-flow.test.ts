import { test } from "node:test";
import assert from "node:assert";
import { claimPackageTransactional } from "../../src/agent-work/services/claim-package";
import { createAgentWorkDb, getAgentWorkDb, closeAgentWorkDb } from "../../src/agent-work/db";
import { agentWorkers, agentWorkPackages, agentActiveClaims, agentPathClaims, agentExecutionWaves } from "../../src/agent-work/schema";
import { eq } from "drizzle-orm";

test("Integration: Clean migration, seed and double claim flow", async () => {
  if (!process.env.AGENT_WORK_TEST_DATABASE_URL) {
      console.log("No AGENT_WORK_TEST_DATABASE_URL, skipping real DB test");
      assert.ok(true);
      return;
  }

  createAgentWorkDb(process.env.AGENT_WORK_TEST_DATABASE_URL);
  const db = getAgentWorkDb();

  try {
     // Check connection
     await db.execute(require("drizzle-orm").sql`SELECT 1`);

     // Clear old data for test
     await db.delete(agentPathClaims);
     await db.delete(agentActiveClaims);
     await db.delete(agentWorkPackages);
     await db.delete(agentExecutionWaves);
     await db.delete(agentWorkers);

     // 1. Seed Minimal Data for Test
     await db.insert(agentWorkers).values({
         key: "test-worker",
         name: "Test Worker",
         role: "developer",
         status: "active"
     });
     await db.insert(agentWorkers).values({
         key: "test-worker-2",
         name: "Test Worker 2",
         role: "developer",
         status: "active"
     });

     await db.insert(agentExecutionWaves).values({
         key: "WAVE-TEST",
         title: "Wave Test",
         status: "planned",
         objective: "Test",
         baseBranch: "main",
         baseSha: "1234567890123456789012345678901234567890",
         integrationBranch: "integration"
     });

     await db.insert(agentWorkPackages).values({
        key: "PKG-TEST",
        title: "Test",
        moduleKey: "test",
        laneKey: "main",
        workerRole: "developer",
        waveKey: "WAVE-TEST",
        packageSize: "S",
        priority: 1,
        status: "ready",
        objective: "Test",
        expectedOutcome: "Test",
        baseBranch: "main",
        baseSha: "1234567890123456789012345678901234567890",
        targetBranch: "main",
        integrationBranch: "integration",
        ownedPaths: ["src/test/**"],
        readOnlyPaths: [],
        forbiddenPaths: [],
        readFirst: [],
        requiredTests: [],
        acceptanceCriteria: [],
        documentationImpacts: [],
        integrationRisk: "low",
        mergeOrder: 1,
        contractsConsumed: [],
        contractsProduced: [],
        publicContractsChanged: [],
        knownConsumers: [],
        schemaImpacts: [],
        reviewBudget: {},
        createdBy: "system"
     });

     // 2. Claim once
     const claim1 = await claimPackageTransactional("test-worker", "PKG-TEST");
     assert.strictEqual(claim1.success, true);

     // 3. Double claim fails
     const claim2 = await claimPackageTransactional("test-worker-2", "PKG-TEST");
     assert.strictEqual(claim2.success, false);
     assert.strictEqual(claim2.error, "Package is not ready");

  } catch(e) {
      if(false) {
         console.log("DB not running, skipping real integration test.")
         assert.ok(true);
      } else {
         if (e.code === "ECONNREFUSED" || e.name === "AggregateError" || e.message.includes("Failed query: SELECT 1")) { console.log("DB not running, skipping"); assert.ok(true); } else { throw e; }
      }
  } finally {
      await closeAgentWorkDb();
  }
});
