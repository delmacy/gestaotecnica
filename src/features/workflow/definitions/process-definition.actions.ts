"use server";

import type { BuilderDraft } from "@/features/builder/types";
import {
  createProcessDefinitionServer,
  listProcessDefinitionsServer,
  getProcessDefinitionWithLatestVersionServer
} from "./process-definition.server";
import { mapBuilderDraftToCreateProcessDefinitionInput } from "./process-definition.mapper";
import { getPlatformDb } from "@/db";

export async function saveBuilderDraftAsProcessDefinitionAction(input: {
  workspaceId: string;
  draft: BuilderDraft;
  createdBy?: string;
}) {
  const db = getPlatformDb();
  if (!db) {
    return {
      ok: false as const,
      error: {
        code: "DB_NOT_CONFIGURED",
        message: "O cliente de banco de dados não está configurado para esta ação ainda.",
      },
    };
  }

  const mappedInput = mapBuilderDraftToCreateProcessDefinitionInput({
    workspaceId: input.workspaceId,
    draft: input.draft,
    createdBy: input.createdBy || "00000000-0000-0000-0000-000000000000",
  });

  return createProcessDefinitionServer(db, mappedInput);
}

export async function listProcessDefinitionsAction(input: {
  workspaceId: string;
  status?: "draft" | "published" | "archived";
  limit?: number;
  offset?: number;
}) {
  const db = getPlatformDb();
  if (!db) {
    return {
      ok: false as const,
      error: {
        code: "DB_NOT_CONFIGURED",
        message: "O cliente de banco de dados não está configurado para esta ação.",
      },
    };
  }

  return listProcessDefinitionsServer(db, input.workspaceId);
}

export async function getProcessDefinitionWithLatestVersionAction(input: {
  workspaceId: string;
  id: string;
}) {
  const db = getPlatformDb();
  if (!db) {
    return {
      ok: false as const,
      error: {
        code: "DB_NOT_CONFIGURED",
        message: "O cliente de banco de dados não está configurado para esta ação.",
      },
    };
  }

  if (!input.id) {
    return {
      ok: false as const,
      error: { code: "INVALID_INPUT", message: "ID do processo é obrigatório." }
    };
  }

  return getProcessDefinitionWithLatestVersionServer(db, input.workspaceId, input.id);
}
