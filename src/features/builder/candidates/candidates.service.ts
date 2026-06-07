import { getCandidates } from "./candidates.repository";
import type { CandidateRepositoryDb } from "./candidates.repository";
import type { ProcessCandidate } from "./candidate.types";

export async function listCandidatesService(
  db: CandidateRepositoryDb,
  workspaceId: string,
  repository: typeof getCandidates = getCandidates
): Promise<ProcessCandidate[]> {
  if (!workspaceId.trim()) {
    throw new Error("Workspace ID is required");
  }

  return repository(db, workspaceId);
}
