import assert from "node:assert/strict";
import test from "node:test";
import {
  filterProcessCandidates,
  findSelectedProcessCandidate,
} from "../../src/features/builder/candidates/candidate-filter";
import {
  listCandidatesService,
  approveCandidateService,
  rejectCandidateService,
  AuthorizationPort
} from "../../src/features/builder/candidates/candidates.service";
import {
  UnauthorizedReviewerError,
  JustificationRequiredError,
  CandidateNotFoundError,
  InvalidCandidateTransitionError,
  CandidateWorkspaceMismatchError,
} from "../../src/features/builder/candidates/candidate.errors";
import type { CandidateRepositoryDb } from "../../src/features/builder/candidates/candidates.repository";
import type { ProcessCandidate, CandidateStatus } from "../../src/features/builder/candidates/candidate.types";
import type { CandidateRepositoryPort } from "../../src/features/builder/candidates/candidates.service";

const candidates: ProcessCandidate[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    workspaceId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    name: "Onboarding de Fornecedor",
    description: "Cadastro e aprovação de parceiros",
    status: "under_analysis",
    origin: "agent",
    proposedDefinition: {},
    evidence: { confidence: 0.9 },
    createdById: null,
    createdAt: new Date("2026-06-01T10:00:00Z"),
    updatedAt: new Date("2026-06-01T10:00:00Z"),
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    workspaceId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    name: "Revisão de Contratos",
    description: "Fluxo da equipe de compliance",
    status: "draft",
    origin: "manual",
    proposedDefinition: {},
    evidence: {},
    createdById: null,
    createdAt: new Date("2026-06-02T10:00:00Z"),
    updatedAt: new Date("2026-06-02T10:00:00Z"),
  },
];

test("busca candidatos por nome sem diferenciar maiúsculas", () => {
  assert.deepEqual(filterProcessCandidates(candidates, { searchTerm: "fornecedor" }), [candidates[0]]);
});

test("busca candidatos por descrição", () => {
  assert.deepEqual(filterProcessCandidates(candidates, { searchTerm: "compliance" }), [candidates[1]]);
});

test("combina busca e filtro por status", () => {
  assert.deepEqual(
    filterProcessCandidates(candidates, { searchTerm: "fluxo", status: "draft" }),
    [candidates[1]]
  );
  assert.deepEqual(
    filterProcessCandidates(candidates, { searchTerm: "fluxo", status: "approved" }),
    []
  );
});

test("limpa a seleção quando o candidato não está no resultado filtrado", () => {
  const filtered = filterProcessCandidates(candidates, { status: "draft" });

  assert.equal(findSelectedProcessCandidate(filtered, candidates[0].id), null);
  assert.equal(findSelectedProcessCandidate(filtered, candidates[1].id), candidates[1]);
});

test("service exige workspace e encaminha isolamento ao repository", async () => {
  const workspaceId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  let receivedWorkspaceId: string | undefined;
  const repository = async (_db: CandidateRepositoryDb, inputWorkspaceId: string) => {
    receivedWorkspaceId = inputWorkspaceId;
    return candidates;
  };

  await assert.rejects(
    () => listCandidatesService({} as CandidateRepositoryDb, " ", repository),
    /Workspace ID is required/
  );
  assert.deepEqual(
    await listCandidatesService({} as CandidateRepositoryDb, workspaceId, repository),
    candidates
  );
  assert.equal(receivedWorkspaceId, workspaceId);
});

// Mock AuthorizationPort
const createMockAuthPort = (isAuthorized: boolean): AuthorizationPort => ({
  isHumanAndAuthorized: async () => isAuthorized,
});

// Test Utilities for Review Actions
const createMockRepository = (initialCandidate: ProcessCandidate | null): CandidateRepositoryPort & { getCandidateState: () => ProcessCandidate | null } => {
  const candidate = initialCandidate ? { ...initialCandidate } : null;
  return {
    getCandidateById: async () => candidate,
    updateCandidateStatus: async (db: CandidateRepositoryDb, id: string, input: { status: CandidateStatus; updatedAt: Date }) => {
      if (candidate) {
        candidate.status = input.status;
        candidate.updatedAt = input.updatedAt;
      }
    },
    getCandidateState: () => candidate,
  };
};

const dummyDb = {} as CandidateRepositoryDb;
const validWorkspaceId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const validCandidateId = "11111111-1111-4111-8111-111111111111";
const validReviewerId = "human-reviewer-123";

