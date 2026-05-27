import { runAction } from "@/platform/actions";
import type { EmittedEvent } from "@/platform/events";
import type { WorkspaceContext } from "@/platform/workspace";
import { getFlowsByEvent } from "./flow-registry";

export async function runFlowsForEvent(
  event: EmittedEvent,
  workspaceContext: WorkspaceContext,
) {
  const flows = getFlowsByEvent(event.eventType);

  for (const flow of flows) {
    let skipped = false;
    const logger = {
      info: (message: string, meta?: unknown) => console.info(`[flow:${flow.key}] ${message}`, meta ?? ""),
      warn: (message: string, meta?: unknown) => console.warn(`[flow:${flow.key}] ${message}`, meta ?? ""),
      error: (message: string, meta?: unknown) => console.error(`[flow:${flow.key}] ${message}`, meta ?? ""),
    };

    try {
      await flow.run({
        workspace: workspaceContext,
        event,
        actions: {
          run: (actionKey, input) =>
            runAction(actionKey, input, {
              ...workspaceContext,
              source: "automation",
              actor: {
                type: "automation",
                id: flow.key,
                name: flow.name,
              },
            }),
        },
        logger,
        skip: (reason) => {
          skipped = true;
          logger.info(`Skipped: ${reason}`);
        },
      });

      if (!skipped) logger.info("Flow executado com sucesso.");
    } catch (error) {
      logger.error("Falha ao executar flow.", error);
    }
  }
}
