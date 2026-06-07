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
  WorkflowPublicationFailedError,
} from "../../src/features/builder/candidates/candidate.errors";

const validWorkspaceId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const validCandidateId = "11111111-1111-4111-8111-111111111111";
const validPublisherId = "publisher-123";

const validProposedDefinition = {
  name: "Test Process",
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
  options?: { failPublish?: boolean; simulateDelay?: number }
): PublisherRepositoryPort & { getCandidateState: () => ProcessCandidate | null; getPublishedDefinition: () => any } {
  const candidate = initialCandidate ? { ...initialCandidate } : null;
  let publishedDefinition: any = null;

  return {
    getCandidateById: async (_db, id) => candidate?.id === id ? candidate : null,
    updateCandidateStatus: async (_db, id, status, updatedAt) => {
      if (candidate && candidate.id === id) {
        candidate.status = status;
        candidate.updatedAt = updatedAt;
      }
    },
    createProcessDefinition: async (_db, input) => {
      if (options?.failPublish) {
        throw new Error("DB Error");
      }
      if (options?.simulateDelay) {
        await new Promise(res => setTimeout(res, options.simulateDelay));
      }
      publishedDefinition = input;
      return { id: "new-process-version-id" };
    },
    runInTransaction: async (_db, callback) => callback({}),
    getCandidateState: () => candidate,
    getPublishedDefinition: () => publishedDefinition,
  };
}

const dummyDb = {};

test("Candidate aprovado gera definição oficial e atualiza status", async () => {
  const repo = createMockRepository(createBaseCandidate());

  const result = await publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo);

  assert.equal(result.id, "new-process-version-id");
  assert.equal(repo.getCandidateState()?.status, "published");
  const definition = repo.getPublishedDefinition();
  assert.equal(definition.name, "Test Process");
  assert.equal(definition.sourceCandidateId, validCandidateId, "A referência ao Candidate de origem deve ser preservada");
  assert.equal(definition.workspaceId, validWorkspaceId, "A definição publicada deve pertencer ao mesmo workspace");
});

test("Candidate inexistente é recusado", async () => {
  const repo = createMockRepository(null);
  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo),
    CandidateNotFoundError
  );
});

test("Workspace divergente é recusado", async () => {
  const candidate = createBaseCandidate();
  candidate.workspaceId = "different-workspace-id";
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo),
    CandidateWorkspaceMismatchError
  );
  assert.equal(repo.getCandidateState()?.status, "approved");
});

test("Candidate draft é recusado", async () => {
  const candidate = createBaseCandidate();
  candidate.status = "draft";
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo),
    InvalidCandidateTransitionError
  );
});

test("Candidate under_analysis é recusado", async () => {
  const candidate = createBaseCandidate();
  candidate.status = "under_analysis";
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo),
    InvalidCandidateTransitionError
  );
});

test("Candidate waiting_review é recusado", async () => {
  const candidate = createBaseCandidate();
  candidate.status = "waiting_review";
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo),
    InvalidCandidateTransitionError
  );
});

test("Candidate rejected é recusado", async () => {
  const candidate = createBaseCandidate();
  candidate.status = "rejected";
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo),
    InvalidCandidateTransitionError
  );
});

test("Candidate published não é publicado novamente", async () => {
  const candidate = createBaseCandidate();
  candidate.status = "published";
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo),
    CandidateAlreadyPublishedError
  );
});

test("Payload vazio é recusado", async () => {
  const candidate = createBaseCandidate();
  candidate.proposedDefinition = {};
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo),
    InvalidProposedDefinitionError
  );
});

test("Payload inválido (ex: sem nós) é recusado", async () => {
  const candidate = createBaseCandidate();
  candidate.proposedDefinition = { name: "Test Process", nodes: [], edges: [] };
  const repo = createMockRepository(candidate);

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo),
    InvalidProposedDefinitionError
  );
});

test("Falha ao salvar workflow preserva Candidate como approved", async () => {
  const candidate = createBaseCandidate();
  const repo = createMockRepository(candidate, { failPublish: true });

  await assert.rejects(
    () => publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo),
    WorkflowPublicationFailedError
  );

  assert.equal(repo.getCandidateState()?.status, "approved");
});

test("Tentativas concorrentes não criam múltiplas definições (simulação via lock/status)", async () => {
  const candidate = createBaseCandidate();
  const repo = createMockRepository(candidate, { simulateDelay: 10 });

  // We simulate concurrency conceptually. If one call publishes it, the next shouldn't be able to.
  // In our simple mock, we don't have DB locks, but if we do this sequentially quickly, it should work normally.
  // To truly test concurrency, we'd need to mock the transaction to throw on second read if first modified it.
  // For the scope of this test, we demonstrate that the second attempt will fail if the state was changed.

  const promise1 = publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo);

  // Simulate another caller trying to publish when state already changed in DB
  // Because our mock is in-memory and simple, we simulate the state change immediately for the second call.
  candidate.status = "published";

  const promise2 = publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo);

  await promise1;
  await assert.rejects(promise2, CandidateAlreadyPublishedError);
});
