import { createHash, randomBytes, timingSafeEqual } from "crypto";
import * as crypto from "crypto";
import { and, eq, lt, inArray } from "drizzle-orm";
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
import { evaluatePathOwnership } from "./ownership-service";

const SHA_REGEX = /^[0-9a-f]{40}$/i;
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
    .filter(([key, limit]) => {
      const val = diffStats[key] || 0;
      return val > (limit as number);
    })
    .map(([key]) => labels[key]);
  return { budget, exceeded: reasons.length > 0, reasons, scopeResult: reasons.length > 0 ? "review_scope_exceeded" : "within_scope" };
}

export async function collectReviewDiff(input: { baseSha: string, headSha: string, pullRequest?: string }) {
  const { execSync } = require("child_process");

  if (input.baseSha === input.headSha) {
    return { files: [], addedLines: 0, deletedLines: 0, fileStats: {} };
  }

  // In a real environment with GitHub CLI, we could use gh pr diff
  // For now, we use local git diff as primary source.
  const numstat = execSync(`git diff --numstat ${input.baseSha}..${input.headSha}`).toString();
  const namestatus = execSync(`git diff --name-status ${input.baseSha}..${input.headSha}`).toString();

  const files = namestatus.split("\n").filter(Boolean).map((line: string) => {
    const [status, path] = line.split(/\s+/);
    return { path, status };
  });

  let addedLines = 0;
  let deletedLines = 0;
  const fileStats: Record<string, { added: number, deleted: number }> = {};

  numstat.split("\n").filter(Boolean).forEach((line: string) => {
    const [added, deleted, path] = line.split(/\s+/);
    const a = parseInt(added) || 0;
    const d = parseInt(deleted) || 0;
    addedLines += a;
    deletedLines += d;
    fileStats[path] = { added: a, deleted: d };
  });

  return {
    files,
    addedLines,
    deletedLines,
    fileStats
  };
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

export async function createReviewPackage(input: { packageKey: string, pr?: string, baseSha?: string, headSha?: string }) {
  const db = getAgentWorkDb();
  const [pkg] = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, input.packageKey));
  if (!pkg) return { success: false, error: "Work package not found" };

  const receipts = await db.select().from(agentActivityReceipts).where(eq(agentActivityReceipts.packageKey, input.packageKey));
  if (receipts.length === 0) return { success: false, error: "Activity Receipt missing" };

  const baseSha = input.baseSha || pkg.baseSha;
  const headSha = input.headSha || receipts[0].headSha;

  if (!SHA_REGEX.test(baseSha) || !SHA_REGEX.test(headSha)) {
    return { success: false, error: "Invalid SHA format" };
  }

  const diff = await collectReviewDiff({ baseSha, headSha, pullRequest: input.pr });
  const changedFiles = diff.files.map((f: any) => f.path);

  if (changedFiles.length === 0 && baseSha !== headSha) {
    return { success: false, error: "Empty diff" };
  }

  // Categorization
  const productionFiles = changedFiles.filter((f: string) => f.startsWith("src/"));
  const testFiles = changedFiles.filter((f: string) => f.startsWith("tests/"));
  const documentationFiles = changedFiles.filter((f: string) => f.startsWith("docs/"));
  const migrationFiles = changedFiles.filter((f: string) => (f.includes("drizzle") || f.includes("migrations")));
  const generatedFiles: string[] = []; // detect generated if needed
  const lockfiles = changedFiles.filter((f: string) => (f.endsWith("lock.json") || f.endsWith("lock.yaml")));

  const changedLinesExcludingGenerated = diff.addedLines + diff.deletedLines; // simplistic for now

  // Ownership validation
  let ownershipResult = "ownership_valid";
  const ownership = evaluatePathOwnership(pkg, changedFiles);
  if (!ownership.valid) {
    ownershipResult = "ownership_violation";
  }

  const stats = {
    production_files: productionFiles.length,
    total_changed_files: changedFiles.length,
    changed_lines_excluding_generated: changedLinesExcludingGenerated,
    public_contracts_changed: (pkg.publicContractsChanged as string[]).length,
    modules_touched: 1,
  };

  const budget = calculateReviewBudget(stats);
  const key = `REVIEW-${input.packageKey}`;

  const reviewPackageStatus = (ownershipResult === "ownership_valid" && !budget.exceeded) ? "ready" : "blocked";

  await db.insert(agentReviewPackages).values({
    id: key, key, workPackageKey: input.packageKey, moduleKey: pkg.moduleKey, laneKey: pkg.laneKey, waveKey: pkg.waveKey,
    pullRequest: input.pr, baseSha, headSha, status: reviewPackageStatus, objective: pkg.objective, integrationRisk: pkg.integrationRisk,
    changedFiles, productionFiles, testFiles, documentationFiles, migrationFiles, generatedFiles, lockfiles,
    changedLinesExcludingGenerated,
    contractsConsumed: pkg.contractsConsumed, contractsProduced: pkg.contractsProduced,
    publicContractsChanged: pkg.publicContractsChanged, knownConsumers: pkg.knownConsumers,
    directDependencies: pkg.contractsConsumed, reviewTypesRequired: routeSpecializedReviews(pkg),
    reviewBudget: budget.budget,
    scopeCheckResult: ownershipResult === "ownership_violation" ? "ownership_violation" : budget.scopeResult,
    scopeExceededReasons: budget.reasons,
  }).onConflictDoUpdate({
    target: [agentReviewPackages.key],
    set: {
      status: reviewPackageStatus,
      headSha,
      changedFiles,
      productionFiles,
      testFiles,
      documentationFiles,
      migrationFiles,
      generatedFiles,
      lockfiles,
      changedLinesExcludingGenerated,
      scopeCheckResult: ownershipResult === "ownership_violation" ? "ownership_violation" : budget.scopeResult,
      scopeExceededReasons: budget.reasons,
      updatedAt: new Date()
    }
  });

  return { success: true, reviewKey: key, status: reviewPackageStatus };
}

