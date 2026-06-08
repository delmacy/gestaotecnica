"use server";

import { getPlatformDb } from "@/db";
import { listCandidatesService } from "./candidates.service";
import type { ProcessCandidate } from "./candidate.types";

export async function getCandidatesAction(payload: {
  workspaceId?: string;
}): Promise<
  | { ok: true; data: ProcessCandidate[] }
  | { ok: false; error: { code: string; message: string } }
> {
  try {
    if (!payload.workspaceId || payload.workspaceId.trim() === "") {
      return {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "Workspace ID is required to fetch process candidates.",
        },
      };
    }

    const db = getPlatformDb();
    const data = await listCandidatesService(db, payload.workspaceId);

    return { ok: true, data };
  } catch {
    return {
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Não foi possível carregar os candidatos deste workspace.",
      },
    };
  }
}

import { approveCandidateService, rejectCandidateService } from "./candidates.service";
import type { AuthorizationPort, CandidateRepositoryPort } from "./candidates.service";
import { getCandidates, getCandidateById, updateCandidateStatus } from "./candidates.repository";

// Minimal Alpha Auth Port since we don't have a real one yet
const alphaAuthPort: AuthorizationPort = {
  async isHumanAndAuthorized(reviewerId: string, workspaceId: string): Promise<boolean> {
    return reviewerId !== undefined && reviewerId.trim() !== "";
  }
};

const repositoryAdapter: CandidateRepositoryPort = {
  getCandidateById,
  updateCandidateStatus,
};

export async function approveCandidateAction(payload: {
  workspaceId: string;
  candidateId: string;
  reviewerId: string;
  justification: string;
}) {
  try {
    const db = getPlatformDb();
    const data = await approveCandidateService(
      db,
      payload.workspaceId,
      payload.candidateId,
      payload.reviewerId,
      payload.justification,
      alphaAuthPort,
      repositoryAdapter
    );
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: { code: err.name || "INTERNAL_ERROR", message: err.message || "Failed to approve candidate" } };
  }
}

export async function rejectCandidateAction(payload: {
  workspaceId: string;
  candidateId: string;
  reviewerId: string;
  justification: string;
}) {
  try {
    const db = getPlatformDb();
    const data = await rejectCandidateService(
      db,
      payload.workspaceId,
      payload.candidateId,
      payload.reviewerId,
      payload.justification,
      alphaAuthPort,
      repositoryAdapter
    );
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: { code: err.name || "INTERNAL_ERROR", message: err.message || "Failed to reject candidate" } };
  }
}
