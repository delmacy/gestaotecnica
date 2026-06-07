import { eq } from "drizzle-orm";
import { processCandidates } from "@/db/platform/schema";
import { ProcessCandidate, CandidateStatus } from "./candidate.types";

export async function getCandidates(
  db: any,
  workspaceId: string
): Promise<ProcessCandidate[]> {
  const records = await db
    .select()
    .from(processCandidates)
    .where(eq(processCandidates.workspaceId, workspaceId));

  return records.map((record: any) => ({
    id: record.id,
    name: record.name,
    description: record.description ?? undefined,
    status: record.status as CandidateStatus,
    origin: record.origin as "agent" | "manual",
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    metadata: (record.metadata as Record<string, unknown>) ?? undefined,
  }));
}