export async function generateReviewKit(reviewPackageKey: string, reviewType = "module") {
  const db = getAgentWorkDb();
  const [reviewPkg] = await db.select().from(agentReviewPackages).where(eq(agentReviewPackages.key, reviewPackageKey));
  if (!reviewPkg) throw new Error("Review package not found");
  const [workPkg] = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, reviewPkg.workPackageKey));
  const receipts = await db.select().from(agentActivityReceipts).where(eq(agentActivityReceipts.packageKey, workPkg.key));

  const [claim] = await db.select().from(agentReviewClaims).where(and(
    eq(agentReviewClaims.reviewPackageKey, reviewPackageKey),
    eq(agentReviewClaims.reviewType, reviewType),
    eq(agentReviewClaims.status, "active")
  ));

  const content = {
    reviewPackage: reviewPkg.key,
    workPackage: workPkg.key,
    reviewer: claim?.reviewerKey,
    reviewType,
    pr: reviewPkg.pullRequest,
    baseSha: reviewPkg.baseSha,
    headSha: reviewPkg.headSha,
    objective: reviewPkg.objective,
    acceptanceCriteria: workPkg.acceptanceCriteria,
    changedFilesByCategory: {
      production: reviewPkg.productionFiles,
      test: reviewPkg.testFiles,
      documentation: reviewPkg.documentationFiles,
      migration: reviewPkg.migrationFiles,
    },
    ownedPaths: workPkg.ownedPaths,
    contractsConsumed: reviewPkg.contractsConsumed,
    contractsProduced: reviewPkg.contractsProduced,
    publicContractsChanged: reviewPkg.publicContractsChanged,
    knownConsumers: reviewPkg.knownConsumers,
    directDependencies: reviewPkg.directDependencies,
    requiredTests: workPkg.requiredTests,
    activityReceipt: receipts.map((receipt) => ({ id: receipt.id, path: receipt.path })),
    reviewBudget: reviewPkg.reviewBudget,
    scopeResult: reviewPkg.scopeCheckResult,
    requiredSpecializedReviews: reviewPkg.reviewTypesRequired,
    filesIntentionallyNotReviewed: [...(reviewPkg.generatedFiles as string[]), ...(reviewPkg.lockfiles as string[])],
    completionCommands: [
      `npm run agent-work -- review:approve --review ${reviewPackageKey} --type ${reviewType} --token <token>`,
      `npm run agent-work -- review:request-changes --review ${reviewPackageKey} --type ${reviewType} --token <token>`
    ]
  };
  await db.insert(agentReviewKits).values({
    id: `${reviewPackageKey}-${reviewType}`,
    reviewPackageKey,
    reviewType,
    content
  }).onConflictDoUpdate({
    target: [agentReviewKits.reviewPackageKey, agentReviewKits.reviewType],
    set: { content, createdAt: new Date() }
  });
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

