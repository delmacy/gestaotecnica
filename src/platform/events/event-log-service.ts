import { getDb } from "@/db";
import { eventLogs } from "@/db/schema";
import { runFlowsForEvent } from "@/platform/flows";
import type { WorkspaceContext } from "@/platform/workspace";
import type { EmittedEvent, EmitEventInput } from "./event-types";

function asUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value
    : undefined;
}

export async function emitEvent(
  input: EmitEventInput,
  context: WorkspaceContext,
): Promise<EmittedEvent> {
  const db = getDb();
  const [row] = await db
    .insert(eventLogs)
    .values({
      eventType: input.eventType,
      entityType: input.entityType,
      entityId: asUuid(input.entityId),
      actorId: context.actor.type === "user" ? asUuid(context.actor.id ?? "") : undefined,
      workItemId: input.entityType === "work_item" ? asUuid(input.entityId) : undefined,
      serviceOrderId: input.entityType === "service_order" ? asUuid(input.entityId) : undefined,
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
    .returning({ id: eventLogs.id });

  const emittedEvent = {
    ...input,
    id: row.id,
    correlationId: context.correlationId,
  };

  await runFlowsForEvent(emittedEvent, context);

  return emittedEvent;
}
