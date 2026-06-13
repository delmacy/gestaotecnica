import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { and, eq, lt } from "drizzle-orm";
import { getAgentWorkDb } from "../db";
import {
  agentActivityReceipts,
  agentReviewClaimHistory,
  agentReviewClaims,
  agentReviewKits,
  agentReviewPackages,
  agentReviewReceipts,
  agentWorkers,
  agentWorkPackages,
} from "../schema";

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
const tokenMatches = (token: string, hash: string) => timingSafeEqual(Buffer.from(hashToken(token)), Buffer.from(hash));
const leaseExpiry = () => new Date(Date.now() + 60 * 60 * 1000);

export function calculateReviewBudget(diffStats: Record<string, number>) {
  const budget = { production_files: 20, total_changed_files: 35, changed_lines_excluding_generated: 1500, public_contracts_changed: 3, modules_touched: 1 };
  const labels: Record<string, string> = {
    production_files: "Production files exceeded", total_changed_files: "Total changed files exceeded",
    changed_lines_excluding_generated: "Changed lines exceeded", public_contracts_changed: "Public contracts changed exceeded",
    modules_touched: "Modules touched exceeded",
  };
  const reasons = Object.entries(budget)
    .filter(([key, limit]) => (diffStats[key] || 0) > limit)
    .map(([key]) => labels[key]);
  return { budget, exceeded: reasons.length > 0, reasons, scopeResult: reasons.length > 0 ? "review_scope_exceeded" : "within_scope" };
}

export function routeSpecializedReviews(pkg: any) {
  const reviews = ["module"];
  if (pkg.contractsProduced?.length) reviews.push("contract");
  if (pkg.securityGate || pkg.entryGate?.includes("security")) reviews.push("security");
  if (pkg.tenancyGate || pkg.entryGate?.includes("tenancy")) reviews.push("tenancy");
  if (pkg.migrationGate || pkg.entryGate?.includes("migration")) reviews.push("migration");
  if (pkg.documentationImpacts?.length) reviews.push("documentation");
  if (pkg.integrationRisk === "high") reviews.push("integration");
  return [...new Set(reviews)];
}

export async function createReviewPackage(packageKey: string, changedFiles: string[], headSha: string) {
  const db = getAgentWorkDb();
  const [pkg] = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, packageKey));
  if (!pkg) throw new Error("Work package not found");
  const key = `REVIEW-${packageKey}`;
  const stats = {
    production_files: changedFiles.filter((file) => file.startsWith("src/")).length,
    total_changed_files: changedFiles.length,
    changed_lines_excluding_generated: changedFiles.length * 10,
    public_contracts_changed: (pkg.publicContractsChanged as string[]).length,
    modules_touched: 1,
  };
  const budget = calculateReviewBudget(stats);
  await db.insert(agentReviewPackages).values({
    id: key, key, workPackageKey: packageKey, moduleKey: pkg.moduleKey, laneKey: pkg.laneKey, waveKey: pkg.waveKey,
    baseSha: pkg.baseSha, headSha, status: "ready", objective: pkg.objective, integrationRisk: pkg.integrationRisk,
    changedFiles, productionFiles: changedFiles.filter((file) => file.startsWith("src/")),
    testFiles: changedFiles.filter((file) => file.startsWith("tests/")),
    documentationFiles: changedFiles.filter((file) => file.startsWith("docs/")),
    migrationFiles: changedFiles.filter((file) => file.includes("drizzle")), generatedFiles: [], lockfiles: [],
    changedLinesExcludingGenerated: stats.changed_lines_excluding_generated,
    contractsConsumed: pkg.contractsConsumed, contractsProduced: pkg.contractsProduced,
    publicContractsChanged: pkg.publicContractsChanged, knownConsumers: pkg.knownConsumers,
    directDependencies: pkg.contractsConsumed, reviewTypesRequired: routeSpecializedReviews(pkg),
    reviewBudget: budget.budget, scopeCheckResult: budget.scopeResult, scopeExceededReasons: budget.reasons,
  }).onConflictDoNothing();
  return key;
}

