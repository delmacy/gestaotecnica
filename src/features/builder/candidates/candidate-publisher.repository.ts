import { and, eq } from "drizzle-orm";
import { processCandidates } from "@/db/platform/schema/candidates";
import { processDefinitions, processVersions } from "@/db/runtime/schema/workflow";
import { serializeBuilderDraft } from "../process-editor/serialize-builder-draft";
import type { BuilderDraft } from "../types";
import type { CandidateRepositoryDb } from "./candidates.repository";
import type { ProcessCandidate } from "./candidate.types";
import type {
  CreatePublishedProcessInput,
  PublishedProcessResult,
  PublisherRepositoryPort,
} from "./candidate.publisher";
import { publishApprovedCandidate } from "./candidate.publisher";

type CandidateRecord = typeof processCandidates.$inferSelect;

function mapCandidate(record: CandidateRecord): ProcessCandidate {
  return {
    id: record.id,
    workspaceId: record.workspaceId,
    name: record.name,
    description: record.description,
    status: record.status as ProcessCandidate["status"],
    origin: record.origin as ProcessCandidate["origin"],
    proposedDefinition: (record.proposedDefinition as Record<string, unknown>) ?? {},
    evidence: (record.evidence as Record<string, unknown>) ?? {},
    createdById: record.createdById,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export const drizzleCandidatePublisherRepository: PublisherRepositoryPort = {
  async getCandidateById(db: CandidateRepositoryDb, candidateId: string) {
    const [record] = await db
      .select()
      .from(processCandidates)
      .where(eq(processCandidates.id, candidateId))
      .limit(1);

    return record ? mapCandidate(record as CandidateRecord) : null;
  },

  async createProcessDefinition(
    db: CandidateRepositoryDb,
    input: CreatePublishedProcessInput,
  ): Promise<PublishedProcessResult> {
    const [definition] = await db
      .insert(processDefinitions)
      .values({
        workspaceId: input.workspaceId,
        key: `candidate-${input.sourceCandidateId}`,
        name: input.name,
        description: input.draft.description ?? null,
        sourceCandidateId: input.sourceCandidateId,
        createdById: input.createdBy,
        isActive: "true",
      })
      .returning();

    const [version] = await db
      .insert(processVersions)
      .values({
        processDefinitionId: definition.id,
        version: 1,
        status: "published",
        definition: serializeBuilderDraft(input.draft as BuilderDraft),
      })
      .returning();

    return {
      processDefinitionId: definition.id,
      processVersionId: version.id,
      sourceCandidateId: definition.sourceCandidateId,
    };
  },

  async markCandidatePublished(
    db: CandidateRepositoryDb,
    input: { workspaceId: string; candidateId: string; updatedAt: Date },
  ) {
    const records = await db
      .update(processCandidates)
      .set({ status: "published", updatedAt: input.updatedAt })
      .where(
        and(
          eq(processCandidates.id, input.candidateId),
          eq(processCandidates.workspaceId, input.workspaceId),
          eq(processCandidates.status, "approved"),
        ),
      )
      .returning({ id: processCandidates.id });

    return records.length === 1;
  },

  runInTransaction<T>(
    db: CandidateRepositoryDb,
    callback: (tx: CandidateRepositoryDb) => Promise<T>,
  ): Promise<T> {
    return db.transaction(callback);
  },
};

export function publishApprovedCandidateWithDrizzle(
  db: CandidateRepositoryDb,
  workspaceId: string,
  candidateId: string,
  publishedById: string,
) {
  return publishApprovedCandidate(
    db,
    workspaceId,
    candidateId,
    publishedById,
    drizzleCandidatePublisherRepository,
  );
}