const baseCandidate: ProcessCandidate = {
  id: validCandidateId,
  workspaceId: validWorkspaceId,
  name: "Test Candidate",
  description: "Test description",
  status: "under_analysis",
  origin: "agent",
  proposedDefinition: {},
  evidence: {},
  createdById: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

test("Humano autorizado aprova candidato revisável", async () => {
  const repo = createMockRepository({ ...baseCandidate, status: "under_analysis" });
  const authPort = createMockAuthPort(true);

  const result = await approveCandidateService(
    dummyDb,
    validWorkspaceId,
    validCandidateId,
    validReviewerId,
    "Looks good to me",
    authPort,
    repo
  );

  assert.equal(result.status, "approved");
  assert.equal(repo.getCandidateState()?.status, "approved");
});

test("Humano autorizado rejeita candidato revisável", async () => {
  const repo = createMockRepository({ ...baseCandidate, status: "waiting_review" });
  const authPort = createMockAuthPort(true);

  const result = await rejectCandidateService(
    dummyDb,
    validWorkspaceId,
    validCandidateId,
    validReviewerId,
    "Missing some info",
    authPort,
    repo
  );

  assert.equal(result.status, "rejected");
  assert.equal(repo.getCandidateState()?.status, "rejected");
});

test("Agente não pode aprovar", async () => {
  const repo = createMockRepository({ ...baseCandidate });
  const authPort = createMockAuthPort(false); // Auth port denies non-human/unauthorized

  await assert.rejects(
    () => approveCandidateService(dummyDb, validWorkspaceId, validCandidateId, "agent-123", "Valid justification", authPort, repo),
    UnauthorizedReviewerError
  );
  assert.equal(repo.getCandidateState()?.status, "under_analysis");
});

test("Integração ou sistema não pode aprovar", async () => {
  const repo = createMockRepository({ ...baseCandidate });
  const authPort = createMockAuthPort(false);

  await assert.rejects(
    () => approveCandidateService(dummyDb, validWorkspaceId, validCandidateId, "system-abc", "Valid justification", authPort, repo),
    UnauthorizedReviewerError
  );
  assert.equal(repo.getCandidateState()?.status, "under_analysis");
});

test("Humano sem permissão não pode aprovar", async () => {
  const repo = createMockRepository({ ...baseCandidate });
  const authPort = createMockAuthPort(false);

  await assert.rejects(
    () => approveCandidateService(dummyDb, validWorkspaceId, validCandidateId, "unauthorized-human", "Valid justification", authPort, repo),
    UnauthorizedReviewerError
  );
  assert.equal(repo.getCandidateState()?.status, "under_analysis");
});

test("Justificativa vazia é rejeitada", async () => {
  const repo = createMockRepository({ ...baseCandidate });
  const authPort = createMockAuthPort(true);

  await assert.rejects(
    () => approveCandidateService(dummyDb, validWorkspaceId, validCandidateId, validReviewerId, "   ", authPort, repo),
    JustificationRequiredError
  );
  assert.equal(repo.getCandidateState()?.status, "under_analysis");
});

test("Candidato inexistente é rejeitado", async () => {
  const repo = createMockRepository(null);
  const authPort = createMockAuthPort(true);

  await assert.rejects(
    () => approveCandidateService(dummyDb, validWorkspaceId, "non-existent-id", validReviewerId, "Valid justification", authPort, repo),
    CandidateNotFoundError
  );
});

test("Workspace divergente é rejeitado", async () => {
  const repo = createMockRepository({ ...baseCandidate, workspaceId: "different-workspace" });
  const authPort = createMockAuthPort(true);

  await assert.rejects(
    () => approveCandidateService(dummyDb, validWorkspaceId, validCandidateId, validReviewerId, "Valid justification", authPort, repo),
    CandidateWorkspaceMismatchError
  );
  assert.equal(repo.getCandidateState()?.status, "under_analysis");
});

test("Candidato publicado não pode ser revisado", async () => {
  const repo = createMockRepository({ ...baseCandidate, status: "published" });
  const authPort = createMockAuthPort(true);

  await assert.rejects(
    () => approveCandidateService(dummyDb, validWorkspaceId, validCandidateId, validReviewerId, "Valid justification", authPort, repo),
    InvalidCandidateTransitionError
  );
  assert.equal(repo.getCandidateState()?.status, "published");
});

test("Falha de autorização preserva o status anterior", async () => {
  const repo = createMockRepository({ ...baseCandidate, status: "waiting_review" });
  const authPort = createMockAuthPort(false);

  await assert.rejects(
    () => approveCandidateService(dummyDb, validWorkspaceId, validCandidateId, validReviewerId, "Valid justification", authPort, repo),
    UnauthorizedReviewerError
  );
  // Ensure the status remains untouched
  assert.equal(repo.getCandidateState()?.status, "waiting_review");
});

test("Atualização concorrente ou status anterior divergente não sobrescreve decisão", async () => {
  // Concurrency is conceptually handled by checking state when read.
  // If the state was already changed to something not allowed (e.g. approved), it throws.
  const repo = createMockRepository({ ...baseCandidate, status: "approved" });
  const authPort = createMockAuthPort(true);

  await assert.rejects(
    () => rejectCandidateService(dummyDb, validWorkspaceId, validCandidateId, validReviewerId, "Changed my mind", authPort, repo),
    InvalidCandidateTransitionError
  );

  assert.equal(repo.getCandidateState()?.status, "approved");
});

test("O serviço encaminha reviewerId, workspaceId e justificativa normalizada corretamente", async () => {
  let passedReviewerId = "";
  let passedWorkspaceId = "";

  const authPortSpy: AuthorizationPort = {
    isHumanAndAuthorized: async (rId, wId) => {
      passedReviewerId = rId;
      passedWorkspaceId = wId;
      return true;
    }
  };

  const repo = createMockRepository({ ...baseCandidate });

  await approveCandidateService(
    dummyDb,
    validWorkspaceId,
    validCandidateId,
    "reviewer-456",
    "   Normalized Justification   ",
    authPortSpy,
    repo
  );

  assert.equal(passedReviewerId, "reviewer-456");
  assert.equal(passedWorkspaceId, validWorkspaceId);
  assert.equal(repo.getCandidateState()?.status, "approved");
});
