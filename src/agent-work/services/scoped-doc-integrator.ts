import { agentWorkPackages, agentReviewPackages, agentDocumentationImpacts, agentIntegrationReceipts } from "../schema";
import { getAgentWorkDb } from "../db";
import { eq, inArray } from "drizzle-orm";

export async function generateDocumentationKit(waveKey: string) {
  const db = getAgentWorkDb();

  const pkgsRes = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.waveKey, waveKey));
  const mergedPackages = pkgsRes.filter(p => p.status === "merged_pending_harmonization" || p.status === "integrated" || p.status === "done");

  if (mergedPackages.length === 0) {
      return { wave: waveKey, error: "No packages ready for documentation harmonization" };
  }

  const packageKeys = mergedPackages.map(p => p.key);

  const docsRes = await db.select().from(agentDocumentationImpacts).where(inArray(agentDocumentationImpacts.packageKey, packageKeys));

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

  return {
    wave: waveKey,
    baseSha: pkgsRes[0]?.baseSha,
    approvedPackages: orderedPackages.map(p => p.key),
    mergeOrder: orderedPackages.map(p => p.key),
    publicContractIntersections: [], // Simplification
    completionCommands: [
      `npm run agent-work -- receipt:integration --wave ${waveKey}`
    ]
  };
}
