import { getRuntimeDb } from "@/db";
import { events } from "@/db/runtime/schema/workflow";
import { enqueueEventForFlows, processFlowOutboxEvent } from "@/platform/outbox";
import type { WorkspaceContext } from "@/platform/workspace";
import { EventReceiptSchema, type EventReceipt, type EmittedEvent, type EmitEventInput } from "./event-types";

function asUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value
    : undefined;
}

export async function emitEvent(
  input: EmitEventInput,
  context: WorkspaceContext,
): Promise<EmittedEvent> {
  const db = getRuntimeDb();
  const [row] = await db
    .insert(events)
    .values({
      workspaceId: asUuid(context.workspaceId),
      eventType: input.eventType,
      entityType: input.entityType,
      entityId: asUuid(input.entityId),
      actorType: context.actor.type,
      actorId: context.actor.type === "user" ? asUuid(context.actor.id ?? "") : undefined,
      source: context.source,
      correlationId: context.correlationId,
      causationId: input.causationId,
                        payload: {
        ...(input.payload ?? {}),
        platform: {
          workspaceId: context.workspaceId,
          workspaceKey: context.workspaceKey,
          adaptationKey: context.adaptationKey,
          actorType: context.actor.type,
          actorId: context.actor.id,
          source: context.source,
          correlationId: context.correlationId,
          causationId: input.causationId,
        },
      },
    })
    .returning({ id: events.id });

  const emittedEvent = {
    ...input,
    id: row.id,
    correlationId: context.correlationId,
  };

  const outboxEvent = await enqueueEventForFlows(emittedEvent, context);
  await processFlowOutboxEvent(outboxEvent.id, emittedEvent, context);

  return emittedEvent;
}

export function createReceipt(
  event: EmittedEvent,
  status: "success" | "error" | "skipped",
  options?: { processorId?: string; error?: string; idempotencyKey?: string }
): EventReceipt {
  const receipt = {
    eventId: event.id ?? "unknown",
    processorId: options?.processorId,
    processedAt: new Date().toISOString(),
    status,
    correlationId: event.correlationId,
    idempotencyKey: options?.idempotencyKey,
    error: options?.error,
  };

  return EventReceiptSchema.parse(receipt);
}
