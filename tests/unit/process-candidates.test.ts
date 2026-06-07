import assert from "node:assert/strict";
import test from "node:test";
import {
  filterProcessCandidates,
  findSelectedProcessCandidate,
} from "../../src/features/builder/candidates/candidate-filter";
import { listCandidatesService } from "../../src/features/builder/candidates/candidates.service";
import type { CandidateRepositoryDb } from "../../src/features/builder/candidates/candidates.repository";
import type { ProcessCandidate } from "../../src/features/builder/candidates/candidate.types";

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
