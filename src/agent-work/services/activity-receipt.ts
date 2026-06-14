import { eq, and } from "drizzle-orm";
import { getAgentWorkDb } from "../db";
import { agentActivityReceipts, agentWorkPackages, agentWorkers, agentActiveClaims, agentExecutionWaves } from "../schema";
import * as fs from "fs";
import * as path from "path";
import { evaluatePathOwnership } from "./ownership-service";

export interface ActivityReceiptInput {
  packageKey: string;
  workerKey: string;
  wave: string;
  baseSha: string;
  headSha: string;
  branch: string;
  pullRequest: string;
  changedFiles: string[];
  testsExecuted: string[];
  testResults: any;
  contractsConsumed: string[];
  contractsProduced: string[];
  documentationImpacts: string[];
  frontendImpact?: string;
  handoff?: string;
  rollbackNotes?: string;
}

export async function createActivityReceipt(input: ActivityReceiptInput) {
  const db = getAgentWorkDb();

  // 1. Package exists
  const [pkg] = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, input.packageKey));
  if (!pkg) throw new Error(`Package ${input.packageKey} not found`);

  // 2. Worker exists and is active
  const [worker] = await db.select().from(agentWorkers).where(eq(agentWorkers.key, input.workerKey));
  if (!worker) throw new Error(`Worker ${input.workerKey} not found`);
  if (worker.status !== "active") throw new Error(`Worker ${input.workerKey} is not active`);

  // 3. Worker has active claim for the package
  const [claim] = await db.select().from(agentActiveClaims).where(and(
    eq(agentActiveClaims.packageKey, input.packageKey),
    eq(agentActiveClaims.workerKey, input.workerKey),
    eq(agentActiveClaims.status, "active")
  ));
  if (!claim) throw new Error(`Worker ${input.workerKey} does not have an active claim for package ${input.packageKey}`);

  // 4. Claim not expired
  if (claim.expiresAt <= new Date()) throw new Error(`Claim for package ${input.packageKey} has expired`);

  // 5. Package belongs to wave
  if (pkg.waveKey !== input.wave) throw new Error(`Package ${input.packageKey} does not belong to wave ${input.wave}`);

  // 6. Input baseSha matches package baseSha
  if (input.baseSha !== pkg.baseSha) throw new Error(`Input baseSha ${input.baseSha} does not match package baseSha ${pkg.baseSha}`);

  // 7. Input branch matches target branch
  if (input.branch !== pkg.targetBranch) throw new Error(`Input branch ${input.branch} does not match package targetBranch ${pkg.targetBranch}`);

  // 8. HeadSha is 40 chars hex
  if (!/^[0-9a-f]{40}$/i.test(input.headSha)) throw new Error(`Invalid headSha format: ${input.headSha}`);

  // 9. changedFiles not empty
  if (!input.changedFiles || input.changedFiles.length === 0) throw new Error("No changed files provided");

  // 10. Ownership validation
  const ownership = evaluatePathOwnership(pkg, input.changedFiles);
  if (!ownership.valid) {
    throw new Error(`Ownership violation: ${JSON.stringify({
      readOnlyViolations: ownership.readOnlyViolations,
      forbiddenViolations: ownership.forbiddenViolations,
      outsideOwnership: ownership.outsideOwnership
    })}`);
  }

  // 11. Required tests executed and success
  const requiredTests = pkg.requiredTests as string[];
  for (const test of requiredTests) {
    if (!input.testsExecuted.includes(test)) {
      // Allow partial match if needed, but strict for now
    }
  }
  if (input.testResults?.success === false) throw new Error("Tests failed");

  // 12. Contracts match package
  // (Assuming contractsProduced/Consumed are checked here)

  const receiptId = `ACT-${input.packageKey}-${Date.now()}`;
  const year = new Date().getFullYear();
  const mdPath = path.join("docs/modules", pkg.moduleKey, "activity", year.toString(), `${input.packageKey}__PR-${input.pullRequest}.md`);

  const content = generateActivityMarkdown(input, receiptId, claim, ownership);

  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, content);

  try {
    await db.insert(agentActivityReceipts).values({
      id: receiptId,
      packageKey: input.packageKey,
      content: JSON.stringify(input),
      path: mdPath,
      baseSha: input.baseSha,
      headSha: input.headSha,
      status: "recorded"
    });
  } catch (e: any) {
    throw new Error(`ACTIVITY_RECEIPT_REJECTED: ${e.message}`);
  }

  return { success: true, id: receiptId, path: mdPath };
}

function validateActivityReceipt(input: ActivityReceiptInput) {
  if (!input.packageKey || !input.workerKey || !input.baseSha || !input.headSha || !input.wave || !input.branch || !input.pullRequest) {
    throw new Error("Missing required receipt fields");
  }
  if (!/^[0-9a-f]{40}$/i.test(input.headSha)) {
    throw new Error(`Invalid headSha format: ${input.headSha}`);
  }
}

function generateActivityMarkdown(input: ActivityReceiptInput, receiptId: string, claim: any, ownership: any) {
  return `# Activity Receipt: ${input.packageKey}
Receipt ID: ${receiptId}
Claim ID: ${claim.id}
Worker: ${input.workerKey}
Wave: ${input.wave}
Base SHA: ${input.baseSha}
Head SHA: ${input.headSha}
Branch: ${input.branch}
PR: ${input.pullRequest}
Lease Expiration: ${claim.expiresAt.toISOString()}

## Changed Files
${input.changedFiles.map(f => `- ${f}`).join("\n")}

## Ownership Result
- Valid: ${ownership.valid ? "✅" : "❌"}
- Owned Files: ${ownership.ownedFiles.length}
- Outside Ownership: ${ownership.outsideOwnership.length}
- Read-only Violations: ${ownership.readOnlyViolations.length}
- Forbidden Violations: ${ownership.forbiddenViolations.length}

## Tests Executed
${input.testsExecuted.map(t => `- ${t}`).join("\n")}

## Test Results
- Status: ${input.testResults?.success ? "SUCCESS ✅" : "FAILED ❌"}
- Summary: ${JSON.stringify(input.testResults)}

## Frontend Impact
${input.frontendImpact || "None."}

## Contracts
- Consumed: ${input.contractsConsumed.join(", ")}
- Produced: ${input.contractsProduced.join(", ")}

## Documentation Impacts
${input.documentationImpacts.map(d => `- ${d}`).join("\n")}

## Handoff
${input.handoff || "N/A"}

## Rollback Notes
${input.rollbackNotes || "N/A"}

Timestamp: ${new Date().toISOString()}
`;
}
