import assert from "node:assert";
import { test } from "node:test";
import { eq } from "drizzle-orm";
import { closeAgentWorkDb, createAgentWorkDb, getAgentWorkDb } from "../../src/agent-work/db";
import { agentModules, agentPackageTasks, agentWorkers, agentWorkPackages } from "../../src/agent-work/schema";
import { claimPackageTransactional } from "../../src/agent-work/services/claim-package";
import { evaluatePackageReadiness } from "../../src/agent-work/services/package-readiness";

test("Wave 01 seed is executable and blocks unsafe claims", async () => {
  assert.ok(process.env.AGENT_WORK_TEST_DATABASE_URL?.includes("agent_work_test"));
  createAgentWorkDb(process.env.AGENT_WORK_TEST_DATABASE_URL);
  const db = getAgentWorkDb();
  try {
    assert.ok((await db.select().from(agentModules)).length >= 4);
    assert.ok((await db.select().from(agentWorkers)).length >= 10);
    assert.ok((await db.select().from(agentWorkPackages)).length >= 5);
    assert.ok((await db.select().from(agentPackageTasks)).length >= 15);

    for (const packageKey of [
      "PKG-SHARED-CONTRACTS-001",
      "PKG-RUNTIME-TYPES-MAPPERS-001",
      "PKG-EVENT-TYPES-MAPPERS-001",
      "PKG-OPERATION-DOCS-FOUNDATION-001",
    ]) {
      const readiness = await evaluatePackageReadiness(packageKey);
      assert.deepStrictEqual(readiness.reasons, []);
    }

    const blocked = await claimPackageTransactional("jules-dev-runtime-types-01", "PKG-RUNTIME-TENANCY-001");
    assert.strictEqual(blocked.success, false);
    const incompatible = await claimPackageTransactional("jules-documentator-01", "PKG-RUNTIME-TYPES-MAPPERS-001");
    assert.strictEqual(incompatible.success, false);
    const tenancy = (await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, "PKG-RUNTIME-TENANCY-001")))[0];
    assert.strictEqual(tenancy.status, "blocked");
  } finally {
    await closeAgentWorkDb();
  }
});
