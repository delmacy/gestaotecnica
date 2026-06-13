import { agentWorkDb } from "../db";
import { agentActiveClaims, agentWorkPackages, agentPathClaims } from "../schema";
import { eq, lt } from "drizzle-orm";

export async function heartbeatClaim(claimId: string, workerKey: string): Promise<boolean> {
  const claim = await agentWorkDb.select().from(agentActiveClaims).where(eq(agentActiveClaims.id, claimId));
  if (claim.length === 0 || claim[0].workerKey !== workerKey) {
    return false;
  }

  const newExpiry = new Date();
  newExpiry.setHours(newExpiry.getHours() + 1);

  await agentWorkDb.update(agentActiveClaims)
    .set({ expiresAt: newExpiry })
    .where(eq(agentActiveClaims.id, claimId));

  return true;
}

export async function reapStaleClaims(): Promise<number> {
  return await agentWorkDb.transaction(async (tx) => {
    const now = new Date();
    const staleClaims = await tx.select().from(agentActiveClaims).where(lt(agentActiveClaims.expiresAt, now));

    if (staleClaims.length === 0) return 0;

    for (const claim of staleClaims) {
      await tx.delete(agentPathClaims).where(eq(agentPathClaims.claimId, claim.id));
      await tx.delete(agentActiveClaims).where(eq(agentActiveClaims.id, claim.id));
      await tx.update(agentWorkPackages)
        .set({ status: "planned", assignedWorkerKey: null })
        .where(eq(agentWorkPackages.key, claim.packageKey));
    }

    return staleClaims.length;
  });
}
