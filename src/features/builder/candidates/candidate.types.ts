export type CandidateStatus =
  | 'draft'
  | 'under_analysis'
  | 'waiting_review'
  | 'approved'
  | 'rejected'
  | 'published';

export type ProcessCandidate = {
  id: string;
  name: string;
  description?: string;
  status: CandidateStatus;
  origin: 'agent' | 'manual';
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
};
