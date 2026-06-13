import { agentWorkPackages, agentReviewPackages, agentReviewClaims } from "../schema";
import { getAgentWorkDb } from "../db";
import { eq } from "drizzle-orm";

export async function generateReviewKit(reviewPackageKey: string) {
  const db = getAgentWorkDb();
  const reviewPkgRes = await db.select().from(agentReviewPackages).where(eq(agentReviewPackages.key, reviewPackageKey));
  if (reviewPkgRes.length === 0) throw new Error("Review package not found");
  const reviewPkg = reviewPkgRes[0];

  const workPkgRes = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, reviewPkg.workPackageKey));
  const workPkg = workPkgRes[0];

  return {
    reviewPackage: reviewPkg.key,
    workPackage: workPkg.key,
    objective: reviewPkg.objective,
    baseSha: reviewPkg.baseSha,
    headSha: reviewPkg.headSha,

    changedFilesByCategory: {
      production: reviewPkg.productionFiles,
      test: reviewPkg.testFiles,
      documentation: reviewPkg.documentationFiles,
      migration: reviewPkg.migrationFiles,
      generated: reviewPkg.generatedFiles,
      lockfiles: reviewPkg.lockfiles,
    },
    changedLines: reviewPkg.changedLinesExcludingGenerated,

    ownedPaths: workPkg.ownedPaths,

    contractsConsumed: reviewPkg.contractsConsumed,
    contractsProduced: reviewPkg.contractsProduced,
    publicContractsChanged: reviewPkg.publicContractsChanged,
    knownConsumers: reviewPkg.knownConsumers,
    directDependencies: reviewPkg.directDependencies,

    reviewBudget: reviewPkg.reviewBudget,
    scopeResult: reviewPkg.scopeCheckResult,

    completionCommands: [
      `npm run agent-work -- review:approve --review ${reviewPkg.key}`,
      `npm run agent-work -- review:request-changes --review ${reviewPkg.key}`
    ]
  };
}

export async function discoverDirectReviewDependencies(packageKey: string) {
   // Minimal placeholder for semantic dependency discovery
   return {
      imports: [],
      exports: [],
      contractsConsumed: [],
      schemaReferences: []
   };
}
