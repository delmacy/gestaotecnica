import { eq, and, desc } from "drizzle-orm";
import { events } from "@/db/runtime/schema/workflow";
import type { LogEventInput, EventRecord } from "./events.types";

export type EventDb = {
  insert: any;
  select: any;
};

export async function logEvent(
  db: EventDb,
  input: LogEventInput
): Promise<EventRecord> {
  const [record] = await db
    .insert(events)
    .values({
      workspaceId: input.workspaceId,
      instanceId: input.instanceId,
      eventType: input.eventType,
      entityType: input.entityType,
      entityId: input.entityId,
      actorType: input.actorType,
      actorId: input.actorId,
      source: input.source,
      correlationId: input.correlationId,
      causationId: input.causationId,
      payload: input.payload ?? {},
    })
    .returning();

  return record as EventRecord;
}

export async function getEventsByInstanceId(
  db: EventDb,
  workspaceId: string,
  instanceId: string
): Promise<EventRecord[]> {
  const records = await db
    .select()
    .from(events)
    .where(
      and(
        eq(events.instanceId, instanceId),
        eq(events.workspaceId, workspaceId)
      )
    )
    .orderBy(desc(events.createdAt));

  return records as EventRecord[];
}