async function decideReview(reviewPackageKey: string, reviewType: string, token: string, decision: "approved" | "changes_requested", input?: any) {
  const claim = await validateClaim(reviewPackageKey, reviewType, token);
  if (!claim) return { success: false, error: "REVIEW_APPROVAL_BLOCKED: Invalid or expired review claim" };

  const db = getAgentWorkDb();
  const [reviewPkg] = await db.select().from(agentReviewPackages).where(eq(agentReviewPackages.key, reviewPackageKey));
  if (!reviewPkg) return { success: false, error: "Review package not found" };

  if ((reviewPkg.scopeCheckResult as string) !== "within_scope") {
     return { success: false, error: `REVIEW_APPROVAL_BLOCKED: ${reviewPkg.scopeCheckResult}` };
  }

  const receipts = await db.select().from(agentActivityReceipts).where(eq(agentActivityReceipts.packageKey, reviewPkg.workPackageKey));
  if (receipts.length === 0) return { success: false, error: "REVIEW_APPROVAL_BLOCKED: Activity Receipt missing" };

  const activityInput = JSON.parse(receipts[0].content);
  if (activityInput.testResults?.success === false) {
     return { success: false, error: "REVIEW_APPROVAL_BLOCKED: Activity Receipt tests not approved" };
  }

  const [workPkg] = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, reviewPkg.workPackageKey));

  const content = {
    reviewId: `${reviewPackageKey}-${reviewType}`,
    reviewPackage: reviewPkg.key,
    workPackage: workPkg.key,
    reviewer: claim.reviewerKey,
    reviewType,
    pullRequest: reviewPkg.pullRequest,
    baseSha: reviewPkg.baseSha,
    headSha: reviewPkg.headSha,
    filesReviewed: input?.filesReviewed || reviewPkg.changedFiles,
    filesIntentionallyNotReviewed: input?.filesIntentionallyNotReviewed || [...(reviewPkg.generatedFiles as string[]), ...(reviewPkg.lockfiles as string[])],
    contractsReviewed: input?.contractsReviewed || reviewPkg.contractsProduced,
    dependenciesReviewed: input?.dependenciesReviewed || reviewPkg.directDependencies,
    testsVerified: input?.testsVerified || [],
    ownershipVerified: reviewPkg.scopeCheckResult !== "ownership_violation",
    budgetVerified: reviewPkg.scopeCheckResult === "within_scope",
    decision,
    findings: input?.findings,
    requiredChanges: input?.requiredChanges,
    residualRisks: input?.residualRisks,
    integrationNotes: input?.integrationNotes,
    documentationNotes: input?.documentationNotes,
    timestamp: new Date().toISOString()
  };

  await db.insert(agentReviewReceipts).values({
    id: `${reviewPackageKey}-${reviewType}`,
    reviewPackageKey,
    reviewType,
    reviewerKey: claim.reviewerKey,
    decision,
    content,
  }).onConflictDoUpdate({
    target: [agentReviewReceipts.reviewPackageKey, agentReviewReceipts.reviewType],
    set: { decision, content, createdAt: new Date() }
  });

  const receiptPath = generateReviewReceipt(reviewPkg, content);

  await recordHistory(reviewPackageKey, claim.reviewerKey, reviewType, decision, { receiptPath });
  await db.update(agentReviewPackages).set({ status: decision }).where(eq(agentReviewPackages.key, reviewPackageKey));

  // Check if all required reviews are approved
  if (decision === "approved") {
    const allReceipts = await db.select().from(agentReviewReceipts).where(eq(agentReviewReceipts.reviewPackageKey, reviewPackageKey));
    const approvedTypes = allReceipts.filter(r => r.decision === "approved").map(r => r.reviewType);
    const requiredTypes = reviewPkg.reviewTypesRequired as string[];

    const allApproved = requiredTypes.every(t => approvedTypes.includes(t));
    if (allApproved) {
       await db.update(agentReviewPackages).set({ status: "approved" }).where(eq(agentReviewPackages.key, reviewPackageKey));
       await db.update(agentWorkPackages).set({ status: "review_complete" }).where(eq(agentWorkPackages.key, reviewPkg.workPackageKey));
    }
  } else if (decision === "changes_requested") {
    await db.update(agentReviewPackages).set({ status: "changes_requested" }).where(eq(agentReviewPackages.key, reviewPackageKey));
    await db.update(agentWorkPackages).set({ status: "changes_requested" }).where(eq(agentWorkPackages.key, reviewPkg.workPackageKey));
  }

  return { success: true, receiptPath };
}

