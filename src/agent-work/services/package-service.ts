import { getAgentWorkDb } from "../db";
import { agentWorkPackages, agentPackageTasks } from "../schema";
import { eq } from "drizzle-orm";
import { WorkPackage } from "../domain/types";

export async function createWorkPackage(pkg: WorkPackage) {
  await getAgentWorkDb().insert(agentWorkPackages).values(pkg).onConflictDoNothing();
}

export async function addPackageTask(packageKey: string, description: string, order: number) {
  await getAgentWorkDb().insert(agentPackageTasks).values({
    id: crypto.randomUUID(),
    key: crypto.randomUUID(),
    title: description,
    taskType: "implementation",
    acceptanceCriteria: [],
    expectedArtifacts: [],
    packageKey,
    description,
    order,
    status: "pending"
  }).onConflictDoNothing();
}



import { PackageStatus } from "../domain/types";
import { agentPackageDependencies } from "../schema";

export async function transitionPackageStatus(key: string, newStatus: PackageStatus) {
  const db = getAgentWorkDb();
  await db.transaction(async (tx) => {
      const pkgs = await tx.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, key)).for("update");
      if (pkgs.length === 0) throw new Error("Package not found");
      const pkg = pkgs[0];

      // Minimal validation just to ensure we're changing status, and bump revision
      if (pkg.status === newStatus) return;

      await tx.update(agentWorkPackages).set({
          status: newStatus,
          revision: pkg.revision + 1,
          updatedAt: new Date()
      }).where(eq(agentWorkPackages.key, key));

      // Event registration logic would go here
  });
}

export async function evaluatePackageReadiness(key: string): Promise<{ ready: boolean, reasons: string[] }> {
    const db = getAgentWorkDb();
    const pkgs = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, key));
    if (pkgs.length === 0) return { ready: false, reasons: ["Package not found"] };
    const pkg = pkgs[0];

    const reasons: string[] = [];

    if (pkg.baseSha === "latest" || pkg.baseSha === "HEAD" || pkg.baseSha === "current" || pkg.baseSha === "TBD" || pkg.baseSha.length < 40 || /^1234/.test(pkg.baseSha)) {
        reasons.push("Invalid base SHA");
    }

    const tasks = await db.select().from(agentPackageTasks).where(eq(agentPackageTasks.packageKey, key));
    if (tasks.length < 3 || tasks.length > 7) {
        reasons.push("Package must have between 3 and 7 tasks");
    }

    if (!pkg.ownedPaths || (Array.isArray(pkg.ownedPaths) && pkg.ownedPaths.length === 0)) {
        reasons.push("Must have at least one owned path");
    }

    if (!pkg.requiredTests || (Array.isArray(pkg.requiredTests) && pkg.requiredTests.length === 0)) {
        reasons.push("Must define required tests");
    }

    if (!pkg.acceptanceCriteria || (Array.isArray(pkg.acceptanceCriteria) && pkg.acceptanceCriteria.length === 0)) {
        reasons.push("Must define acceptance criteria");
    }

    const deps = await db.select().from(agentPackageDependencies).where(eq(agentPackageDependencies.dependentPackageKey, key));
    for (const dep of deps) {
        const requiredPkgs = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, dep.requiredPackageKey));
        if (requiredPkgs.length > 0) {
            if (requiredPkgs[0].status !== "done") {
                reasons.push(`Dependency ${dep.requiredPackageKey} is not done`);
            }
        }
    }

    return {
        ready: reasons.length === 0,
        reasons
    };
}
