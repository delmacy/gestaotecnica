import { validateBuilderDraft } from "../process-editor/validate-builder-draft";
import type { BuilderDraft } from "../types";
import {
  CandidateNotFoundError,
  CandidateWorkspaceMismatchError,
  InvalidCandidateTransitionError,
} from "./candidate.errors";
import {
  InvalidProposedDefinitionError,
  CandidateAlreadyPublishedError,
  WorkflowPublicationFailedError,
} from "./candidate.errors";
import type { ProcessCandidate } from "./candidate.types";

export interface PublisherRepositoryPort {
  getCandidateById(db: any, candidateId: string): Promise<ProcessCandidate | null>;
  updateCandidateStatus(db: any, candidateId: string, status: "published", updatedAt: Date): Promise<void>;
  createProcessDefinition(db: any, input: any): Promise<any>;
  runInTransaction<T>(db: any, callback: (tx: any) => Promise<T>): Promise<T>;
}

export async function publishApprovedCandidate(
  db: any,
  workspaceId: string,
  candidateId: string,
  publishedById: string,
  repository: PublisherRepositoryPort
): Promise<any> {
  // If the db instance doesn't support transactions, we simulate execution within the limit
  // and handle atomicity failures manually as instructed in limits
  return repository.runInTransaction(db, async (tx) => {
    const candidate = await repository.getCandidateById(tx, candidateId);

    if (!candidate) {
      throw new CandidateNotFoundError();
    }

    if (candidate.workspaceId !== workspaceId) {
      throw new CandidateWorkspaceMismatchError();
    }

    if (candidate.status === "published") {
      throw new CandidateAlreadyPublishedError("Candidate is already published");
    }

    if (candidate.status !== "approved") {
      throw new InvalidCandidateTransitionError("Only approved candidates can be published");
    }

    if (!candidate.proposedDefinition || Object.keys(candidate.proposedDefinition).length === 0) {
      throw new InvalidProposedDefinitionError("Proposed definition cannot be empty");
    }

    const draft = candidate.proposedDefinition as unknown as BuilderDraft;
    const validationResult = validateBuilderDraft(draft);

    if (!validationResult.valid) {
      throw new InvalidProposedDefinitionError("Proposed definition is invalid", validationResult.issues);
    }

    // Map to CreateProcessDefinitionInput
    const processName = draft.name || candidate.name || "Processo sem nome";

    // Technical Block: We pass candidateId to the interface to preserve the reference.
    // The actual repository adapter will need to find a place for it (e.g. metadata field when schema is updated)
    const createProcessInput = {
      workspaceId,
      draft,
      createdBy: publishedById,
      name: processName,
      sourceCandidateId: candidateId, // <--- Traceability preserved here in the interface contract
    };

    try {
      const processVersion = await repository.createProcessDefinition(tx, createProcessInput);

      await repository.updateCandidateStatus(tx, candidateId, "published", new Date());

      return processVersion;
    } catch (error) {
      throw new WorkflowPublicationFailedError("Failed to publish workflow definition", { cause: error });
    }
  });
}
