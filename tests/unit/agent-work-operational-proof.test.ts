import assert from "node:assert";
import { test } from "node:test";
import { eq, inArray } from "drizzle-orm";
import { closeAgentWorkDb, createAgentWorkDb, getAgentWorkDb } from "../../src/agent-work/db";
import { agentWorkPackages, agentPackageDependencies, agentActiveClaims, agentOperationalArtifacts } from "../../src/agent-work/schema";
import { seedWave01 } from "../../src/agent-work/seeds/wave-01";
import { runOperationalProof } from "../../src/agent-work/services/operational-proof";

test("Operational Proof Logic Unit Test", async () => {
  const dbUrl = process.env.AGENT_WORK_TEST_DATABASE_URL;
  assert.ok(dbUrl?.includes("agent_work_test"), "Must use test database");

  createAgentWorkDb(dbUrl);
  const db = getAgentWorkDb();

  try {
    const headSha = require("child_process").execSync("git rev-parse HEAD").toString().trim();
    const baseSha = headSha; // Using same SHA to avoid git diff failure in unit test environment

    // 1. Seed
    await seedWave01(baseSha);

    // 2. Validate initial dependency state
    const runtimePkg = (await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, "PKG-RUNTIME-TYPES-MAPPERS-001")))[0];
    assert.strictEqual(runtimePkg.status, "blocked", "Runtime types should be initially blocked");

    const dep = (await db.select().from(agentPackageDependencies).where(eq(agentPackageDependencies.id, "DEP-RUNTIME-TYPES-SHARED")))[0];
    assert.strictEqual(dep.status, "pending", "Dependency should be initially pending");

    // 3. Run Proof
    const result = await runOperationalProof(headSha);

    // 4. Verify Final Artifact
    assert.strictEqual(result.finalStatus, "PARALLEL_WORK_READY");
    assert.strictEqual(result.claims_successful, 4);
    assert.strictEqual(result.required_reviews_completed, true);

    const dryRunArtifact = (await db.select().from(agentOperationalArtifacts).where(eq(agentOperationalArtifacts.artifactType, "dry_run")))[0];
    assert.ok(dryRunArtifact, "Dry run artifact should be recorded");
    assert.strictEqual((dryRunArtifact.content as any).final_status, "PARALLEL_WORK_READY");

    // 5. Verify tenancy remains blocked
    const tenancyPkg = (await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, "PKG-RUNTIME-TENANCY-001")))[0];
    assert.strictEqual(tenancyPkg.status, "blocked", "Tenancy should remain blocked");

    // 6. Verify processed packages are review_complete
    const processedPackages = await db.select().from(agentWorkPackages).where(inArray(agentWorkPackages.key, [
        "PKG-SHARED-CONTRACTS-001",
        "PKG-RUNTIME-TYPES-MAPPERS-001",
        "PKG-EVENT-TYPES-MAPPERS-001",
        "PKG-OPERATION-DOCS-FOUNDATION-001"
    ]));
    assert.strictEqual(processedPackages.length, 4);
    processedPackages.forEach(pkg => {
        assert.strictEqual(pkg.status, "review_complete", `Package ${pkg.key} should be review_complete`);
    });

  } finally {
    await closeAgentWorkDb();
  }
});
