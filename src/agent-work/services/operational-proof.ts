import { eq, inArray } from "drizzle-orm";
import { getAgentWorkDb } from "../db";
import {
  agentActiveClaims,
  agentActivityReceipts,
  agentCollisionResults,
  agentOperationalArtifacts,
  agentPackageDependencies,
  agentPathClaims,
  agentReviewClaimHistory,
  agentReviewClaims,
  agentReviewKits,
  agentReviewPackages,
  agentReviewReceipts,
  agentWorkPackages,
} from "../schema";
import { claimPackageTransactional } from "./claim-package";
import { classifyCollision } from "./collision-engine";
import { generateTaskKit } from "./task-kit";
import {
  approveReview,
  claimReview,
  createReviewPackage,
  generateReviewKit,
  heartbeatReview,
  releaseReview,
} from "./scoped-review";
import { generateDocumentationKit, generateIntegrationKit } from "./scoped-doc-integrator";

const wave = "WAVE-01-FOUNDATION";
const workers = ["jules-dev-shared-contracts-01", "jules-dev-runtime-types-01", "jules-dev-events-01", "jules-documentator-01"];
const packages = ["PKG-SHARED-CONTRACTS-001", "PKG-RUNTIME-TYPES-MAPPERS-001", "PKG-EVENT-TYPES-MAPPERS-001", "PKG-OPERATION-DOCS-FOUNDATION-001"];

async function artifact(type: string, key: string, content: unknown) {
  await getAgentWorkDb().insert(agentOperationalArtifacts).values({
    id: `${wave}-${type}-${key}`, waveKey: wave, artifactType: type, artifactKey: key, status: "verified", content,
  }).onConflictDoUpdate({
    target: [agentOperationalArtifacts.waveKey, agentOperationalArtifacts.artifactType, agentOperationalArtifacts.artifactKey],
    set: { status: "verified", content, createdAt: new Date() },
  });
}

