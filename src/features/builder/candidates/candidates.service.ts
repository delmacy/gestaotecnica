import { getCandidates } from "./candidates.repository";
import type { CandidateRepositoryDb } from "./candidates.repository";
import type { ProcessCandidate, CandidateStatus } from "./candidate.types";
import {
  UnauthorizedReviewerError,
  JustificationRequiredError,
  CandidateNotFoundError,
  InvalidCandidateTransitionError,
  CandidateWorkspaceMismatchError,
} from "./candidate.errors";

export interface AuthorizationPort {
  isHumanAndAuthorized(reviewerId: string, workspaceId: string): Promise<boolean>;
}

export interface CandidateRepositoryPort {
  getCandidateById(db: CandidateRepositoryDb, candidateId: string): Promise<ProcessCandidate | null>;
  updateCandidateStatus(db: CandidateRepositoryDb, candidateId: string, input: { status: CandidateStatus; updatedAt: Date }): Promise<void>;
}

export async function approveCandidateService(
  db: CandidateRepositoryDb,
  workspaceId: string,
  candidateId: string,
  reviewerId: string,
  justification: string,
  authPort: AuthorizationPort,
  repository: CandidateRepositoryPort
): Promise<ProcessCandidate> {
  const trimmedJustification = justification.trim();
  if (!trimmedJustification) {
    throw new JustificationRequiredError();
  }

  const isAuthorized = await authPort.isHumanAndAuthorized(reviewerId, workspaceId);
  if (!isAuthorized) {
    throw new UnauthorizedReviewerError();
  }

  const candidate = await repository.getCandidateById(db, candidateId);
  if (!candidate) {
    throw new CandidateNotFoundError();
  }

  if (candidate.workspaceId !== workspaceId) {
    throw new CandidateWorkspaceMismatchError();
  }

  if (candidate.status === "published") {
    throw new InvalidCandidateTransitionError("Cannot approve a published candidate");
  }

  if (candidate.status !== "under_analysis" && candidate.status !== "waiting_review") {
    throw new InvalidCandidateTransitionError("Candidate must be under analysis or waiting review to be approved");
  }

  await repository.updateCandidateStatus(db, candidateId, {
    status: "approved",
    updatedAt: new Date(),
  });

  return {
    ...candidate,
    status: "approved",
    updatedAt: new Date(),
  };
}

export async function rejectCandidateService(
  db: CandidateRepositoryDb,
  workspaceId: string,
  candidateId: string,
  reviewerId: string,
  justification: string,
  authPort: AuthorizationPort,
  repository: CandidateRepositoryPort
): Promise<ProcessCandidate> {
  const trimmedJustification = justification.trim();
  if (!trimmedJustification) {
    throw new JustificationRequiredError();
  }

  const isAuthorized = await authPort.isHumanAndAuthorized(reviewerId, workspaceId);
  if (!isAuthorized) {
    throw new UnauthorizedReviewerError();
  }

  const candidate = await repository.getCandidateById(db, candidateId);
  if (!candidate) {
    throw new CandidateNotFoundError();
  }

  if (candidate.workspaceId !== workspaceId) {
    throw new CandidateWorkspaceMismatchError();
  }

  if (candidate.status === "published") {
    throw new InvalidCandidateTransitionError("Cannot reject a published candidate");
  }

  if (candidate.status !== "under_analysis" && candidate.status !== "waiting_review") {
    throw new InvalidCandidateTransitionError("Candidate must be under analysis or waiting review to be rejected");
  }

  await repository.updateCandidateStatus(db, candidateId, {
    status: "rejected",
    updatedAt: new Date(),
  });

  return {
    ...candidate,
    status: "rejected",
    updatedAt: new Date(),
  };
}

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
