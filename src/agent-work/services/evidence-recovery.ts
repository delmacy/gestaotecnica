import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { eq } from "drizzle-orm";
import { getAgentWorkDb } from "../db";
import { agentActivityReceipts, agentWorkPackages } from "../schema";
import { evaluatePathOwnership } from "./ownership-service";

export interface HistoricalEvidenceRecoveryInput {
  packageKey: string;
  originalWorkerKey: string;
  pullRequest: string;
  baseSha: string;
  headSha: string;
  mergeCommitSha: string;
  targetBranch: string;
  expectedFiles: string[];
  verificationCommands: string[];
  contractsConsumed: string[];
  contractsProduced: string[];
  documentationImpacts: string[];
  frontendImpact: string;
  handoff: string;
  rollbackNotes: string;
}

export interface VerificationResult {
  command: string;
  startedAt: string;
  finishedAt: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  success: boolean;
}

export async function recoverHistoricalActivityReceipt(input: HistoricalEvidenceRecoveryInput) {
  console.log(`Starting historical evidence recovery for package: ${input.packageKey}`);

  const db = getAgentWorkDb();
  const [pkg] = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, input.packageKey));
  if (!pkg) throw new Error(`Package ${input.packageKey} not found in database.`);

  // Check for existing recovery
  const existing = await db.select().from(agentActivityReceipts).where(eq(agentActivityReceipts.packageKey, input.packageKey));
  if (existing.length > 0) {
    const existingContent = JSON.parse(existing[0].content);
    if (existingContent.headSha !== input.headSha || existingContent.baseSha !== input.baseSha) {
       throw new Error(`Recovery already exists for package ${input.packageKey} but with different SHAs.`);
    }
    if (existingContent.originalWorkerKey !== input.originalWorkerKey) {
       throw new Error(`Recovery already exists for package ${input.packageKey} but with different worker.`);
    }
  }

  // 1. Validate Historical Git Execution (Rule 4)
  await validateHistoricalExecution(input);

  // 2. Collect Historical Diff (Rule 4)
  const diffInfo = collectHistoricalDiff(input, pkg);

  // 3. Execute Historical Verification (Worktree) (Rule 5, 6, 7)
  const verificationResults = await executeHistoricalVerification(input);

  // 4. Persist Recovered Receipt (Rule 10, 11)
  const receipt = await persistRecoveredActivityReceipt(input, pkg, diffInfo, verificationResults);

  return {
    success: true,
    receiptId: receipt.id,
    path: receipt.path,
    verificationResults
  };
}

export async function validateHistoricalExecution(input: HistoricalEvidenceRecoveryInput) {
  try {
    // Rule 4: Use git cat-file -e <SHA>^{commit}
    execSync(`git cat-file -e ${input.baseSha}^{commit}`);
    execSync(`git cat-file -e ${input.headSha}^{commit}`);
    execSync(`git cat-file -e ${input.mergeCommitSha}^{commit}`);

    // Rule 4: Use git merge-base --is-ancestor
    execSync(`git merge-base --is-ancestor ${input.headSha} ${input.mergeCommitSha}`);
    execSync(`git merge-base --is-ancestor ${input.mergeCommitSha} main`);
  } catch (e: any) {
    throw new Error(`Git validation failed: ${e.message}`);
  }
}

export function collectHistoricalDiff(input: HistoricalEvidenceRecoveryInput, pkg: any) {
  // Rule 4: Use git diff --name-only <BASE>..<HEAD>
  // We use --diff-filter=ACMR to match against expectedFiles (excluding deletions from cousin branches)
  const diffFilesRaw = execSync(`git diff --name-only --diff-filter=ACMR ${input.baseSha}..${input.headSha}`).toString().trim();
  const changedFiles = diffFilesRaw ? diffFilesRaw.split("\n") : [];

  if (changedFiles.length === 0) {
    throw new Error("Diff base..head is empty.");
  }

  // Changed files reais correspondem aos expectedFiles
  const sortedActual = [...changedFiles].sort();
  const sortedExpected = [...input.expectedFiles].sort();
  if (JSON.stringify(sortedActual) !== JSON.stringify(sortedExpected)) {
    throw new Error(`Actual changed files do not match expected files. Expected: ${input.expectedFiles.join(", ")}, Actual: ${changedFiles.join(", ")}`);
  }

  // Rule 8: Ownership validation
  const ownershipResult = evaluatePathOwnership(pkg, changedFiles);
  if (!ownershipResult.valid) {
    throw new Error(`Ownership violation: ${JSON.stringify(ownershipResult)}`);
  }

  return { changedFiles, ownershipResult };
}

export async function executeHistoricalVerification(input: HistoricalEvidenceRecoveryInput): Promise<VerificationResult[]> {
  const worktreePath = `/tmp/recovery-${input.packageKey}-${Date.now()}`;
  const results: VerificationResult[] = [];

  try {
    // Rule 5: Disposable worktrees
    execSync(`git worktree add --detach ${worktreePath} ${input.headSha}`);

    for (const cmd of input.verificationCommands) {
      const startedAt = new Date().toISOString();
      let exitCode = 0;
      let stdout = "";
      let stderr = "";

      try {
        stdout = execSync(cmd, { cwd: worktreePath, stdio: "pipe" }).toString();
      } catch (e: any) {
        exitCode = e.status || 1;
        stdout = e.stdout?.toString() || "";
        stderr = e.stderr?.toString() || "";
      }
      const finishedAt = new Date().toISOString();

      results.push({
        command: cmd, startedAt, finishedAt, exitCode,
        stdout: stdout.slice(0, 1000) + (stdout.length > 1000 ? "..." : ""),
        stderr: stderr.slice(0, 1000) + (stderr.length > 1000 ? "..." : ""),
        success: exitCode === 0
      });

      if (exitCode !== 0) {
        throw new Error(`Verification command failed: ${cmd}. Exit code: ${exitCode}`);
      }
    }
  } finally {
    if (fs.existsSync(worktreePath)) {
      try {
        execSync(`git worktree remove --force ${worktreePath}`);
        execSync(`git worktree prune`);
      } catch (e) {}
    }
  }

  return results;
}

