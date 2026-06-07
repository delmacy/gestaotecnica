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
