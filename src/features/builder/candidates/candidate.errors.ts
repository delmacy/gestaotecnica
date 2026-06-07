export class CandidateError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "CandidateError";
  }
}

export class UnauthorizedReviewerError extends CandidateError {
  constructor(message = "Reviewer is unauthorized or not a human") {
    super("UNAUTHORIZED_REVIEWER", message);
    this.name = "UnauthorizedReviewerError";
  }
}

export class JustificationRequiredError extends CandidateError {
  constructor(message = "A valid justification is required") {
    super("JUSTIFICATION_REQUIRED", message);
    this.name = "JustificationRequiredError";
  }
}

export class CandidateNotFoundError extends CandidateError {
  constructor(message = "Process Candidate not found") {
    super("CANDIDATE_NOT_FOUND", message);
    this.name = "CandidateNotFoundError";
  }
}

export class InvalidCandidateTransitionError extends CandidateError {
  constructor(message = "Invalid candidate state transition") {
    super("INVALID_CANDIDATE_TRANSITION", message);
    this.name = "InvalidCandidateTransitionError";
  }
}

export class CandidateWorkspaceMismatchError extends CandidateError {
  constructor(message = "Candidate workspace mismatch") {
    super("CANDIDATE_WORKSPACE_MISMATCH", message);
    this.name = "CandidateWorkspaceMismatchError";
  }
}

export class InvalidProposedDefinitionError extends CandidateError {
  public issues?: any[];
  constructor(message = "Invalid proposed definition", issues?: any[]) {
    super("INVALID_PROPOSED_DEFINITION", message);
    this.name = "InvalidProposedDefinitionError";
    this.issues = issues;
  }
}

export class CandidateAlreadyPublishedError extends CandidateError {
  constructor(message = "Candidate is already published") {
    super("CANDIDATE_ALREADY_PUBLISHED", message);
    this.name = "CandidateAlreadyPublishedError";
  }
}

export class WorkflowPublicationFailedError extends CandidateError {
  public cause?: unknown;
  constructor(message = "Workflow publication failed", options?: { cause?: unknown }) {
    super("WORKFLOW_PUBLICATION_FAILED", message);
    this.name = "WorkflowPublicationFailedError";
    this.cause = options?.cause;
  }
}
