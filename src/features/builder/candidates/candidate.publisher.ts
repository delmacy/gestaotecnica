import { validateBuilderDraft } from "../process-editor/validate-builder-draft";
import type { BuilderDraft } from "../types";
import {
  CandidateAlreadyPublishedError,
  CandidateNotFoundError,
  CandidatePublicationConflictError,
  CandidateWorkspaceMismatchError,
  InvalidCandidateTransitionError,
  InvalidProposedDefinitionError,
  WorkflowPublicationFailedError,
} from "./candidate.errors";
import type { CandidateRepositoryDb } from "./candidates.repository";

import type { ProcessCandidate } from "./candidate.types";
import { TraceReceiptService } from "@/features/platform/gateway/trace-receipt/trace-receipt.service";
import { drizzleTraceReceiptRepository } from "@/features/platform/gateway/trace-receipt/trace-receipt.repository";
import type { DbClient } from "@/db";


export type CreatePublishedProcessInput = {
  workspaceId: string;
  draft: BuilderDraft;
  createdBy: string;
  name: string;
  sourceCandidateId: string;
};

export type PublishedProcessResult = {
  processDefinitionId: string;
  processVersionId: string;
  sourceCandidateId: string | null;
};

export interface PublisherRepositoryPort {
  getCandidateById(db: CandidateRepositoryDb, candidateId: string): Promise<ProcessCandidate | null>;
  createProcessDefinition(
    db: CandidateRepositoryDb,
    input: CreatePublishedProcessInput,
  ): Promise<PublishedProcessResult>;
  markCandidatePublished(
    db: CandidateRepositoryDb,
    input: { workspaceId: string; candidateId: string; updatedAt: Date },
  ): Promise<boolean>;
  runInTransaction<T>(
    db: CandidateRepositoryDb,
    callback: (tx: CandidateRepositoryDb) => Promise<T>,
  ): Promise<T>;
}

function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const candidate = error as { code?: unknown; cause?: unknown };
  return candidate.code === "23505" || isUniqueViolation(candidate.cause);
}

function isBuilderDraft(value: Record<string, unknown>): value is Record<string, unknown> & BuilderDraft {
  return (
    typeof value.name === "string" &&
    (value.status === "draft" || value.status === "published" || value.status === "archived") &&
    Array.isArray(value.nodes) &&
    Array.isArray(value.edges)
  );
}


export async function publishApprovedCandidate(
  db: CandidateRepositoryDb,
  workspaceId: string,
  candidateId: string,
  publishedById: string,
  repository: PublisherRepositoryPort,
  traceReceiptService?: TraceReceiptService,
): Promise<PublishedProcessResult> {

  try {
    return await repository.runInTransaction(db, async (tx) => {
      const candidate = await repository.getCandidateById(tx, candidateId);

      if (!candidate) {
        throw new CandidateNotFoundError();
      }

      if (candidate.workspaceId !== workspaceId) {
        throw new CandidateWorkspaceMismatchError();
      }

      if (candidate.status === "published") {
        throw new CandidateAlreadyPublishedError();
      }

      if (candidate.status !== "approved") {
        throw new InvalidCandidateTransitionError("Only approved candidates can be published");
      }

      if (!candidate.proposedDefinition || Object.keys(candidate.proposedDefinition).length === 0) {
        throw new InvalidProposedDefinitionError("Proposed definition cannot be empty");
      }

      if (!isBuilderDraft(candidate.proposedDefinition)) {
        throw new InvalidProposedDefinitionError("Proposed definition has an invalid structure");
      }

      const draft = candidate.proposedDefinition;
      const validationResult = validateBuilderDraft(draft);

      if (!validationResult.valid || draft.nodes.length === 0) {
        throw new InvalidProposedDefinitionError(
          "Proposed definition is invalid",
          validationResult.issues,
        );
      }

      const result = await repository.createProcessDefinition(tx, {
        workspaceId,
        draft,
        createdBy: publishedById,
        name: draft.name || candidate.name || "Processo sem nome",
        sourceCandidateId: candidateId,
      });


      const markedPublished = await repository.markCandidatePublished(tx, {
        workspaceId,
        candidateId,
        updatedAt: new Date(),
      });

      if (!markedPublished) {
        throw new CandidatePublicationConflictError();
      }

      // Generate Trace Receipt for publication
      const traceService = traceReceiptService || new TraceReceiptService(drizzleTraceReceiptRepository);

      await traceService.createAndAppendReceipt(tx as DbClient, {
        workspaceId,
        subject: {
          type: "process",
          id: result.processDefinitionId,
        },
        actor: {
          type: "user",
          id: publishedById,
        },
        action: {
          type: "publish",
          name: "Publish Process Candidate",
          result: "success",
        },
        source: {
          system: "system-builder",
          version: "1.0",
        },
        metadata: {
          processVersionId: result.processVersionId,
          sourceCandidateId: result.sourceCandidateId,
        }
      });

      return result;

    });
  } catch (error) {
    if (
      error instanceof CandidateNotFoundError ||
      error instanceof CandidateWorkspaceMismatchError ||
      error instanceof CandidateAlreadyPublishedError ||
      error instanceof InvalidCandidateTransitionError ||
      error instanceof InvalidProposedDefinitionError ||
      error instanceof CandidatePublicationConflictError
    ) {
      throw error;
    }

    if (isUniqueViolation(error)) {
      throw new CandidateAlreadyPublishedError();
    }

    throw new WorkflowPublicationFailedError("Failed to publish workflow definition", { cause: error });
  }
}
