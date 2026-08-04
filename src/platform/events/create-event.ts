import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { getRuntimeDb } from "@/db";
import { resolveWorkspaceContext } from "@/platform/workspace";

type EventInput = {
  eventType: string;
  entityType: string;
  entityId: string;
  payload?: Record<string, unknown>;
};

export async function createEvent(input: EventInput) {
  const context = await resolveWorkspaceContext({ source: "system" });
  const workspaceId = context.workspaceId;

  const db = getRuntimeDb();

  const [event] = await db
    .insert(eventLogs)
    .values({
      eventType: input.eventType,
      entityType: input.entityType,
      entityId: input.entityId,
      payload: (input.payload ?? {}) as Record<string, unknown>,
      workspaceId,
    })
    .returning({ id: eventLogs.id });

  return event;
}