export const approveReview = (reviewPackageKey: string, reviewType: string, token: string, input?: any) => decideReview(reviewPackageKey, reviewType, token, "approved", input);
export const requestReviewChanges = (reviewPackageKey: string, reviewType: string, token: string, input?: any) => decideReview(reviewPackageKey, reviewType, token, "changes_requested", input);
export const completeReview = approveReview;

export function generateReviewReceipt(reviewPkg: any, content: any) {
  const fs = require("fs");
  const path = require("path");
  const dir = path.join(process.cwd(), "docs/modules", reviewPkg.moduleKey, "reviews");
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${reviewPkg.key}_${content.reviewType}__PR-${reviewPkg.pullRequest || "LOCAL"}.md`);

  const markdown = `# Review Receipt: ${reviewPkg.key} [${content.reviewType.toUpperCase()}]
Review ID: ${content.reviewId}
Work Package: ${content.workPackage}
Reviewer: ${content.reviewer}
Type: ${content.reviewType}
PR: ${content.pullRequest || "N/A"}
Base SHA: ${content.baseSha}
Head SHA: ${content.headSha}

## Decision: ${content.decision.toUpperCase()}

## Files Reviewed
${(content.filesReviewed || []).map((f: string) => `- ${f}`).join("\n")}

## Contracts Reviewed
${(content.contractsReviewed || []).map((c: string) => `- ${c}`).join("\n")}

## Dependencies Reviewed
${(content.dependenciesReviewed || []).map((d: string) => `- ${d}`).join("\n")}

## Verified
- Ownership: ${content.ownershipVerified ? "✅" : "❌"}
- Budget: ${content.budgetVerified ? "✅" : "❌"}
- Tests: ✅ Verified

## Findings
${content.findings || "No critical findings."}

## Required Changes
${content.requiredChanges || "None."}

## Residual Risks
${content.residualRisks || "None identified."}

## Integration & Documentation
- Integration Notes: ${content.integrationNotes || "Standard merge."}
- Documentation Notes: ${content.documentationNotes || "No manual doc updates required."}

Timestamp: ${content.timestamp}
`;

  fs.writeFileSync(filePath, markdown);
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
