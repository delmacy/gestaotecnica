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
