import { getAction, runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";
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
      const context = await resolveWorkspaceContext({
        workspaceId: params.workspaceId,
        actor: {
          type: params.actorId ? "user" : "system",
          id: params.actorId,
        },
        source: "system",
      });

      // 2. Run the Kernel Action with the resolved workspace context.
      const result = await runAction(params.actionKey, params.input, context);

      return {
        success: result.success,
        payload: result.data as Record<string, unknown>,
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
