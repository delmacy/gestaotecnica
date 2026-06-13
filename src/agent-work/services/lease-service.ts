import { getAgentWorkDb } from "../db";
import { agentActiveClaims, agentWorkPackages, agentPathClaims, agentClaimHistory } from "../schema";
import { eq, lt, and } from "drizzle-orm";

export async function heartbeatClaim(claimId: string, workerKey: string, claimTokenHash: string): Promise<boolean> {
  const db = getAgentWorkDb();
  const claim = await db.select().from(agentActiveClaims).where(eq(agentActiveClaims.id, claimId));
  if (claim.length === 0 || claim[0].workerKey !== workerKey || claim[0].claimTokenHash !== claimTokenHash) {
    return false;
  }

  const newExpiry = new Date();
  newExpiry.setHours(newExpiry.getHours() + 1);
  const now = new Date();

  await db.update(agentActiveClaims)
    .set({ expiresAt: newExpiry, heartbeatAt: now })
    .where(eq(agentActiveClaims.id, claimId));

  await db.update(agentPathClaims)
    .set({ expiresAt: newExpiry })
    .where(eq(agentPathClaims.claimId, claimId));

  return true;
}

export async function releaseClaim(claimId: string, reason: string): Promise<boolean> {
  return await getAgentWorkDb().transaction(async (tx) => {
    const claimRes = await tx.select().from(agentActiveClaims).where(eq(agentActiveClaims.id, claimId));
    if (claimRes.length === 0) return false;
    const claim = claimRes[0];

    await tx.insert(agentClaimHistory).values({
       id: crypto.randomUUID(),
       packageKey: claim.packageKey,
       workerKey: claim.workerKey,
       action: "released",
       claimedAt: claim.claimedAt,
       heartbeatAt: claim.heartbeatAt,
       expiresAt: claim.expiresAt,
       releasedAt: new Date(),
       releaseReason: reason,
       eventType: "claim_released",
    });

    await tx.delete(agentPathClaims).where(eq(agentPathClaims.claimId, claimId));
    await tx.delete(agentActiveClaims).where(eq(agentActiveClaims.id, claimId));

    // Check package status policy... for now revert to blocked if not done
    const pkgRes = await tx.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, claim.packageKey));
    if (pkgRes.length > 0 && pkgRes[0].status === "in_progress") {
       await tx.update(agentWorkPackages)
        .set({ status: "ready", assignedWorkerKey: null })
        .where(eq(agentWorkPackages.key, claim.packageKey));
    }

    return true;
  });
}

export async function reapStaleClaims(): Promise<number> {
  const db = getAgentWorkDb();
  return await db.transaction(async (tx) => {
    const now = new Date();
    const staleClaims = await tx.select().from(agentActiveClaims).where(lt(agentActiveClaims.expiresAt, now));

    if (staleClaims.length === 0) return 0;

    for (const claim of staleClaims) {
      await tx.insert(agentClaimHistory).values({
         id: crypto.randomUUID(),
         packageKey: claim.packageKey,
         workerKey: claim.workerKey,
         action: "reaped",
         claimedAt: claim.claimedAt,
         heartbeatAt: claim.heartbeatAt,
         expiresAt: claim.expiresAt,
         releasedAt: new Date(),
         releaseReason: "stale_lease",
         eventType: "claim_reaped",
      });

      await tx.delete(agentPathClaims).where(eq(agentPathClaims.claimId, claim.id));
      await tx.delete(agentActiveClaims).where(eq(agentActiveClaims.id, claim.id));
      await tx.update(agentWorkPackages)
        .set({ status: "blocked", assignedWorkerKey: null, blockedReason: "Stale lease reaped" })
        .where(eq(agentWorkPackages.key, claim.packageKey));
    }

    return staleClaims.length;
  });
}
