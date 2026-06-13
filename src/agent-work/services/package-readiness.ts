import { agentWorkPackages, agentPackageTasks } from "../schema";
import { getAgentWorkDb } from "../db";
import { eq } from "drizzle-orm";

export async function evaluatePackageReadiness(packageKey: string): Promise<{ isReady: boolean, reasons: string[] }> {
  const db = getAgentWorkDb();
  const pkgRes = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, packageKey));
  if (pkgRes.length === 0) return { isReady: false, reasons: ["Package not found"] };
  const pkg = pkgRes[0];

  const reasons: string[] = [];

  if (!pkg.objective) reasons.push("Missing objective");
  if (!pkg.expectedOutcome) reasons.push("Missing expected outcome");
  if (!pkg.moduleKey) reasons.push("Missing module key");
  if (!pkg.laneKey) reasons.push("Missing lane key");
  if (!pkg.workerRole) reasons.push("Missing worker role");
  if (!pkg.waveKey) reasons.push("Missing wave key");

  if (!pkg.baseSha || pkg.baseSha === "latest" || pkg.baseSha === "HEAD" || pkg.baseSha === "current" || pkg.baseSha === "TBD" || pkg.baseSha.length !== 40) {
    reasons.push("Invalid base SHA (must be 40 chars real SHA)");
  }

  const ownedPaths = pkg.ownedPaths as string[];
  if (!ownedPaths || ownedPaths.length === 0) reasons.push("Missing owned paths");

  const readFirst = pkg.readFirst as string[];
  if (!readFirst || readFirst.length === 0) reasons.push("Missing read_first paths");

  const tasksRes = await db.select().from(agentPackageTasks).where(eq(agentPackageTasks.packageKey, packageKey));
  if (tasksRes.length < 3 || tasksRes.length > 7) {
    reasons.push(`Package must have 3-7 tasks, found ${tasksRes.length}`);
  } else {
     for (const t of tasksRes) {
       if (!t.title || !t.acceptanceCriteria || !t.expectedArtifacts) {
          reasons.push(`Task ${t.key} is incomplete`);
       }
     }
  }

  if (!pkg.requiredTests) reasons.push("Missing required tests");
  if (!pkg.documentationImpacts) reasons.push("Missing documentation impacts");
  if (!pkg.reviewBudget) reasons.push("Missing review budget");
  if (!pkg.rollbackNotes) reasons.push("Missing rollback notes");

  const isReady = reasons.length === 0;

  if (pkg.status === "planned" || pkg.status === "not_ready") {
      await db.update(agentWorkPackages)
        .set({ status: isReady ? "ready" : "not_ready" })
        .where(eq(agentWorkPackages.key, packageKey));
  }

  return { isReady, reasons };
}
