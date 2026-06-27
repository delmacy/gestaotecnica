import { getRuntimeDb } from "@/db";
import { events } from "@/db/runtime/schema/workflow";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  CanonicalEvent,
  CanonicalEventSchema,
} from "./canonical-contract";
import type { WorkspaceContext } from "@/platform/workspace/workspace-context";

export class EventWriter {
  /**
   * Appends a single domain event to the log.
   * Ensuring workspace isolation and canonical structure.
   */
  static async appendDomainEvent(
    event: Omit<CanonicalEvent, "id" | "workspaceId" | "actorId" | "occurredAt" | "schemaVersion">,
    context: WorkspaceContext,
  ): Promise<CanonicalEvent> {
    const db = getRuntimeDb();

    // Idempotency check if key provided
    if (event.idempotencyKey) {
      const existingRows = await db
        .select()
        .from(events)
        .where(
          and(
            eq(events.workspaceId, context.workspaceId),
            sql`${events.payload}->'_canonical'->>'idempotencyKey' = ${event.idempotencyKey}`
          )
        )
        .limit(1);

      if (existingRows.length > 0) {
        return this.mapRowToCanonical(existingRows[0]);
      }
    }

    const canonical: CanonicalEvent = {
      ...event,
      id: crypto.randomUUID(),
      workspaceId: context.workspaceId,
      actorId: context.actor.id || "system",
      occurredAt: new Date().toISOString(),
      schemaVersion: "1.0.0",
      correlationId: context.correlationId || event.correlationId,
    };

    // Validate against contract
    CanonicalEventSchema.parse(canonical);

    await db.insert(events).values({
      id: canonical.id,
      workspaceId: canonical.workspaceId,
      eventType: canonical.eventType,
      entityType: canonical.entityType,
      entityId: canonical.entityId,
      actorId: canonical.actorId,
      correlationId: canonical.correlationId,
      causationId: canonical.causationId,
      source: context.source,
      payload: {
        ...canonical.payload,
        _canonical: {
          schemaVersion: canonical.schemaVersion,
          idempotencyKey: canonical.idempotencyKey,
          metadata: canonical.metadata,
          occurredAt: canonical.occurredAt,
        },
      },
    });

    return canonical;
  }

  /**
   * Appends multiple domain events.
   */
  static async appendDomainEvents(
    domainEvents: Omit<CanonicalEvent, "id" | "workspaceId" | "actorId" | "occurredAt" | "schemaVersion">[],
    context: WorkspaceContext,
  ): Promise<CanonicalEvent[]> {
    const results: CanonicalEvent[] = [];
    for (const event of domainEvents) {
      results.push(await this.appendDomainEvent(event, context));
    }
    return results;
  }

  /**
   * Retrieves history for a specific entity, strictly isolated by workspace.
   */
  static async getEntityHistory(
    entityType: string,
    entityId: string,
    context: WorkspaceContext,
  ): Promise<CanonicalEvent[]> {
    const db = getRuntimeDb();
    const rows = await db
      .select()
      .from(events)
      .where(
        and(
          eq(events.workspaceId, context.workspaceId),
          eq(events.entityType, entityType),
          eq(events.entityId, entityId),
        )
      )
      .orderBy(desc(events.createdAt));

    return rows.map(this.mapRowToCanonical);
  }

  /**
   * Retrieves event stream for a workspace with pagination.
   */
  static async getWorkspaceEventStream(
    context: WorkspaceContext,
    options: { limit?: number; offset?: number } = {},
  ): Promise<CanonicalEvent[]> {
    const db = getRuntimeDb();
    const rows = await db
      .select()
      .from(events)
      .where(eq(events.workspaceId, context.workspaceId))
      .orderBy(desc(events.createdAt))
      .limit(options.limit ?? 50)
      .offset(options.offset ?? 0);

    return rows.map(this.mapRowToCanonical);
  }

  private static mapRowToCanonical(row: any): CanonicalEvent {
    const payload = row.payload || {};
    const canonicalMeta = payload._canonical || {};

    // Remove _canonical from payload for the result
    const { _canonical, ...restPayload } = payload;

    return {
      id: row.id,
      workspaceId: row.workspaceId,
      eventType: row.eventType,
      entityType: row.entityType,
      entityId: row.entityId,
      actorId: row.actorId,
      occurredAt: canonicalMeta.occurredAt || (row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt),
      schemaVersion: canonicalMeta.schemaVersion || "1.0.0",
      correlationId: row.correlationId,
      causationId: row.causationId,
      idempotencyKey: canonicalMeta.idempotencyKey,
      payload: restPayload,
      metadata: canonicalMeta.metadata,
    };
  }
}
