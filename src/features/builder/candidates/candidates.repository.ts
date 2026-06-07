import { eq } from "drizzle-orm";
import { processCandidates } from "@/db/platform/schema";
import type { getPlatformDb } from "@/db";
import type { CandidateOrigin, CandidateStatus, ProcessCandidate } from "./candidate.types";

export type CandidateRepositoryDb = ReturnType<typeof getPlatformDb>;
type CandidateRecord = typeof processCandidates.$inferSelect;

export async function getCandidates(
  db: CandidateRepositoryDb,
  workspaceId: string
): Promise<ProcessCandidate[]> {
  const records: CandidateRecord[] = await db
    .select()
    .from(processCandidates)
    .where(eq(processCandidates.workspaceId, workspaceId));

  return records.map((record) => ({
    id: record.id,
    workspaceId: record.workspaceId,
    name: record.name,
    description: record.description,
    status: record.status as CandidateStatus,
    origin: record.origin as CandidateOrigin,
    proposedDefinition: (record.proposedDefinition as Record<string, unknown>) ?? {},
    evidence: (record.evidence as Record<string, unknown>) ?? {},
    createdById: record.createdById,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }));
}
