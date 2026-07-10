import { getRuntimeDb } from "@/db";
import { events } from "@/db/runtime/schema/workflow";
import { enqueueEventForFlows, processFlowOutboxEvent } from "@/platform/outbox";
import type { WorkspaceContext } from "@/platform/workspace";
import type { EmittedEvent, EmitEventInput } from "./event-types";
import { EventWriter } from "./event-writer";

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
    id: row?.id || (input.payload?.idempotencyKey ? "skipped-id" : "unknown-id"),
    correlationId: context.correlationId,
  };

  const outboxEvent = await enqueueEventForFlows(emittedEvent, context);
  await processFlowOutboxEvent(outboxEvent.id, emittedEvent, context);

    const idempotencyKey = typeof input.payload?.idempotencyKey === "string" ? input.payload.idempotencyKey : undefined;

  const receipt = EventWriter.createReceipt(
    {
      id: row?.id || "skipped-id",
      workspaceId: context.workspaceId,
      eventType: input.eventType,
      entityType: input.entityType,
      actorId: context.actor.id || "system",
      occurredAt: new Date().toISOString(),
      schemaVersion: "1.0.0",
      correlationId: context.correlationId,
      idempotencyKey,
      payload: {},
    } as unknown as import("./canonical-contract").CanonicalEvent,
    "success"
  );

  (emittedEvent as EmittedEvent & { receipt?: import("./event-types").EventReceipt }).receipt = receipt;

  return emittedEvent;
}
