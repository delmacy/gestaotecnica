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
    .returning();

  return mapEventRow(record as NonNullable<RuntimeRepositoryRow>);
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

  return records
    .filter((row): row is NonNullable<RuntimeRepositoryRow> => row != null)
    .map(mapEventRow);
}

export function mapEventRow(row: null | undefined): null;
export function mapEventRow(row: NonNullable<RuntimeRepositoryRow>): EventRecord;
export function mapEventRow(row: RuntimeRepositoryRow): EventRecord | null {
  if (!row) return null;
  // Resolve keys prioritizing camelCase but falling back to snake_case gracefully
  const workspaceId = (row.workspaceId ?? row.workspace_id) as string;
  const instanceId = (row.instanceId ?? row.instance_id) as string | null;
  const eventType = (row.eventType ?? row.event_type) as string;
  const entityType = (row.entityType ?? row.entity_type) as string;
  const entityId = (row.entityId ?? row.entity_id) as string | null;
  const actorType = (row.actorType ?? row.actor_type) as string | null;
  const actorId = (row.actorId ?? row.actor_id) as string | null;
  const source = row.source as string | null;
  const correlationId = (row.correlationId ?? row.correlation_id) as string | null;
  const causationId = (row.causationId ?? row.causation_id) as string | null;
  const rawCreatedAt = row.createdAt ?? row.created_at;
  const createdAt = typeof rawCreatedAt === "string" ? new Date(rawCreatedAt) : (rawCreatedAt as Date);

  return {
    id: row.id as string,
    workspaceId,
    instanceId,
    eventType,
    entityType,
    entityId,
    actorType,
    actorId,
    source,
    correlationId,
    causationId,
    payload: (row.payload ?? {}) as Record<string, unknown>,
    createdAt,
  };
}
