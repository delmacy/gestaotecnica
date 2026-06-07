import { getCandidates } from "./candidates.repository";
import { ProcessCandidate } from "./candidate.types";

export async function listCandidatesService(
  db: any,
  workspaceId: string
): Promise<ProcessCandidate[]> {
  if (!workspaceId) {
    throw new Error("Workspace ID is required");
  }

  return getCandidates(db, workspaceId);
}
