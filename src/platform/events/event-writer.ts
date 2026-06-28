import { randomUUID } from "node:crypto";
import { getRuntimeDb, type DbClient } from "@/db";
import { events } from "@/db/runtime/schema/workflow";
import { eq, and, sql } from "drizzle-orm";
import {
  CanonicalEvent,
  CanonicalEventSchema,
} from "./canonical-contract";
import type { WorkspaceContext } from "@/platform/workspace/workspace-context";

type EventInput = Omit<CanonicalEvent, "id" | "workspaceId" | "actorId" | "occurredAt" | "schemaVersion">;

export class EventWriter {
  /**
   * Appends a single domain event to the log.
   * Ensuring workspace isolation and canonical structure.
   */
  static async appendDomainEvent(
    event: EventInput,
    context: WorkspaceContext,
  ): Promise<CanonicalEvent> {
    const db = getRuntimeDb();

    // Idempotency check if key provided (T06 feature)
    if (event.idempotencyKey) {
      const existing = await this.findExistingByIdempotencyKey(db, event.idempotencyKey, context.workspaceId);
      if (existing) return existing;
    }

    const canonical = this.prepareCanonicalEvent(event, context);

    await this.persistEvent(db, canonical, context.source);

    return canonical;
  }

  /**
   * Appends multiple domain events in a single transaction.
   * Ensuring atomicity: all or nothing.
   */
  static async appendDomainEventBatch(
    domainEvents: EventInput[],
    context: WorkspaceContext,
  ): Promise<CanonicalEvent[]> {
    if (domainEvents.length === 0) {
      throw new Error("Cannot append an empty batch of events.");
    }

    if (domainEvents.length > 100) {
      throw new Error(`Batch size exceeds limit of 100 events. Received: ${domainEvents.length}`);
    }

    const db = getRuntimeDb();

    return await db.transaction(async (tx: DbClient) => {
      const results: CanonicalEvent[] = [];

      let index = 0;
      for (const eventInput of domainEvents) {
        // Idempotency check if key provided (T06 feature)
        if (eventInput.idempotencyKey) {
          const existing = await this.findExistingByIdempotencyKey(tx, eventInput.idempotencyKey, context.workspaceId);
          if (existing) {
            results.push(existing);
            continue;
          }
        }

        const canonical = this.prepareCanonicalEvent(eventInput, context, index++);
        await this.persistEvent(tx, canonical, context.source);
        results.push(canonical);
      }

      return results;
    });
  }

  /**
   * Appends multiple domain events (Legacy/Sequential).
   * @deprecated Use appendDomainEventBatch for transactional atomicity.
   */
  static async appendDomainEvents(
    domainEvents: EventInput[],
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
      .orderBy(sql`${events.createdAt} DESC, ${events.id} DESC`);

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
      .orderBy(sql`${events.createdAt} DESC, ${events.id} DESC`)
      .limit(options.limit ?? 50)
      .offset(options.offset ?? 0);

    return rows.map(this.mapRowToCanonical);
  }

  private static prepareCanonicalEvent(
    event: EventInput,
    context: WorkspaceContext,
    batchIndex?: number
  ): CanonicalEvent {
    const canonical: CanonicalEvent = {
      ...event,
      id: randomUUID(),
      workspaceId: context.workspaceId,
      actorId: context.actor.id || "system",
      occurredAt: new Date().toISOString(),
      schemaVersion: "1.0.0",
      correlationId: context.correlationId || event.correlationId,
      metadata: {
        ...event.metadata,
        ...(batchIndex !== undefined ? { _batchIndex: batchIndex } : {}),
      },
    };

    // Validate against contract
    CanonicalEventSchema.parse(canonical);

    return canonical;
  }

  private static async persistEvent(db: DbClient | any, canonical: CanonicalEvent, source?: string): Promise<void> {
    await db.insert(events).values({
      id: canonical.id,
      workspaceId: canonical.workspaceId,
      eventType: canonical.eventType,
      entityType: canonical.entityType,
      entityId: canonical.entityId,
      actorId: canonical.actorId,
      correlationId: canonical.correlationId,
      causationId: canonical.causationId,
      source: source,
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
  }

  private static async findExistingByIdempotencyKey(db: DbClient | any, idempotencyKey: string, workspaceId: string): Promise<CanonicalEvent | null> {
    const existingRows = await db
      .select()
      .from(events)
      .where(
        and(
          eq(events.workspaceId, workspaceId),
          sql`${events.payload}->'_canonical'->>'idempotencyKey' = ${idempotencyKey}`
        )
      )
      .limit(1);

    if (existingRows.length > 0) {
      return this.mapRowToCanonical(existingRows[0]);
    }
    return null;
  }

  private static mapRowToCanonical(row: any): CanonicalEvent {
    const payload = row.payload || {};
    const canonicalMeta = payload._canonical || {};

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
