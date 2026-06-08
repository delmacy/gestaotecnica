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

export async function getCandidateById(
  db: CandidateRepositoryDb,
  candidateId: string
): Promise<ProcessCandidate | null> {
  const records = await db
    .select()
    .from(processCandidates)
    .where(eq(processCandidates.id, candidateId))
    .limit(1);

  if (records.length === 0) return null;

  const record = records[0];
  return {
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
  };
}

export async function updateCandidateStatus(
  db: CandidateRepositoryDb,
  candidateId: string,
  input: { status: CandidateStatus; updatedAt: Date }
): Promise<void> {
  await db
    .update(processCandidates)
    .set({
      status: input.status,
      updatedAt: input.updatedAt,
    })
    .where(eq(processCandidates.id, candidateId));
}
