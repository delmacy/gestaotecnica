export const PROCESS_CANDIDATE_STATUSES = [
  "draft",
  "under_analysis",
  "waiting_review",
  "approved",
  "rejected",
  "published",
] as const;

export type CandidateStatus = typeof PROCESS_CANDIDATE_STATUSES[number];

export const PROCESS_CANDIDATE_ORIGINS = [
  "manual",
  "agent",
  "integration",
  "imported",
] as const;

export type CandidateOrigin = typeof PROCESS_CANDIDATE_ORIGINS[number];

export type ProcessCandidate =
  {
    id: string;
    workspaceId: string;
    name: string;
    description: string | null;
    status: CandidateStatus;
    origin: CandidateOrigin;
    proposedDefinition: Record<string, unknown>;
    evidence: Record<string, unknown>;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
  };

export type ProcessCandidateFilter = {
  searchTerm?: string;
  status?: CandidateStatus | "all";
};
