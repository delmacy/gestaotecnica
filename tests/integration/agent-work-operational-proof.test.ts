import assert from "node:assert";
import { test } from "node:test";
import { eq, inArray } from "drizzle-orm";
import { closeAgentWorkDb, createAgentWorkDb, getAgentWorkDb } from "../../src/agent-work/db";
import {
    agentModules,
    agentWorkers,
    agentWorkPackages,
    agentPackageTasks,
    agentPackageDependencies,
    agentOperationalArtifacts
} from "../../src/agent-work/schema";
import { claimPackageTransactional } from "../../src/agent-work/services/claim-package";
import { evaluatePackageReadiness } from "../../src/agent-work/services/package-readiness";
import { seedWave01 } from "../../src/agent-work/seeds/wave-01";
import { runOperationalProof } from "../../src/agent-work/services/operational-proof";

test("Wave 01 End-to-End Operational Proof Integration", async () => {
  const dbUrl = process.env.AGENT_WORK_TEST_DATABASE_URL;
  assert.ok(dbUrl?.includes("agent_work_test"), "Must use isolated test database");

  createAgentWorkDb(dbUrl);
  const db = getAgentWorkDb();

  try {
    const headSha = require("child_process").execSync("git rev-parse HEAD").toString().trim();
    const baseSha = headSha;

    // 1. Seed
    await seedWave01(baseSha);

    // 2. Initial state validation
    assert.ok((await db.select().from(agentModules)).length >= 4);
    assert.ok((await db.select().from(agentWorkers)).length >= 10);
    assert.ok((await db.select().from(agentWorkPackages)).length >= 5);
    assert.ok((await db.select().from(agentPackageTasks)).length >= 15);

    // 3. Validate initial state
    // Shared and Docs ready, others blocked by seed logic
    for (const packageKey of ["PKG-SHARED-CONTRACTS-001", "PKG-OPERATION-DOCS-FOUNDATION-001"]) {
      const pkg = (await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, packageKey)))[0];
      assert.strictEqual(pkg.status, "ready", `Package ${packageKey} should be ready`);
    }

    for (const packageKey of ["PKG-RUNTIME-TYPES-MAPPERS-001", "PKG-EVENT-TYPES-MAPPERS-001"]) {
      const pkg = (await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, packageKey)))[0];
      assert.strictEqual(pkg.status, "blocked", `Package ${packageKey} should be blocked initially by seed`);
    }

    // 4. Negative claims (Dependencies not completed)
    // To test the "Dependencies not completed" error in claimPackageTransactional,
    // the package must first be "ready".
    await db.update(agentWorkPackages).set({ status: "ready" }).where(eq(agentWorkPackages.key, "PKG-RUNTIME-TYPES-MAPPERS-001"));
    const runtimeClaimFail = await claimPackageTransactional("jules-dev-runtime-types-01", "PKG-RUNTIME-TYPES-MAPPERS-001");
    assert.strictEqual(runtimeClaimFail.success, false);
    assert.strictEqual(runtimeClaimFail.error, "Dependencies not completed");

    // 5. Execute full Operational Proof
    const result = await runOperationalProof(headSha);
    assert.strictEqual(result.finalStatus, "PARALLEL_WORK_READY");

    // 6. Verify Evidence Artifacts
    const artifacts = await db.select().from(agentOperationalArtifacts);
    assert.ok(artifacts.some(a => a.artifactType === "task_kit"), "Task Kits missing");
    assert.ok(artifacts.some(a => a.artifactType === "dry_run"), "Dry run artifact missing");
    assert.ok(artifacts.some(a => a.artifactType === "documentation_kit"), "Documentation Kit missing");
    assert.ok(artifacts.some(a => a.artifactType === "integration_kit"), "Integration Kit missing");

    // 7. Verify all processed packages reached review_complete
    const processed = await db.select().from(agentWorkPackages).where(inArray(agentWorkPackages.key, [
        "PKG-SHARED-CONTRACTS-001",
        "PKG-RUNTIME-TYPES-MAPPERS-001",
        "PKG-EVENT-TYPES-MAPPERS-001",
        "PKG-OPERATION-DOCS-FOUNDATION-001"
    ]));
    processed.forEach(p => assert.strictEqual(p.status, "review_complete"));

    // 8. Verify Tenancy remains blocked
    const tenancy = (await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, "PKG-RUNTIME-TENANCY-001")))[0];
    assert.strictEqual(tenancy.status, "blocked");

  } finally {
    await closeAgentWorkDb();
  }
});
