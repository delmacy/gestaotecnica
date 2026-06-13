import { getAgentWorkDb } from "../db";
import { agentWorkPackages, agentPackageTasks, agentWorkers } from "../schema";
import { eq, asc } from "drizzle-orm";
import { TaskKit, WorkPackage } from "../domain/types";
import { claimPackageTransactional } from "./claim-package";

export async function generateTaskKit(workerKey: string, packageKey: string): Promise<TaskKit | null> {
  const worker = await getAgentWorkDb().select().from(agentWorkers).where(eq(agentWorkers.key, workerKey));
  if (worker.length === 0) return null;

  const pkgRes = await getAgentWorkDb().select().from(agentWorkPackages).where(eq(agentWorkPackages.key, packageKey));
  if (pkgRes.length === 0) return null;

  const pkg = pkgRes[0] as unknown as WorkPackage;

  // Assume the claim has been made successfully by bootstrap or transactional
  // Fetch tasks
  const tasks = await getAgentWorkDb().select().from(agentPackageTasks).where(eq(agentPackageTasks.packageKey, packageKey)).orderBy(asc(agentPackageTasks.order));

  return {
    workerKey,
    workerRole: pkg.workerRole,
    moduleKey: pkg.moduleKey,
    packageKey: pkg.key,
    waveKey: pkg.waveKey,
    baseSha: pkg.baseSha,
    targetBranch: pkg.targetBranch,
    integrationBranch: pkg.integrationBranch,
    objective: pkg.objective,
    readFirst: pkg.readFirst || [],
    ownedPaths: pkg.ownedPaths || [],
    readOnlyPaths: pkg.readOnlyPaths || [],
    forbiddenPaths: pkg.forbiddenPaths || [],
    dependencies: [], // To be implemented in the future depending on the graph of dependencies.
    contractsConsumed: [], // Computed in real impl
    contractsProduced: [], // Computed in real impl
    tasks: tasks.map(t => ({ id: t.id, description: t.description, order: t.order })),
    acceptanceCriteria: pkg.acceptanceCriteria || [],
    requiredTests: pkg.requiredTests || [],
    documentationImpact: pkg.documentationImpacts || [],
    securityGate: pkg.entryGate?.includes('security') || false,
    tenancyGate: pkg.entryGate?.includes('tenancy') || false,
    migrationGate: pkg.entryGate?.includes('migration') || false,
    receiptPath: `docs/modules/${pkg.moduleKey}/activity/${new Date().getFullYear()}/${pkg.key}__PR-PENDING.md`,
    completionCommands: [
      `npm run agent-work -- package:complete --package ${pkg.key}`,
      `git commit -m "Complete ${pkg.key}"`,
      `git push origin ${pkg.targetBranch}`
    ]
  };
}
