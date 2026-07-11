
import { TraceReceiptService } from "../../src/features/platform/gateway/trace-receipt/trace-receipt.service";
import { test } from "node:test";
import assert from "node:assert/strict";
import { publishApprovedCandidate, type PublisherRepositoryPort } from "../../src/features/builder/candidates/candidate.publisher";
import type { ProcessCandidate } from "../../src/features/builder/candidates/candidate.types";
import {
  CandidateNotFoundError,
  CandidateWorkspaceMismatchError,
  InvalidCandidateTransitionError,
  InvalidProposedDefinitionError,
  CandidateAlreadyPublishedError,
  CandidatePublicationConflictError,
  WorkflowPublicationFailedError,
} from "../../src/features/builder/candidates/candidate.errors";
import type { CandidateRepositoryDb } from "../../src/features/builder/candidates/candidates.repository";

const validWorkspaceId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const validCandidateId = "11111111-1111-4111-8111-111111111111";
const validPublisherId = "publisher-123";

const validProposedDefinition = {
  name: "Test Process",
  status: "draft",
  nodes: [
    { id: "start", type: "start", position: { x: 0, y: 0 }, data: { blockType: "start", config: {} } },
    { id: "end", type: "end", position: { x: 100, y: 100 }, data: { blockType: "end", config: {} } },
  ],
  edges: [
    { id: "e1", source: "start", target: "end" }
  ],
};

const createBaseCandidate = (): ProcessCandidate => ({
  id: validCandidateId,
  workspaceId: validWorkspaceId,
  name: "Test Candidate",
  description: "Test description",
  status: "approved",
  origin: "agent",
  proposedDefinition: validProposedDefinition,
  evidence: {},
  createdById: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

function createMockRepository(
  initialCandidate: ProcessCandidate | null,
  options?: { failPublish?: boolean; failStatusUpdate?: boolean; uniqueViolation?: boolean }
): PublisherRepositoryPort & {
  getCandidateState: () => ProcessCandidate | null;
  getPublishedDefinition: () => Record<string, unknown> | null;
} {
  let candidate = initialCandidate ? { ...initialCandidate } : null;
  let publishedDefinition: Record<string, unknown> | null = null;

  return {
    getCandidateById: async (_db, id) => candidate?.id === id ? candidate : null,
    markCandidatePublished: async (_db, input) => {
      if (options?.failStatusUpdate) return false;
      if (
        candidate &&
        candidate.id === input.candidateId &&
        candidate.workspaceId === input.workspaceId &&
        candidate.status === "approved"
      ) {
        candidate.status = "published";
        candidate.updatedAt = input.updatedAt;
        return true;
      }
      return false;
    },
    createProcessDefinition: async (_db, input) => {
      if (options?.failPublish) {
        throw new Error("DB Error");
      }
      if (options?.uniqueViolation) {
        throw { code: "23505" };
      }
      publishedDefinition = input;
      return {
        processDefinitionId: "new-process-definition-id",
        processVersionId: "new-process-version-id",
        sourceCandidateId: input.sourceCandidateId,
      };
    },
    runInTransaction: async (_db, callback) => {
      const candidateSnapshot = candidate ? { ...candidate } : null;
      const definitionSnapshot = publishedDefinition;
      try {
        return await callback({} as CandidateRepositoryDb);
      } catch (error) {
        candidate = candidateSnapshot;
        publishedDefinition = definitionSnapshot;
        throw error;
      }
    },
    getCandidateState: () => candidate,
    getPublishedDefinition: () => publishedDefinition,
  };
}


const traceReceiptsGenerated: unknown[] = [];
const mockTraceReceiptService = {
  createAndAppendReceipt: async (db: unknown, input: unknown) => {
    traceReceiptsGenerated.push(input);
    return { id: "test-receipt-id" } as unknown;
  },
  getReceiptById: async () => null,
  getReceiptsByCorrelationId: async () => [],
} as unknown as TraceReceiptService;

const errorMockService = {
  createAndAppendReceipt: async () => { throw new Error("DB Error"); }
} as unknown as TraceReceiptService;

const dummyDb = {} as CandidateRepositoryDb;

test("Candidate aprovado gera definição oficial e atualiza status", async () => {
  const repo = createMockRepository(createBaseCandidate());

  const result = await publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo, mockTraceReceiptService);

  assert.equal(result.processVersionId, "new-process-version-id");
  assert.equal(result.sourceCandidateId, validCandidateId);
  assert.equal(repo.getCandidateState()?.status, "published");
  const definition = repo.getPublishedDefinition();
  assert.ok(definition !== null, "definition should not be null");
  assert.equal(definition.name, "Test Process");
  assert.equal(definition.sourceCandidateId, validCandidateId, "A referência ao Candidate de origem deve ser preservada");

  assert.equal(definition.workspaceId, validWorkspaceId, "A definição publicada deve pertencer ao mesmo workspace");
  assert.equal(traceReceiptsGenerated.length, 1);
  const generatedReceipt = traceReceiptsGenerated[0];
  assert.equal(generatedReceipt.subject.id, result.processDefinitionId);
  assert.equal(generatedReceipt.metadata.processVersionId, result.processVersionId);
  assert.equal(generatedReceipt.metadata.sourceCandidateId, result.sourceCandidateId);

});

test("Candidate inexistente é recusado", async () => {
  const repo = createMockRepository(null);
  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo, mockTraceReceiptService),
    CandidateNotFoundError
  );
});