export async function persistRecoveredActivityReceipt(
  input: HistoricalEvidenceRecoveryInput,
  pkg: any,
  diffInfo: { changedFiles: string[], ownershipResult: any },
  verificationResults: VerificationResult[]
) {
  const db = getAgentWorkDb();
  const receiptId = `ACT-RECOVERY-${input.packageKey}-${Date.now()}`;
  const year = "2026";

  const moduleDirs: Record<string, string> = {
    "shared-contracts": "shared-contracts",
    "documentation-governance": "documentation-governance"
  };
  const moduleDir = moduleDirs[pkg.moduleKey] || pkg.moduleKey;

  const fileName = `${input.packageKey}__PR-${input.pullRequest}__RECOVERED.md`;
  const mdPath = path.join("docs/modules", moduleDir, "activity", year, fileName);

  const contentObj = {
    receiptId,
    packageKey: input.packageKey,
    originalWorkerKey: input.originalWorkerKey,
    recoveryWorkerKey: process.env.JULES_WORKER_KEY || "jules-recovery-principal",
    wave: pkg.waveKey,
    originalPullRequest: input.pullRequest,
    baseSha: input.baseSha,
    headSha: input.headSha,
    mergeCommitSha: input.mergeCommitSha,
    targetBranch: input.targetBranch,
    changedFiles: diffInfo.changedFiles,
    ownershipResult: diffInfo.ownershipResult,
    // Rule 9: Differentiate originallyDeclaredTests and reexecutedVerificationTests
    originallyDeclaredTests: pkg.requiredTests,
    reexecutedVerificationTests: input.verificationCommands,
    verificationResults,
    contractsConsumed: input.contractsConsumed,
    contractsProduced: input.contractsProduced,
    documentationImpacts: input.documentationImpacts,
    frontendImpact: input.frontendImpact,
    handoff: input.handoff,
    rollbackNotes: input.rollbackNotes,
    evidenceOrigin: "historical_git_verification",
    recoveryTask: "WAVE-01-LOT-A-EVIDENCE-RECOVERY-001",
    recoveredAt: new Date().toISOString(),
    // Rule 10: Obligatory limitations
    limitations: [
      "No contemporaneous claim could be recovered.",
      "No contemporaneous lease could be recovered.",
      "The code and documentation were verified from immutable Git commits.",
      "Tests were re-executed after merge in detached worktrees."
    ]
  };

  const markdown = generateRecoveredMarkdown(contentObj);

  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, markdown);

  await db.insert(agentActivityReceipts).values({
    id: receiptId,
    packageKey: input.packageKey,
    content: JSON.stringify(contentObj),
    path: mdPath,
    baseSha: input.baseSha,
    headSha: input.headSha,
    status: "recovered_post_merge"
  });

  return { id: receiptId, path: mdPath };
}

function generateRecoveredMarkdown(data: any) {
  return `# Activity Receipt: ${data.packageKey} (RECOVERED)

**Status: recovered_post_merge**
**Evidence Origin: historical_git_verification**
**Recovery Task: ${data.recoveryTask}**

> **EXPLICIT DISCLAIMER:**
> This receipt was generated after merge from reproducible Git evidence.
> It was not present during the original package execution.

## Recovery Metadata
- Receipt ID: \`${data.receiptId}\`
- Recovered At: ${data.recoveredAt}
- Recovered By: ${data.recoveryWorkerKey}
- Original Worker: ${data.originalWorkerKey}
- Original PR: ${data.originalPullRequest}
- Wave: ${data.wave}

## Historical Git Evidence
- Base SHA: \`${data.baseSha}\`
- Head SHA: \`${data.headSha}\`
- Merge Commit: \`${data.mergeCommitSha}\`
- Target Branch: \`${data.targetBranch}\`

## Changed Files
${data.changedFiles.map((f: string) => `- ${f}`).join("\n")}

## Ownership Validation
- Valid: ${data.ownershipResult.valid ? "✅" : "❌"}
- Owned Files: ${data.ownershipResult.ownedFiles.length}
- Outside Ownership: ${data.ownershipResult.outsideOwnership.length}
- Read-only Violations: ${data.ownershipResult.readOnlyViolations.length}
- Forbidden Violations: ${data.ownershipResult.forbiddenViolations.length}

## Verification Commands (Re-executed post-merge)
${data.verificationResults.map((r: any) => `
### Command: \`${r.command}\`
- Status: ${r.success ? "SUCCESS ✅" : "FAILED ❌"}
- Exit Code: ${r.exitCode}
- Duration: ${new Date(r.finishedAt).getTime() - new Date(r.startedAt).getTime()}ms

#### Stdout
\`\`\`
${r.stdout}
\`\`\`

#### Stderr
\`\`\`
${r.stderr}
\`\`\`
`).join("\n")}

## Contracts
- Consumed: ${data.contractsConsumed.join(", ") || "None"}
- Produced: ${data.contractsProduced.join(", ") || "None"}

## Documentation Impacts
${data.documentationImpacts.map((d: string) => `- ${d}`).join("\n") || "None"}

## Handoff
${data.handoff || "N/A"}

## Rollback Notes
${data.rollbackNotes || "N/A"}

## Limitations
${data.limitations.map((l: string) => `- ${l}`).join("\n")}

---
*Generated by Jules Wave 01 Evidence Recovery Principal*
`;
}
