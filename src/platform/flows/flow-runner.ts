import { eq, and } from "drizzle-orm";
import { getRuntimeDb } from "@/db";
import { flowActionRuns, flowRuns } from "@/db/schema";
import { flowDefinitions } from "@/db/runtime/schema/workflow";
import { runAction } from "@/platform/actions";
import type { EmittedEvent } from "@/platform/events";
import type { WorkspaceContext } from "@/platform/workspace";
import { getFlowsByEvent } from "./flow-registry";

function asUuid(value: string | undefined) {
  return value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i.test(value)
    ? value
    : undefined;
}

export async function runFlowsForEvent(
  event: EmittedEvent,
  workspaceContext: WorkspaceContext,
) {
  const registeredFlows = getFlowsByEvent(event.eventType);
  const db = getRuntimeDb();

  // Load flows from database
  const dbFlows = await db
    .select()
    .from(flowDefinitions)
    .where(
      and(
        eq(flowDefinitions.workspaceId, workspaceContext.workspaceId),
        eq(flowDefinitions.status, "published"),
      ),
    );

  const flowsToRun = [...registeredFlows];

  for (const dbFlow of dbFlows) {
    const definition = dbFlow.definition as any;
    const triggerNode = definition.nodes?.find(
      (n: any) => n.data?.type === "event" && n.data?.label === event.eventType,
    );

    if (triggerNode) {
      flowsToRun.push({
        key: dbFlow.key,
        name: dbFlow.name,
        version: "1.0",
        trigger: { eventType: event.eventType },
        run: async ({ actions, event: ev }) => {
          // BFS or DFS to execute actions in sequence
          let currentNodes = definition.edges
            .filter((e: any) => e.source === triggerNode.id)
            .map((e: any) => definition.nodes.find((n: any) => n.id === e.target));

          while (currentNodes.length > 0) {
            const nextNodes = [];
            for (const node of currentNodes) {
              if (node.data?.type === "action") {
                // Pass event payload to the action
                await actions.run(node.data.label, ev.payload);
              }
              const children = definition.edges
                .filter((e: any) => e.source === node.id)
                .map((e: any) => definition.nodes.find((n: any) => n.id === e.target));
              nextNodes.push(...children);
            }
            currentNodes = nextNodes;
          }
        },
      } as any);
    }
  }

  for (const flow of flowsToRun) {
    let skipped = false;
    let skippedReason: string | undefined;
    const startedAt = new Date();
    const [flowRun] = await db
      .insert(flowRuns)
      .values({
        workspaceId: asUuid(workspaceContext.workspaceId),
        flowKey: flow.key,
        flowName: flow.name,
        flowVersion: flow.version,
        triggerEventId: asUuid(event.id),
        triggerEventType: event.eventType,
        status: "running",
        correlationId: workspaceContext.correlationId,
      })
      .returning({ id: flowRuns.id });

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
          run: async (actionKey, input) => {
            const actionStartedAt = new Date();
            const [flowActionRun] = await db
              .insert(flowActionRuns)
              .values({
                flowRunId: flowRun.id,
                actionKey,
                status: "running",
                inputPayload: input && typeof input === "object" ? input : { value: input },
              })
              .returning({ id: flowActionRuns.id });

            const result = await runAction(actionKey, input, {
              ...workspaceContext,
              source: "automation",
              actor: {
                type: "automation",
                id: flow.key,
                name: flow.name,
              },
            });

            const actionFinishedAt = new Date();
            await db
              .update(flowActionRuns)
              .set({
                status: result.success ? "succeeded" : "failed",
                outputPayload: result.success ? { data: result.data } : {},
                errorPayload: result.error,
                finishedAt: actionFinishedAt,
                durationMs: actionFinishedAt.getTime() - actionStartedAt.getTime(),
              })
              .where(eq(flowActionRuns.id, flowActionRun.id));

            return result;
          },
        },
        logger,
        skip: (reason) => {
          skipped = true;
          skippedReason = reason;
          logger.info(`Skipped: ${reason}`);
        },
      });

      const finishedAt = new Date();
      await db
        .update(flowRuns)
        .set({
          status: skipped ? "skipped" : "succeeded",
          skippedReason,
          finishedAt,
          durationMs: finishedAt.getTime() - startedAt.getTime(),
        })
        .where(eq(flowRuns.id, flowRun.id));

      if (!skipped) logger.info("Flow executado com sucesso.");
    } catch (error) {
      const finishedAt = new Date();
      await db
        .update(flowRuns)
        .set({
          status: "failed",
          errorPayload: {
            message: error instanceof Error ? error.message : "Falha ao executar flow.",
          },
          finishedAt,
          durationMs: finishedAt.getTime() - startedAt.getTime(),
        })
        .where(eq(flowRuns.id, flowRun.id));

      logger.error("Falha ao executar flow.", error);
    }
  }
}
