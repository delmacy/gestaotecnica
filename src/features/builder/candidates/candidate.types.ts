export type ProcessCandidateStatus =
  | "draft"
  | "under_analysis"
  | "waiting_review"
  | "approved"
  | "rejected"
  | "published";

export type ProcessCandidateOrigin = "manual" | "agent" | "integration" | "imported";

export interface ProcessCandidateInsert {
  id?: string;
  workspaceId: string;
  name: string;
  description?: string | null;
  status?: ProcessCandidateStatus;
  origin?: ProcessCandidateOrigin;
  proposedDefinition?: Record<string, unknown> | null;
  evidence?: Record<string, unknown> | null;
  createdById?: string | null;
}

export interface ProcessCandidateRecord {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  status: ProcessCandidateStatus;
  origin: ProcessCandidateOrigin;
  proposedDefinition: Record<string, unknown>;
  evidence: Record<string, unknown>;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
}