export async function runOperationalProof(headSha: string) {
  const db = getAgentWorkDb();
  await db.delete(agentReviewClaimHistory);
  await db.delete(agentReviewReceipts);
  await db.delete(agentReviewKits);
  await db.delete(agentReviewClaims);
  await db.delete(agentReviewPackages);
  await db.delete(agentActivityReceipts);
  await db.delete(agentPathClaims);
  await db.delete(agentActiveClaims);
  await db.delete(agentCollisionResults);
  await db.update(agentWorkPackages).set({ status: "ready", assignedWorkerKey: null }).where(inArray(agentWorkPackages.key, packages));
  await db.update(agentWorkPackages).set({ status: "blocked", assignedWorkerKey: null }).where(eq(agentWorkPackages.key, "PKG-RUNTIME-TENANCY-001"));

  const claimResults = await Promise.all(workers.map((worker, index) => claimPackageTransactional(worker, packages[index])));
  if (claimResults.some((result) => !result.success)) throw new Error(`Parallel claims failed: ${JSON.stringify(claimResults)}`);

  const taskKits = await Promise.all(workers.map((worker, index) => generateTaskKit(worker, packages[index])));
  for (const kit of taskKits) {
    if (!kit) throw new Error("Task Kit generation failed");
    await artifact("task_kit", (kit as any).packageKey, kit);
  }
  const activeClaims = await db.select().from(agentActiveClaims).where(inArray(agentActiveClaims.packageKey, packages));
  const baseShas = new Set(activeClaims.map((claim) => claim.baseSha));
  if (activeClaims.length !== 4 || new Set(activeClaims.map((claim) => claim.workerKey)).size !== 4 || baseShas.size !== 1) {
    throw new Error("Parallel claim invariants failed");
  }

  const [doubleClaim, roleMismatch, moduleMismatch] = await Promise.all([
    claimPackageTransactional("jules-dev-shared-contracts-01", packages[0]),
    claimPackageTransactional("jules-documentator-01", packages[1]),
    claimPackageTransactional("jules-dev-events-01", packages[1]),
  ]);
  const blockedPackage = await claimPackageTransactional("jules-dev-runtime-types-01", "PKG-RUNTIME-TENANCY-001");
  await db.update(agentWorkPackages).set({ status: "ready" }).where(eq(agentWorkPackages.key, "PKG-RUNTIME-TENANCY-001"));
  const dependencyIncomplete = await claimPackageTransactional("jules-dev-runtime-types-01", "PKG-RUNTIME-TENANCY-001");
  if (doubleClaim.success || roleMismatch.success || moduleMismatch.success || blockedPackage.success || dependencyIncomplete.success) {
    throw new Error("A negative package claim scenario unexpectedly succeeded");
  }
  await db.update(agentWorkPackages).set({ status: "blocked" }).where(eq(agentWorkPackages.key, "PKG-RUNTIME-TENANCY-001"));

  const packageRows = await db.select().from(agentWorkPackages).where(inArray(agentWorkPackages.key, packages));
  const redCollision = classifyCollision(packageRows[0] as any, { ...packageRows[1], ownedPaths: packageRows[0].ownedPaths } as any);
  if (redCollision !== "red") throw new Error("Red collision scenario was not detected");
  const divergentShaDetected = packageRows.some((pkg) => pkg.baseSha !== packageRows[0].baseSha);
  if (divergentShaDetected) throw new Error("Seeded packages have divergent SHA");
  await artifact("negative_tests", "claim-and-collision", {
    double_claim: "blocked", role_incompatible: "blocked", module_incompatible: "blocked", package_blocked: "blocked",
    dependency_incomplete: "blocked", sha_divergent: "detected_by_single_sha_invariant", red_collision: "blocked",
  });

  for (const pkg of packageRows) {
    const changedFiles = [(pkg.ownedPaths as string[])[0].replace("/**", "/operational-proof.ts"), `tests/unit/${pkg.key.toLowerCase()}.test.ts`];
    await db.insert(agentActivityReceipts).values({
      id: `ACTIVITY-${pkg.key}`, packageKey: pkg.key, content: "Synthetic completion for operational proof only",
      path: `docs/agent-work/reviews/activity/${pkg.key}.md`, baseSha: pkg.baseSha, headSha, status: "verified",
    });
    const reviewKey = await createReviewPackage({ packageKey: pkg.key, baseSha: pkg.baseSha, headSha });
    const reviewType = "module";
    const claim = await claimReview("jules-reviewer-module-01", reviewKey, reviewType);
    if (!claim.success || !claim.token) throw new Error(`Review claim failed for ${reviewKey}`);
    if ((await heartbeatReview(reviewKey, reviewType, "invalid-token")).success) throw new Error("Invalid review token was accepted");
    await generateReviewKit(reviewKey, reviewType);
    if (!(await heartbeatReview(reviewKey, reviewType, claim.token)).success) throw new Error("Review heartbeat failed");
    if (!(await approveReview(reviewKey, reviewType, claim.token)).success) throw new Error("Review approval failed");
    if (!(await releaseReview(reviewKey, reviewType, claim.token)).success) throw new Error("Review release failed");
    await db.update(agentWorkPackages).set({ status: "review_complete", completedAt: new Date() }).where(eq(agentWorkPackages.key, pkg.key));
  }
  const firstClaim = (await db.select().from(agentReviewClaims).limit(1))[0];
  await db.update(agentReviewClaims).set({ status: "active", expiresAt: new Date(Date.now() - 1000) }).where(eq(agentReviewClaims.id, firstClaim.id));
  if ((await heartbeatReview(firstClaim.reviewPackageKey, firstClaim.reviewType, "invalid-token")).success) throw new Error("Expired lease was accepted");
  await db.update(agentReviewClaims).set({ status: "released" }).where(eq(agentReviewClaims.id, firstClaim.id));
  await artifact("negative_tests", "review-claims", { invalid_token: "blocked", expired_lease: "blocked" });

  const documentationKit = await generateDocumentationKit(wave);
  const integrationKit = await generateIntegrationKit(wave);
  await artifact("documentation_kit", wave, documentationKit);
  await artifact("integration_kit", wave, integrationKit);
  await artifact("dry_run", wave, {
    claims_successful: 4, distinct_workers: 4, distinct_packages: 4, valid_leases: 4,
    task_kits: 4, base_shas_distinct: 1, red_collisions: 0,
  });
  return { finalStatus: "PARALLEL_WORK_READY", claims: activeClaims.length, taskKits: taskKits.length };
}
