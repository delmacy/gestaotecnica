import { agentWorkDb } from "../db";
import { agentWorkPackages, agentActiveClaims, agentPathClaims, agentWorkers } from "../schema";
import { eq, and, getTableColumns, inArray } from "drizzle-orm";
import { WorkPackage } from "../domain/types";
import { validateOwnership } from "./collision-engine";

export async function claimPackageTransactional(workerKey: string, packageKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    return await agentWorkDb.transaction(async (tx) => {
      // 1. Verifies the worker exists
      const worker = await tx.select().from(agentWorkers).where(eq(agentWorkers.key, workerKey));
      if (worker.length === 0) {
        return { success: false, error: "Worker not found" };
      }

      // 2. Checks if package exists and is planned
      const pkg = await tx.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, packageKey));
      if (pkg.length === 0) {
        return { success: false, error: "Package not found" };
      }
      if (pkg[0].status !== "planned") {
        return { success: false, error: "Package is not planned" };
      }

      // 3. Prevent double claim
      const active = await tx.select().from(agentActiveClaims).where(eq(agentActiveClaims.packageKey, packageKey));
      if (active.length > 0) {
        return { success: false, error: "Package already claimed" };
      }

      const parsedPkg = pkg[0] as unknown as WorkPackage;

      // 4. Validate collision
      const isCollisionSafe = validateOwnership(parsedPkg);
      if (!isCollisionSafe) {
         return { success: false, error: "Collision detected on exclusive paths" };
      }

      // 5. Create claim
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour lease

      const [claim] = await tx.insert(agentActiveClaims).values({
        id: crypto.randomUUID(),
        packageKey,
        workerKey,
        expiresAt,
      }).returning();

      // 6. Update package status
      await tx.update(agentWorkPackages)
        .set({ status: "in_progress", assignedWorkerKey: workerKey, startedAt: new Date() })
        .where(eq(agentWorkPackages.key, packageKey));

      // 7. Register paths
      const pathsToClaim = [...parsedPkg.ownedPaths, ...parsedPkg.readOnlyPaths];
      if (pathsToClaim.length > 0) {
        await tx.insert(agentPathClaims).values(
          pathsToClaim.map(path => ({
            id: crypto.randomUUID(),
            path,
            packageKey,
            claimId: claim.id
          }))
        );
      }

      return { success: true };
    });
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
