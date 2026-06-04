"use server";

import type { BuilderDraft } from "@/features/builder/types";
import { createProcessDefinitionServer } from "./process-definition.server";
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

  const systemUserId = input.createdBy || "00000000-0000-0000-0000-000000000000";

  const mappedInput = mapBuilderDraftToCreateProcessDefinitionInput(input);
  return createProcessDefinitionServer(db, mappedInput, systemUserId);
}
