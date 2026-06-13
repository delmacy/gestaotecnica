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

export async function discoverDirectReviewDependencies(packageKey: string, fileContents: string[] = []) {
   const deps = {
      imports: [] as string[],
      exports: [] as string[],
      contractsConsumed: [] as string[],
      schemaReferences: [] as string[]
   };

   for (const content of fileContents) {
       const importRegex = /import\s+.*?from\s+['"](.*?)['"]/g;
       const exportRegex = /export\s+.*?from\s+['"](.*?)['"]/g;
       const aliasRegex = /@\/(.*?)/g;

       let match;
       while ((match = importRegex.exec(content)) !== null) {
           deps.imports.push(match[1]);
           if (match[1].includes('contracts')) deps.contractsConsumed.push(match[1]);
           if (match[1].includes('schema')) deps.schemaReferences.push(match[1]);
       }
       while ((match = exportRegex.exec(content)) !== null) {
           deps.exports.push(match[1]);
       }
       while ((match = aliasRegex.exec(content)) !== null) {
           deps.imports.push('@/' + match[1]);
       }
   }

   deps.imports = [...new Set(deps.imports)];
   deps.exports = [...new Set(deps.exports)];
   deps.contractsConsumed = [...new Set(deps.contractsConsumed)];
   deps.schemaReferences = [...new Set(deps.schemaReferences)];

   return deps;
}

export function calculateReviewBudget(diffStats: any) {
    const defaults = {
        production_files: 20,
        total_changed_files: 35,
        changed_lines_excluding_generated: 1500,
        public_contracts_changed: 3,
        modules_touched: 1
    };

    let exceeded = false;
    const reasons = [];

    if (diffStats.production_files > defaults.production_files) { exceeded = true; reasons.push("Production files exceeded"); }
    if (diffStats.total_changed_files > defaults.total_changed_files) { exceeded = true; reasons.push("Total changed files exceeded"); }
    if (diffStats.changed_lines_excluding_generated > defaults.changed_lines_excluding_generated) { exceeded = true; reasons.push("Changed lines exceeded"); }
    if (diffStats.public_contracts_changed > defaults.public_contracts_changed) { exceeded = true; reasons.push("Public contracts changed exceeded"); }
    if (diffStats.modules_touched > defaults.modules_touched) { exceeded = true; reasons.push("Modules touched exceeded"); }

    return {
        budget: defaults,
        exceeded,
        reasons,
        scopeResult: exceeded ? "review_scope_exceeded" : "within_scope"
    };
}

export function routeSpecializedReviews(pkg: any) {
    const reviews = ["module"];
    if (pkg.entryGate?.includes("security") || pkg.securityGate) reviews.push("security");
    if (pkg.entryGate?.includes("tenancy") || pkg.tenancyGate) reviews.push("tenancy");
    if (pkg.entryGate?.includes("migration") || pkg.migrationGate) reviews.push("migration");
    if (pkg.contractsProduced?.length > 0) reviews.push("contract");
    if (pkg.documentationImpacts?.length > 0) reviews.push("documentation");
    if (pkg.integrationRisk === "high") reviews.push("integration");

    return reviews;
}

export function generateReviewReceipt(reviewPkg: any, decisions: any) {
    const fs = require('fs');
    const path = require('path');

    const receiptContent = `# Review Receipt: ${reviewPkg.key}

## Scope
- Files Reviewed: ${decisions.files_reviewed?.length || 0}
- Files Intentionally Not Reviewed: ${decisions.files_intentionally_not_reviewed?.length || 0}
- Contracts Reviewed: ${decisions.contracts_reviewed?.length || 0}
- Dependencies Reviewed: ${decisions.dependencies_reviewed?.length || 0}
- Tests Verified: ${decisions.tests_verified ? 'Yes' : 'No'}

## Findings
${decisions.findings || 'None'}

## Required Changes
${decisions.required_changes || 'None'}

## Residual Risks
${decisions.residual_risks || 'None'}

## Decision
**${decisions.decision || 'APPROVED'}**
`;

    const dir = path.join(process.cwd(), `docs/modules/${reviewPkg.moduleKey}/reviews`);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const prNumber = reviewPkg.pullRequest || 'LOCAL';
    const filePath = path.join(dir, `${reviewPkg.key}__PR-${prNumber}.md`);
    fs.writeFileSync(filePath, receiptContent);
    return filePath;
}

// Basic stubs for active claims updates
export async function claimReview(reviewerKey: string, reviewPackageKey: string, reviewType: string) {
    const db = getAgentWorkDb();
    await db.insert(agentReviewClaims).values({
        id: crypto.randomUUID(),
        reviewPackageKey,
        reviewerKey,
        reviewType,
        status: "active",
        claimTokenHash: "mock",
        expiresAt: new Date(Date.now() + 3600000)
    });
    return { success: true };
}

export async function heartbeatReview(reviewPackageKey: string) { return { success: true }; }
export async function renewReview(reviewPackageKey: string) { return { success: true }; }
export async function releaseReview(reviewPackageKey: string) { return { success: true }; }
export async function requestReviewChanges(reviewPackageKey: string) { return { success: true }; }
export async function approveReview(reviewPackageKey: string) { return { success: true }; }
export async function completeReview(reviewPackageKey: string) { return { success: true }; }
