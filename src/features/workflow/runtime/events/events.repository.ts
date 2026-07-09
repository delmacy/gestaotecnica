import { eq, and, desc } from "drizzle-orm";
import { events } from "@/db/runtime/schema/workflow";
import type { LogEventInput, EventRecord } from "./events.types";
import type { RuntimeDb, RuntimeRepositoryRow } from "../runtime.repository";

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

export function mapEventRow(row: null | undefined): null;
export function mapEventRow(row: NonNullable<RuntimeRepositoryRow>): EventRecord;
export function mapEventRow(row: RuntimeRepositoryRow): EventRecord | null {
  if (!row) return null;
  return {
    id: row.id as string,
    workspaceId: (row.workspace_id ?? row.workspaceId) as string,
    instanceId: (row.instance_id ?? row.instanceId) as string | null,
    eventType: (row.event_type ?? row.eventType) as string,
    entityType: (row.entity_type ?? row.entityType) as string,
    entityId: (row.entity_id ?? row.entityId) as string | null,
    actorType: (row.actor_type ?? row.actorType) as string | null,
    actorId: (row.actor_id ?? row.actorId) as string | null,
    source: row.source as string | null,
    correlationId: (row.correlation_id ?? row.correlationId) as string | null,
    causationId: (row.causation_id ?? row.causationId) as string | null,
    payload: row.payload as Record<string, unknown>,
    createdAt: (row.created_at ?? row.createdAt) as Date,
  };
}
