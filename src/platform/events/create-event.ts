import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { getRuntimeDb } from "@/db";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { buildEventPayload, CreateEventInputSchema, type CreateEventInput } from "./create-event-contract";

type EventInput = CreateEventInput;

export async function createEvent(input: EventInput) {
  const parsed = CreateEventInputSchema.parse(input);

  const context = await resolveWorkspaceContext({ source: "system" });
  const workspaceId = context.workspaceId;

  const db = getRuntimeDb();

  const [event] = await db
    .insert(eventLogs)
    .values({
      eventType: parsed.eventType,
      entityType: parsed.entityType,
      entityId: parsed.entityId,
      payload: buildEventPayload(parsed.payload),
      workspaceId,
    })
    .returning({ id: eventLogs.id });

  return event;
}
