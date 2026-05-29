import { getAction, runAction } from "@/platform/actions";
import { WorkflowRepository } from "../infra/workflow.repository";
import { ActionResult } from "../domain/types";

export class ActionExecutorService {
  private repository: WorkflowRepository;

  constructor() {
    this.repository = new WorkflowRepository();
  }

  async execute(params: {
    workspaceId: string;
    instanceId: string;
    actionKey: string;
    actorId?: string;
    input: Record<string, unknown>;
  }): Promise<ActionResult> {
    // 1. Resolve Kernel Action
    const kernelAction = getAction(params.actionKey);

    if (!kernelAction) {
      return {
        success: false,
        error: `Action implementation for key '${params.actionKey}' not found in Kernel.`
      };
    }

    try {
      // 2. Run the Kernel Action
      // We pass the workspaceId and actorId as context
      const result = await runAction(params.actionKey, params.input, {
        workspaceId: params.workspaceId,
        actorId: params.actorId,
      });

      return {
        success: result.success,
        message: result.message,
        payload: result.payload as Record<string, unknown>,
        error: result.error,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown action execution error",
      };
    }
  }
}
