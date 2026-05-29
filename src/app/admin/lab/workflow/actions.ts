"use server";

import { WorkflowEngineService } from "@/platform/workflow-engine/services/workflow-engine.service";
import { revalidatePath } from "next/cache";

export async function createLabInstance(workspaceId: string, versionId: string) {
  const engine = new WorkflowEngineService();
  await engine.createInstance({
    workspaceId,
    processVersionId: versionId,
  });
  revalidatePath("/admin/lab/workflow");
}

export async function executeLabAction(workspaceId: string, instanceId: string, actionKey: string, payload: unknown) {
  const engine = new WorkflowEngineService();
  const result = await engine.executeAction({
    workspaceId,
    instanceId,
    actionKey,
    inputPayload: payload as Record<string, unknown>,
  });
  revalidatePath("/admin/lab/workflow");
  return result;
}