export async function generateReviewKit(reviewPackageKey: string, reviewType = "module") {
  const db = getAgentWorkDb();
  const [reviewPkg] = await db.select().from(agentReviewPackages).where(eq(agentReviewPackages.key, reviewPackageKey));
  if (!reviewPkg) throw new Error("Review package not found");
  const [workPkg] = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, reviewPkg.workPackageKey));
  const receipts = await db.select().from(agentActivityReceipts).where(eq(agentActivityReceipts.packageKey, workPkg.key));
  const content = {
    workPackage: workPkg.key,
    diff: { baseSha: reviewPkg.baseSha, headSha: reviewPkg.headSha },
    changedFiles: reviewPkg.changedFiles,
    impactedContracts: [...(reviewPkg.contractsConsumed as string[]), ...(reviewPkg.contractsProduced as string[])],
    directDependencies: reviewPkg.directDependencies,
    relevantTests: workPkg.requiredTests,
    activityReceipt: receipts.map((receipt) => receipt.path),
    reviewBudget: reviewPkg.reviewBudget,
    filesIntentionallyNotReviewed: [...(reviewPkg.generatedFiles as string[]), ...(reviewPkg.lockfiles as string[])],
  };
  await db.insert(agentReviewKits).values({ id: `${reviewPackageKey}-${reviewType}`, reviewPackageKey, reviewType, content }).onConflictDoNothing();
  return content;
}

export async function claimReview(reviewerKey: string, reviewPackageKey: string, reviewType: string) {
  const db = getAgentWorkDb();
  const [worker] = await db.select().from(agentWorkers).where(eq(agentWorkers.key, reviewerKey));
  if (!worker || worker.role !== "reviewer" || !(worker.metadata as any)?.reviewTypes?.includes(reviewType)) {
    return { success: false, error: "Reviewer incompatible with review type" };
  }
  const [reviewPkg] = await db.select().from(agentReviewPackages).where(eq(agentReviewPackages.key, reviewPackageKey));
  if (!reviewPkg || !(reviewPkg.reviewTypesRequired as string[]).includes(reviewType)) return { success: false, error: "Review type not required" };
  const token = randomBytes(32).toString("hex");
  try {
    await db.insert(agentReviewClaims).values({
      id: crypto.randomUUID(), reviewPackageKey, reviewerKey, reviewType, status: "active",
      claimTokenHash: hashToken(token), expiresAt: leaseExpiry(),
    });
    await recordHistory(reviewPackageKey, reviewerKey, reviewType, "claimed", {});
    return { success: true, token };
  } catch {
    return { success: false, error: "Review type already claimed" };
  }
}

async function findActive(reviewPackageKey: string, reviewType: string) {
  return (await getAgentWorkDb().select().from(agentReviewClaims).where(and(eq(agentReviewClaims.reviewPackageKey, reviewPackageKey), eq(agentReviewClaims.reviewType, reviewType))))[0];
}

async function recordHistory(reviewPackageKey: string, reviewerKey: string, reviewType: string, action: string, details: object) {
  await getAgentWorkDb().insert(agentReviewClaimHistory).values({ id: crypto.randomUUID(), reviewPackageKey, reviewerKey, reviewType, action, details });
}

async function validateClaim(reviewPackageKey: string, reviewType: string, token: string) {
  const claim = await findActive(reviewPackageKey, reviewType);
  if (!claim || claim.status !== "active" || claim.expiresAt <= new Date() || !tokenMatches(token, claim.claimTokenHash)) return null;
  return claim;
}

export async function heartbeatReview(reviewPackageKey: string, reviewType: string, token: string) {
  const claim = await validateClaim(reviewPackageKey, reviewType, token);
  if (!claim) return { success: false, error: "Invalid or expired review claim" };
  await getAgentWorkDb().update(agentReviewClaims).set({ heartbeatAt: new Date() }).where(eq(agentReviewClaims.id, claim.id));
  await recordHistory(reviewPackageKey, claim.reviewerKey, reviewType, "heartbeat", {});
  return { success: true };
}

