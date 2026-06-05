"use server";

import { getPlatformDb } from "@/db";
import { publishProcessVersionServer } from "./process-definition-publication.server";
import type { PublishProcessVersionInput } from "./process-definition-publication.types";

export async function publishProcessVersionAction(input: PublishProcessVersionInput) {
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

  return publishProcessVersionServer(db, input);
}
