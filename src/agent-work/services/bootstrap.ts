import { eq, and, asc } from "drizzle-orm";
import { getAgentWorkDb } from "../db";
import {
  agentWorkers,
  agentWorkPackages,
  agentExecutionWaves,
  agentActiveClaims,
  agentReviewPackages,
  agentReviewClaims,
  agentPackageDependencies,
  agentCollisionResults,
} from "../schema";
import { claimPackageTransactional } from "./claim-package";
import { claimReview, generateReviewKit } from "./scoped-review";
import { generateTaskKit } from "./task-kit";

export async function selectPackageForWorker(workerKey: string, waveKey?: string) {
  const db = getAgentWorkDb();
  const [worker] = await db.select().from(agentWorkers).where(eq(agentWorkers.key, workerKey));
  if (!worker) throw new Error(`Worker ${workerKey} not found`);

  if (worker.role === "reviewer") {
    return selectReviewForWorker(worker, waveKey);
  }

  if (worker.role === "coordinator") {
    return { type: "vision", vision: await getCoordinatorVision(waveKey) };
  }

  // Module Workers, Documentators, Integrators
  const pkgs = await db.select().from(agentWorkPackages)
    .where(and(
      eq(agentWorkPackages.status, "ready"),
      eq(agentWorkPackages.workerRole, worker.role),
      waveKey ? eq(agentWorkPackages.waveKey, waveKey) : undefined,
      worker.moduleKey ? eq(agentWorkPackages.moduleKey, worker.moduleKey) : undefined
    ))
    .orderBy(asc(agentWorkPackages.priority), asc(agentWorkPackages.mergeOrder), asc(agentWorkPackages.key));

  for (const pkg of pkgs) {
    // 1. Wave compatible (base SHA)
    const [wave] = await db.select().from(agentExecutionWaves).where(eq(agentExecutionWaves.key, pkg.waveKey));
    if (!wave || wave.baseSha !== pkg.baseSha) continue;

    // 2. Dependencies complete
    const deps = await db.select().from(agentPackageDependencies).where(eq(agentPackageDependencies.dependentPackageKey, pkg.key));
    if (deps.some(d => d.status !== "completed")) continue;

    // 3. Max claims respected
    const activeClaims = await db.select().from(agentActiveClaims).where(eq(agentActiveClaims.workerKey, workerKey));
    if (activeClaims.length >= worker.maxActiveClaims) break;

    // 4. No incompatible active claim (exclusive path check is done inside claimPackageTransactional, but we can do a preliminary check here if needed)
    // For now we rely on the transactional claim to handle the final safety.

    return { type: "package", package: pkg };
  }

  return null;
}

async function selectReviewForWorker(worker: any, waveKey?: string) {
  const db = getAgentWorkDb();
  const reviewTypes = (worker.metadata as any)?.reviewTypes || [];

  const reviews = await db.select().from(agentReviewPackages)
    .where(and(
      eq(agentReviewPackages.status, "ready"),
      waveKey ? eq(agentReviewPackages.waveKey, waveKey) : undefined
    ))
    .orderBy(asc(agentReviewPackages.key));

  for (const review of reviews) {
    const requiredTypes = review.reviewTypesRequired as string[];
    const compatibleTypes = requiredTypes.filter(t => reviewTypes.includes(t));

    for (const type of compatibleTypes) {
      const active = await db.select().from(agentReviewClaims).where(and(
        eq(agentReviewClaims.reviewPackageKey, review.key),
        eq(agentReviewClaims.reviewType, type),
        eq(agentReviewClaims.status, "active")
      ));
      if (active.length > 0) continue;

      const workerActive = await db.select().from(agentReviewClaims).where(and(
        eq(agentReviewClaims.reviewPackageKey, review.key),
        eq(agentReviewClaims.reviewerKey, worker.key),
        eq(agentReviewClaims.status, "active")
      ));
      if (workerActive.length > 0) continue;

      return { type: "review", review, reviewType: type };
    }
  }
  return null;
}

async function getCoordinatorVision(waveKey?: string) {
  const db = getAgentWorkDb();
  const wave = waveKey ? (await db.select().from(agentExecutionWaves).where(eq(agentExecutionWaves.key, waveKey)))[0] : null;
  const packages = await db.select().from(agentWorkPackages).where(waveKey ? eq(agentWorkPackages.waveKey, waveKey) : undefined);
  const claims = await db.select().from(agentActiveClaims);
  const reviews = await db.select().from(agentReviewPackages).where(waveKey ? eq(agentReviewPackages.waveKey, waveKey) : undefined);
  const collisions = await db.select().from(agentCollisionResults).where(waveKey ? eq(agentCollisionResults.waveKey, waveKey) : undefined);

  return {
    wave,
    packages,
    claims,
    reviews,
    collisions,
    blockedReasons: packages.filter(p => p.status === "blocked").map(p => ({ key: p.key, reason: p.blockedReason })),
    mergeOrder: packages.sort((a, b) => a.mergeOrder - b.mergeOrder).map(p => p.key)
  };
}

export async function bootstrapWorker(workerKey: string, waveKey?: string) {
  const db = getAgentWorkDb();
  const [worker] = await db.select().from(agentWorkers).where(eq(agentWorkers.key, workerKey));
  if (!worker) throw new Error(`Worker ${workerKey} not found`);

  const resource = await selectPackageForWorker(workerKey, waveKey);

  if (!resource) {
    return { status: "NO_COMPATIBLE_WORK_AVAILABLE" };
  }

  if (resource.type === "package" && "package" in resource) {
    const pkg = (resource as any).package;
    const claimRes = await claimPackageTransactional(workerKey, pkg.key);
    if (!claimRes.success) {
      return { status: "BOOTSTRAP_BLOCKED", error: claimRes.error };
    }
    const kit = await generateTaskKit(workerKey, pkg.key);
    return {
      status: "SUCCESS",
      worker: workerKey,
      role: worker.role,
      module: pkg.moduleKey,
      selectedResource: pkg.key,
      claimToken: claimRes.token,
      taskKit: kit,
      baseSha: pkg.baseSha,
      branch: pkg.targetBranch,
      stopConditions: ["invalid lease", "SHA divergence", "red collision", "incomplete dependency", "failed test", "failed review", "failed build"]
    };
  }

  if (resource.type === "review" && "review" in resource) {
    const { review, reviewType } = resource as any;
    const claimRes = await claimReview(workerKey, review.key, reviewType);
    if (!claimRes.success) {
       return { status: "BOOTSTRAP_BLOCKED", error: claimRes.error };
    }
    const kit = await generateReviewKit(review.key, reviewType);
    return {
      status: "SUCCESS",
      worker: workerKey,
      role: worker.role,
      module: review.moduleKey,
      selectedResource: review.key,
      reviewType,
      claimToken: claimRes.token,
      reviewKit: kit,
      baseSha: review.baseSha,
      branch: `review/${review.key.toLowerCase()}`,
      stopConditions: ["invalid lease", "SHA divergence"]
    };
  }

  if (resource.type === "vision" && "vision" in resource) {
    return {
      status: "SUCCESS",
      worker: workerKey,
      role: worker.role,
      vision: resource.vision
    };
  }

  return { status: "BOOTSTRAP_BLOCKED", error: "Unknown resource type" };
}
