import { getRuntimeDb } from "@/db";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { eq, and, desc } from "drizzle-orm";
import type { WorkspaceContext } from "@/platform/workspace";
import { canonicalEventSchema, type EmitCanonicalEventInput, type CanonicalEvent } from "./canonical-contract";
import { emitEvent } from "./event-log-service";

/**
 * Appends a single domain event to the event store after validating it against the canonical contract.
 */
export async function appendDomainEvent(
  input: EmitCanonicalEventInput,
  context: WorkspaceContext,
): Promise<CanonicalEvent> {
  // 1. Enforce Workspace Isolation
  if (input.workspaceId !== context.workspaceId) {
    throw new Error(`Workspace isolation violation: event workspace ${input.workspaceId} does not match context ${context.workspaceId}`);
  }

  // 2. Validate against Canonical Contract
  const validatedInput = canonicalEventSchema.omit({ id: true, occurredAt: true }).parse(input);

  // 3. Emit via Platform Service (which handles outbox and flows)
  const emitted = await emitEvent({
    eventType: validatedInput.eventType,
    entityType: validatedInput.entityType,
    entityId: validatedInput.entityId,
    payload: {
      ...validatedInput.payload,
      _canonical: {
        schemaVersion: validatedInput.schemaVersion,
        metadata: validatedInput.metadata || {},
      }
    },
    causationId: validatedInput.causationId,
  }, context);

  return {
    ...validatedInput,
    id: emitted.id!,
    occurredAt: new Date(),
    correlationId: emitted.correlationId,
    metadata: validatedInput.metadata || {},
  };
}

/**
 * Appends multiple domain events in sequence.
 */
export async function appendDomainEvents(
  inputs: EmitCanonicalEventInput[],
  context: WorkspaceContext,
): Promise<CanonicalEvent[]> {
  const results: CanonicalEvent[] = [];
  for (const input of inputs) {
    results.push(await appendDomainEvent(input, context));
  }
  return results;
}

function mapRowToCanonical(row: any): CanonicalEvent {
  return {
    id: row.id,
    workspaceId: row.workspaceId!,
    eventType: row.eventType,
    entityType: row.entityType,
    entityId: row.entityId!,
    actorId: row.actorId ?? undefined,
    occurredAt: row.createdAt,
    schemaVersion: (row.payload as any)?._canonical?.schemaVersion ?? "1.0",
    correlationId: row.correlationId ?? undefined,
    causationId: row.causationId ?? undefined,
    payload: row.payload as any,
    metadata: (row.payload as any)?._canonical?.metadata ?? {},
  };
}

/**
 * Retrieves history for a specific entity, ensuring tenant isolation.
 */
export async function getEntityHistory(
  entityType: string,
  entityId: string,
  context: WorkspaceContext,
): Promise<CanonicalEvent[]> {
  const db = getRuntimeDb();

  const results = await db
    .select()
    .from(eventLogs)
    .where(
      and(
        eq(eventLogs.workspaceId, context.workspaceId),
        eq(eventLogs.entityType, entityType),
        eq(eventLogs.entityId, entityId)
      )
    )
    .orderBy(desc(eventLogs.createdAt));

  return results.map(mapRowToCanonical);
}

/**
 * Retrieves a stream of events for the entire workspace.
 */
export async function getWorkspaceEventStream(
  context: WorkspaceContext,
  limit = 100,
): Promise<CanonicalEvent[]> {
  const db = getRuntimeDb();

  const results = await db
    .select()
    .from(eventLogs)
    .where(eq(eventLogs.workspaceId, context.workspaceId))
    .orderBy(desc(eventLogs.createdAt))
    .limit(limit);

  return results.map(mapRowToCanonical);
}

/**
 * Asserts that an event belongs to the current workspace.
 */
export async function assertEventOwnership(
  eventId: string,
  context: WorkspaceContext,
): Promise<void> {
  const db = getRuntimeDb();

  const [event] = await db
    .select({ workspaceId: eventLogs.workspaceId })
    .from(eventLogs)
    .where(and(eq(eventLogs.id, eventId), eq(eventLogs.workspaceId, context.workspaceId)))
    .limit(1);

  if (!event) {
    throw new Error(`Event ${eventId} not found or access denied.`);
  }
}
