import { eq, and, desc } from "drizzle-orm";
import { events } from "@/db/runtime/schema/workflow";
import type { LogEventInput, EventRecord } from "./events.types";
import type { RuntimeDb } from "../runtime.repository";

export type EventDb = Pick<RuntimeDb, "insert" | "select">;

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
      payload: Object.keys(input.payload || {}).length ? input.payload : {},
    })
    .returning({ id: events.id });

  return record as unknown as EventRecord;
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

  return records as unknown as EventRecord[];
}
