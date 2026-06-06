"use server";

import { startProcessInstance } from "./runtime.service";
import { advanceStep } from "./runtime-step.service";
import { getActiveActionExecutionForInstance } from "./runtime.repository";
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

export async function advanceStepAction(
  processInstanceId: string,
  outputPayload: Record<string, any> = {}
) {
  try {
    const workspaceId = "00000000-0000-0000-0000-000000000000";
    const userId = "11111111-1111-1111-1111-111111111111";

    const db = getRuntimeDb();

    // 1. Fetch current active step to know what we are advancing
    const activeStep = await getActiveActionExecutionForInstance(db as any, workspaceId, processInstanceId);

    if (!activeStep) {
      return {
        ok: false,
        error: { code: "NO_ACTIVE_STEP", message: "Nenhum passo ativo encontrado para esta instância." }
      };
    }

    // 2. Advance the step
    const result = await advanceStep(db as any, {
      workspaceId,
      processInstanceId,
      actionExecutionId: activeStep.id,
      actionKey: activeStep.actionKey,
      output: outputPayload,
      actorId: userId,
      status: "completed"
    });

    return result;

  } catch (_error) {
    return {
      ok: false,
      error: { code: "INTERNAL_ERROR", message: "Falha de Server Action ao avançar a instância." }
    };
  }
}
