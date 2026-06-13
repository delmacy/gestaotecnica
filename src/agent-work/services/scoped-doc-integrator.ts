import { agentWorkPackages, agentReviewReceipts, agentActivityReceipts, agentDocumentationImpacts, agentCollisionResults } from "../schema";
import { getAgentWorkDb } from "../db";
import { eq, inArray } from "drizzle-orm";

export async function generateDocumentationKit(waveKey: string) {
  const db = getAgentWorkDb();

  const pkgsRes = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.waveKey, waveKey));
  const mergedPackages = pkgsRes.filter(p => p.status === "review_complete" || p.status === "merged_pending_harmonization" || p.status === "integrated" || p.status === "done");

  if (mergedPackages.length === 0) {
      return { wave: waveKey, error: "No packages ready for documentation harmonization" };
  }

  const packageKeys = mergedPackages.map(p => p.key);

  const docsRes = await db.select().from(agentDocumentationImpacts).where(inArray(agentDocumentationImpacts.packageKey, packageKeys));
  const activityReceipts = await db.select().from(agentActivityReceipts).where(inArray(agentActivityReceipts.packageKey, packageKeys));
  const reviewReceipts = await db.select().from(agentReviewReceipts);

  const impacts = docsRes.map(d => ({
      package: d.packageKey,
      docPath: d.docPath,
      description: d.impactDescription
  }));

  return {
    wave: waveKey,
    packagesMerged: packageKeys,
    impacts: impacts,
    docsTargets: impacts.map(i => i.docPath),
    activityReceipts: activityReceipts.map(r => r.path),
    reviewReceipts: reviewReceipts.map(r => r.id),
    documentationImpacts: mergedPackages.flatMap(p => p.documentationImpacts as string[]),
    publicContractChanges: mergedPackages.flatMap(p => p.publicContractsChanged as string[]),
    taskerImpacts: [],
    packagesApproved: packageKeys,
    filesIntentionallyOutsideScope: ["src/**", "tests/**", "drizzle/**"],
    completionCommands: [
      `npm run agent-work -- package:complete --package PKG-DOC-HARMONIZE`
    ]
  };
}

export async function generateIntegrationKit(waveKey: string) {
  const db = getAgentWorkDb();

  const pkgsRes = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.waveKey, waveKey));
  const approvedPackages = pkgsRes.filter(p => p.status === "review_complete" || p.status === "merged_pending_harmonization" || p.status === "integrated");

  if (approvedPackages.length === 0) {
      return { wave: waveKey, error: "No packages approved for integration" };
  }

  const orderedPackages = approvedPackages.sort((a, b) => a.mergeOrder - b.mergeOrder);
  const reviewReceipts = await db.select().from(agentReviewReceipts);
  const collisions = await db.select().from(agentCollisionResults).where(eq(agentCollisionResults.waveKey, waveKey));

  return {
    wave: waveKey,
    baseSha: pkgsRes[0]?.baseSha,
    packagesApproved: orderedPackages.map(p => p.key),
    reviewReceipts: reviewReceipts.map(r => r.id),
    collisionMatrix: collisions,
    yellowCollisions: collisions.filter(c => c.status === "yellow"),
    mergeOrder: orderedPackages.map(p => p.key),
    contractIntersections: orderedPackages.flatMap(p => p.contractsConsumed as string[]).filter((contract, index, all) => all.indexOf(contract) !== index),
    schemaImpacts: orderedPackages.flatMap(p => p.schemaImpacts as string[]),
    aggregatorRequests: [],
    globalTests: ["npm run test:unit", "npm run test:integration"],
    rollbackOrder: orderedPackages.map(p => p.key).reverse(),
    completionCommands: [
      `npm run agent-work -- receipt:integration --wave ${waveKey}`
    ]
  };
}