test("Workspace divergente é recusado", async () => {
  const candidate = createBaseCandidate();
  candidate.workspaceId = "different-workspace-id";
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo, mockTraceReceiptService),
    CandidateWorkspaceMismatchError
  );
  assert.equal(repo.getCandidateState()?.status, "approved");
});

test("Candidate draft é recusado", async () => {
  const candidate = createBaseCandidate();
  candidate.status = "draft";
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo, mockTraceReceiptService),
    InvalidCandidateTransitionError
  );
});

test("Candidate under_analysis é recusado", async () => {
  const candidate = createBaseCandidate();
  candidate.status = "under_analysis";
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo, mockTraceReceiptService),
    InvalidCandidateTransitionError
  );
});

test("Candidate waiting_review é recusado", async () => {
  const candidate = createBaseCandidate();
  candidate.status = "waiting_review";
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo, mockTraceReceiptService),
    InvalidCandidateTransitionError
  );
});

test("Candidate rejected é recusado", async () => {
  const candidate = createBaseCandidate();
  candidate.status = "rejected";
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo, mockTraceReceiptService),
    InvalidCandidateTransitionError
  );
});

test("Candidate published não é publicado novamente", async () => {
  const candidate = createBaseCandidate();
  candidate.status = "published";
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo, mockTraceReceiptService),
    CandidateAlreadyPublishedError
  );
});

test("Payload vazio é recusado", async () => {
  const candidate = createBaseCandidate();
  candidate.proposedDefinition = {};
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo, mockTraceReceiptService),
    InvalidProposedDefinitionError
  );
});

test("Payload inválido (ex: sem nós) é recusado", async () => {
  const candidate = createBaseCandidate();
  candidate.proposedDefinition = { name: "Test Process", nodes: [], edges: [] };
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo, mockTraceReceiptService),
    InvalidProposedDefinitionError
  );
});

test("Falha ao salvar workflow preserva Candidate como approved", async () => {
  const candidate = createBaseCandidate();
  const repo = createMockRepository(candidate, { failPublish: true });

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo, mockTraceReceiptService),
    WorkflowPublicationFailedError
  );

  assert.equal(repo.getCandidateState()?.status, "approved");
  assert.equal(repo.getPublishedDefinition(), null);
});

test("Payload estruturalmente incompleto é recusado sem expor erro interno", async () => {
  const candidate = createBaseCandidate();
  candidate.proposedDefinition = { name: "Sem arrays", status: "draft" };
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo, mockTraceReceiptService),
    InvalidProposedDefinitionError,
  );
});

test("Falha ao atualizar status reverte a definição criada", async () => {
  const candidate = createBaseCandidate();
  const repo = createMockRepository(candidate, { failStatusUpdate: true });

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo, mockTraceReceiptService),
    CandidatePublicationConflictError,
  );

  assert.equal(repo.getCandidateState()?.status, "approved");
  assert.equal(repo.getPublishedDefinition(), null);
});

test("Violação única concorrente é traduzida para CandidateAlreadyPublishedError", async () => {
  const repo = createMockRepository(createBaseCandidate(), { uniqueViolation: true });

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo, mockTraceReceiptService),
    CandidateAlreadyPublishedError,
  );

  assert.equal(repo.getCandidateState()?.status, "approved");
  assert.equal(repo.getPublishedDefinition(), null);
});


test("Falha ao salvar trace receipt rejeita a operacao e da throw", async () => {
  const repo = createMockRepository(createBaseCandidate());

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo, errorMockService),
    (err: unknown) => {
      assert.strictEqual(err.message, "Failed to publish workflow definition");
      return true;
    }
  );

  // Verificacao de Rollback
  const currentState = repo.getCandidateState();
  assert.equal(currentState?.status, "approved", "Candidate deveria permanecer 'approved' apos rollback");
  const definition = repo.getPublishedDefinition();
  assert.equal(definition, null, "Definicao nao deveria ser persistida apos rollback");
});
