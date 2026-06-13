import { getAgentWorkDb } from "../db";
import { agentWorkPackages, agentActiveClaims, agentPathClaims, agentWorkers, agentPackageDependencies, agentContractVersions } from "../schema";
import { eq, and, sql } from "drizzle-orm";
import { validateOwnership } from "./collision-engine";

export async function claimPackageTransactional(workerKey: string, packageKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getAgentWorkDb();
    return await db.transaction(async (tx) => {
      // 1. Verifies the worker exists
      const workerRes = await tx.select().from(agentWorkers).where(eq(agentWorkers.key, workerKey));
      if (workerRes.length === 0) {
        return { success: false, error: "Worker not found" };
      }
      const worker = workerRes[0];
      if (worker.status !== "active") {
         return { success: false, error: "Worker not active" };
      }

      // 2. Checks if package exists and is ready
      const pkgRes = await tx.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, packageKey)).for("update");
      if (pkgRes.length === 0) {
        return { success: false, error: "Package not found" };
      }
      const pkg = pkgRes[0];
      if (pkg.status !== "ready") {
        return { success: false, error: "Package is not ready" };
      }

      // 3. Worker compatibility
      if (pkg.workerRole !== worker.role) {
         return { success: false, error: "Worker role incompatible" };
      }
      if (worker.moduleKey && pkg.moduleKey !== worker.moduleKey) {
         return { success: false, error: "Worker module incompatible" };
      }

      // 4. Max active claims
      const activeWorkerClaims = await tx.select().from(agentActiveClaims).where(eq(agentActiveClaims.workerKey, workerKey));
      if (activeWorkerClaims.length >= worker.maxActiveClaims) {
         return { success: false, error: "Max active claims reached for worker" };
      }

      // 5. Prevent double claim
      const active = await tx.select().from(agentActiveClaims).where(eq(agentActiveClaims.packageKey, packageKey));
      if (active.length > 0) {
        return { success: false, error: "Package already claimed" };
      }

      // 6. Dependencies
      const deps = await tx.select().from(agentPackageDependencies).where(eq(agentPackageDependencies.dependentPackageKey, packageKey));
      const unfulfilledDeps = deps.filter(d => d.status !== "completed");
      if (unfulfilledDeps.length > 0) {
         return { success: false, error: "Dependencies not completed" };
      }

      // 7. Validate collision
      const isCollisionSafe = validateOwnership(pkg as any);
      if (!isCollisionSafe) {
         return { success: false, error: "Collision detected on exclusive paths" };
      }

      // 8. Create claim
      const claimTokenHash = crypto.randomUUID(); // hash ideally
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour lease

      const [claim] = await tx.insert(agentActiveClaims).values({
        id: crypto.randomUUID(),
        packageKey,
        workerKey,
        claimTokenHash,
        status: "active",
        baseSha: pkg.baseSha,
        expiresAt,
      }).returning();

      // 9. Update package status
      await tx.update(agentWorkPackages)
        .set({ status: "in_progress", assignedWorkerKey: workerKey, startedAt: new Date() })
        .where(eq(agentWorkPackages.key, packageKey));

      // 10. Register paths
      const ownedPaths = (pkg.ownedPaths as string[]) || [];
      const readOnlyPaths = (pkg.readOnlyPaths as string[]) || [];
      const allPaths = [
        ...ownedPaths.map(p => ({ p, mode: "owned" })),
        ...readOnlyPaths.map(p => ({ p, mode: "readOnly" }))
      ];

      if (allPaths.length > 0) {
        await tx.insert(agentPathClaims).values(
          allPaths.map(item => ({
            id: crypto.randomUUID(),
            path: item.p,
            packageKey,
            claimId: claim.id,
            waveKey: pkg.waveKey,
            workerKey,
            pathPattern: item.p,
            ownershipMode: item.mode,
            expiresAt,
            status: "active",
          }))
        );
      }

      return { success: true };
    });
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function heartbeatClaim(workerKey: string, packageKey: string): Promise<{ success: boolean; error?: string }> {
    try {
        const db = getAgentWorkDb();
        const active = await db.select().from(agentActiveClaims).where(and(eq(agentActiveClaims.workerKey, workerKey), eq(agentActiveClaims.packageKey, packageKey)));
        if (active.length === 0) return { success: false, error: "No active claim" };

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        await db.update(agentActiveClaims).set({ expiresAt }).where(eq(agentActiveClaims.id, active[0].id));
        await db.update(agentPathClaims).set({ expiresAt }).where(eq(agentPathClaims.claimId, active[0].id));

        return { success: true };
    } catch (e) {
        return { success: false, error: "Unknown error" };
    }
}

export async function reapStaleClaims(): Promise<{ reaped: number }> {
    const db = getAgentWorkDb();
    const now = new Date();

    return await db.transaction(async (tx) => {
        const stales = await tx.select().from(agentActiveClaims).where(sql`${agentActiveClaims.expiresAt} < ${now}`).for("update");
        if (stales.length === 0) return { reaped: 0 };

        for (const stale of stales) {
            await tx.update(agentWorkPackages).set({ status: "ready", assignedWorkerKey: null }).where(eq(agentWorkPackages.key, stale.packageKey));
            await tx.delete(agentPathClaims).where(eq(agentPathClaims.claimId, stale.id));
            await tx.delete(agentActiveClaims).where(eq(agentActiveClaims.id, stale.id));
        }

        return { reaped: stales.length };
    });
}
