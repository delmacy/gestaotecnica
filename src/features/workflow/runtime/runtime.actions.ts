"use server";

import { startProcessInstance } from "./runtime.service";
import { getRuntimeDb } from "@/db";

// Action Boundary encapsulating next.js server environment specifics

export async function startProcessInstanceAction(
  processVersionId: string,
  initialPayload: Record<string, any> = {}
) {
  try {
    // Mock tenant context as per project convention for early phases
    const workspaceId = "00000000-0000-0000-0000-000000000000";
    const userId = "11111111-1111-1111-1111-111111111111";

    const db = getRuntimeDb();

    // Call business logic passing context implicitly
    const result = await startProcessInstance(db as any, {
      workspaceId,
      processVersionId,
      createdById: userId || undefined,
      initialPayload
    });

    return result;

  } catch (_error) {
    return {
      ok: false,
      error: { code: "INTERNAL_ERROR", message: "Falha de Server Action ao iniciar a instância." }
    };
  }
}
