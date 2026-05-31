import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { outboxEvents } from "@/db/schema";
import { runFlowsForEvent } from "@/platform/flows";
import { ProcessOrchestrator } from "@/platform/workflows/infra/process-orchestrator";
import { DynamicFlowRunner } from "@/platform/workflows/infra/flow-runner-service";
import type { EmittedEvent } from "@/platform/events";
import type { WorkspaceContext } from "@/platform/workspace";

function asUuid(value: string | undefined) {
  return value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value
    : undefined;
}

export async function enqueueEventForFlows(
  event: EmittedEvent,
  context: WorkspaceContext,
) {
  const db = getDb();
  const [outboxEvent] = await db
    .insert(outboxEvents)
    .values({
      workspaceId: asUuid(context.workspaceId),
      eventLogId: asUuid(event.id),
      topic: "platform.flows",
      status: "pending",
      payload: {
        event,
        workspace: {
          workspaceId: context.workspaceId,
          workspaceKey: context.workspaceKey,
          adaptationKey: context.adaptationKey,
          source: context.source,
          actor: context.actor,
          correlationId: context.correlationId,
        },
      },
    })
    .returning({ id: outboxEvents.id });

  return outboxEvent;
}

export async function processFlowOutboxEvent(
  outboxEventId: string,
  event: EmittedEvent,
  context: WorkspaceContext,
) {
  const db = getDb();

  await db
    .update(outboxEvents)
    .set({ status: "processing", attempts: 1 })
    .where(eq(outboxEvents.id, outboxEventId));

  try {
    // 1. Domain Processes (State Machine)
    const orchestrator = new ProcessOrchestrator();
    await orchestrator.handleEvent(event, context);

    // 2. Automations (Static Flows - Code)
    await runFlowsForEvent(event, context);

    // 3. Dynamic Automations (Builder Flows - JSON)
    const dynamicRunner = new DynamicFlowRunner();
    await dynamicRunner.runForEvent(event, context);

    await db
      .update(outboxEvents)
      .set({ status: "delivered", processedAt: new Date() })
      .where(eq(outboxEvents.id, outboxEventId));
  } catch (error) {
    await db
      .update(outboxEvents)
      .set({
        status: "failed",
        lastError: error instanceof Error ? error.message : "Falha ao processar outbox.",
      })
      .where(eq(outboxEvents.id, outboxEventId));
  }
}