export async function renewReview(reviewPackageKey: string, reviewType: string, token: string) {
  const claim = await validateClaim(reviewPackageKey, reviewType, token);
  if (!claim) return { success: false, error: "Invalid or expired review claim" };
  await getAgentWorkDb().update(agentReviewClaims).set({ expiresAt: leaseExpiry(), heartbeatAt: new Date() }).where(eq(agentReviewClaims.id, claim.id));
  await recordHistory(reviewPackageKey, claim.reviewerKey, reviewType, "renewed", {});
  return { success: true };
}

export async function releaseReview(reviewPackageKey: string, reviewType: string, token: string, reason = "completed") {
  const claim = await validateClaim(reviewPackageKey, reviewType, token);
  if (!claim) return { success: false, error: "Invalid or expired review claim" };
  await getAgentWorkDb().update(agentReviewClaims).set({ status: "released", releasedAt: new Date(), releaseReason: reason }).where(eq(agentReviewClaims.id, claim.id));
  await recordHistory(reviewPackageKey, claim.reviewerKey, reviewType, "released", { reason });
  return { success: true };
}

async function decideReview(reviewPackageKey: string, reviewType: string, token: string, decision: "approved" | "changes_requested") {
  const claim = await validateClaim(reviewPackageKey, reviewType, token);
  if (!claim) return { success: false, error: "Invalid or expired review claim" };
  const [reviewPkg] = await getAgentWorkDb().select().from(agentReviewPackages).where(eq(agentReviewPackages.key, reviewPackageKey));
  const content = { decision, reviewPackageKey, reviewType, reviewerKey: claim.reviewerKey, reviewedAt: new Date().toISOString() };
  await getAgentWorkDb().insert(agentReviewReceipts).values({
    id: `${reviewPackageKey}-${reviewType}`, reviewPackageKey, reviewType, reviewerKey: claim.reviewerKey, decision, content,
  }).onConflictDoNothing();
  await recordHistory(reviewPackageKey, claim.reviewerKey, reviewType, decision, {});
  await getAgentWorkDb().update(agentReviewPackages).set({ status: decision }).where(eq(agentReviewPackages.key, reviewPackageKey));
  return { success: true };
}

export const approveReview = (reviewPackageKey: string, reviewType: string, token: string) => decideReview(reviewPackageKey, reviewType, token, "approved");
export const requestReviewChanges = (reviewPackageKey: string, reviewType: string, token: string) => decideReview(reviewPackageKey, reviewType, token, "changes_requested");
export const completeReview = approveReview;

export function generateReviewReceipt(reviewPkg: any, decisions: any) {
  const fs = require("fs");
  const path = require("path");
  const dir = path.join(process.cwd(), "docs/modules", reviewPkg.moduleKey, "reviews");
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${reviewPkg.key}__PR-${reviewPkg.pullRequest || "LOCAL"}.md`);
  fs.writeFileSync(filePath, `# Review Receipt: ${reviewPkg.key}\n\nDecision: **${decisions.decision || "APPROVED"}**\n`);
  return filePath;
}

export async function reapStaleReviews() {
  const db = getAgentWorkDb();
  const stale = await db.select().from(agentReviewClaims).where(and(eq(agentReviewClaims.status, "active"), lt(agentReviewClaims.expiresAt, new Date())));
  for (const claim of stale) {
    await db.update(agentReviewClaims).set({ status: "expired", releasedAt: new Date(), releaseReason: "lease_expired" }).where(eq(agentReviewClaims.id, claim.id));
    await recordHistory(claim.reviewPackageKey, claim.reviewerKey, claim.reviewType, "expired", {});
  }
  return { reaped: stale.length };
}
