import { randomUUID } from "node:crypto";
import { getRuntimeDb, type DbClient } from "@/db";
import { events } from "@/db/runtime/schema/workflow";
import { eq, and, sql } from "drizzle-orm";
import {
  CanonicalEvent,
  CanonicalEventSchema,
} from "./canonical-contract";
import type { WorkspaceContext } from "@/platform/workspace/workspace-context";
import { EventStoreError } from "./errors/event-errors";

export type AppendEventResult =
  | {
      status: "created";
      event: CanonicalEvent;
    }
  | {
      status: "existing";
      event: CanonicalEvent;
    };

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isValidUuid = (id: unknown): id is string => typeof id === "string" && UUID_REGEX.test(id);

type EventInput = Omit<CanonicalEvent, "id" | "workspaceId" | "actorId" | "occurredAt" | "schemaVersion">;

export class EventWriter {
  /**
   * Appends a single domain event to the log.
   * Ensuring workspace isolation and canonical structure.
   * Guarantees idempotency via database constraints.
   */
  static async appendDomainEvent(
    event: EventInput,
    context: WorkspaceContext,
  ): Promise<CanonicalEvent> {
    const result = await this.appendDomainEventInternal(event, context);
    return result.event;
  }

  /**
   * Internal version that returns detailed status.
   */
  static async appendDomainEventInternal(
    event: EventInput,
    context: WorkspaceContext,
  ): Promise<AppendEventResult> {
    const db = getRuntimeDb();
    return this.persistSingleEvent(db, event, context);
  }

  /**
   * Appends multiple domain events in a single transaction.
   * Ensuring atomicity: all or nothing.
   */
  static async appendDomainEventBatch(
    domainEvents: EventInput[],
    context: WorkspaceContext,
  ): Promise<CanonicalEvent[]> {
    if (!domainEvents || domainEvents.length === 0) {
      throw new EventStoreError("EMPTY_BATCH", "Cannot append an empty batch of events.");
    }

    if (domainEvents.length > 100) {
      throw new EventStoreError("BATCH_LIMIT_EXCEEDED", `Batch size exceeds limit of 100 events. Received: ${domainEvents.length}`);
    }

    const db = getRuntimeDb();

    try {
      return await db.transaction(async (tx: DbClient) => {
        const results: CanonicalEvent[] = [];

        let index = 0;
        for (const eventInput of domainEvents) {
          const result = await this.persistSingleEvent(tx, eventInput, context, index++);
          results.push(result.event);
        }

        return results;
      });
    } catch (error) {
      if (error instanceof EventStoreError || (error as any).name === "ZodError") throw error;
      throw new EventStoreError("TRANSACTION_FAILURE", "Failed to persist event batch due to transaction error.", error);
    }
  }

  /**
   * Appends multiple domain events (Sequential).
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
          isValidUuid(entityId) ? eq(events.entityId, entityId) : sql`${events.entityId}::text = ${entityId}`
        )
      )
      .orderBy(sql`${events.createdAt} DESC, CAST(${events.payload}->'_canonical'->'metadata'->>'_batchIndex' AS INTEGER) DESC, ${events.id} DESC`);

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
      .orderBy(sql`${events.createdAt} DESC, CAST(${events.payload}->'_canonical'->'metadata'->>'_batchIndex' AS INTEGER) DESC, ${events.id} DESC`)
      .limit(options.limit ?? 50)
      .offset(options.offset ?? 0);

    return rows.map(this.mapRowToCanonical);
  }

  /**
   * Retrieves events belonging to a specific batch.
   */
  static async getBatchEvents(
    correlationId: string,
    context: WorkspaceContext
  ): Promise<CanonicalEvent[]> {
    const db = getRuntimeDb();
    const rows = await db
      .select()
      .from(events)
      .where(
        and(
          eq(events.workspaceId, context.workspaceId),
          eq(events.correlationId, correlationId)
        )
      )
      .orderBy(sql`CAST(${events.payload}->'_canonical'->'metadata'->>'_batchIndex' AS INTEGER) ASC`);

    return rows.map(this.mapRowToCanonical);
  }

  private static async persistSingleEvent(
    db: DbClient,
    event: EventInput,
    context: WorkspaceContext,
    batchIndex?: number
  ): Promise<AppendEventResult> {
    if (!context || !context.workspaceId) {
      throw new EventStoreError("MISSING_WORKSPACE_CONTEXT", "Workspace context is required for appending events.");
    }

    // Validate and normalize idempotency key if provided
    let idempotencyKey = event.idempotencyKey;
    if (idempotencyKey !== undefined && idempotencyKey !== null) {
      if (typeof idempotencyKey !== "string") {
        throw new EventStoreError("INVALID_IDEMPOTENCY_KEY_TYPE", "Idempotency key must be a string.");
      }
      idempotencyKey = idempotencyKey.trim();
      if (idempotencyKey.length === 0) {
        throw new EventStoreError("EMPTY_IDEMPOTENCY_KEY", "Idempotency key cannot be empty.");
      }
      if (idempotencyKey.length > 255) {
        throw new EventStoreError("IDEMPOTENCY_KEY_TOO_LONG", "Idempotency key is too long (max 255 chars).");
      }
    } else {
        idempotencyKey = undefined;
    }

    // Strict UUID validation for entityId
    if (event.entityId !== undefined && event.entityId !== null && !isValidUuid(event.entityId)) {
        throw new EventStoreError("INVALID_ENTITY_ID", `Invalid UUID for entityId: ${event.entityId}`);
    }

    // Actor ID from context
    const contextActorId = context.actor.id;
    if (contextActorId && contextActorId !== "system" && !isValidUuid(contextActorId)) {
        throw new EventStoreError("INVALID_ACTOR_ID", `Invalid UUID for actorId in context: ${contextActorId}`);
    }

    const canonical: CanonicalEvent = {
      ...event,
      idempotencyKey,
      id: randomUUID(),
      workspaceId: context.workspaceId,
      actorId: contextActorId || "system",
      occurredAt: new Date().toISOString(),
      schemaVersion: "1.0.0",
      correlationId: context.correlationId || event.correlationId,
      metadata: {
        ...event.metadata,
        ...(batchIndex !== undefined ? { _batchIndex: batchIndex } : {}),
      },
    };

    // Validate against contract (Zod)
    CanonicalEventSchema.parse(canonical);

    try {
      const payloadWithMeta = {
        ...canonical.payload,
        _canonical: {
          schemaVersion: canonical.schemaVersion,
          idempotencyKey: canonical.idempotencyKey,
          metadata: canonical.metadata,
          occurredAt: canonical.occurredAt,
        },
      };

      // Actor ID must be NULL in DB if 'system' to satisfy Postgres UUID type
      const dbActorId = isValidUuid(canonical.actorId) ? canonical.actorId : null;

      // Use raw SQL to ensure atomic idempotency and handle environment-specific Drizzle issues
      await db.execute(sql`
        INSERT INTO "workflow"."events" (
          "id", "workspace_id", "event_type", "entity_type", "entity_id",
          "actor_id", "source", "correlation_id", "causation_id",
          "idempotency_key", "payload"
        ) VALUES (
          ${canonical.id},
          ${canonical.workspaceId},
          ${canonical.eventType},
          ${canonical.entityType},
          ${canonical.entityId || null},
          ${dbActorId},
          ${context.source || null},
          ${canonical.correlationId || null},
          ${canonical.causationId || null},
          ${canonical.idempotencyKey || null},
          ${sql`${JSON.stringify(payloadWithMeta)}::jsonb`}
        ) ON CONFLICT ("workspace_id", "idempotency_key") WHERE "idempotency_key" IS NOT NULL DO NOTHING
      `);

      if (idempotencyKey) {
        const existingRows = await db
          .select()
          .from(events)
          .where(
            and(
              eq(events.workspaceId, context.workspaceId),
              eq(events.idempotencyKey, idempotencyKey)
            )
          )
          .limit(1);

        if (existingRows.length > 0) {
          const storedEvent = this.mapRowToCanonical(existingRows[0]);
          if (storedEvent.id !== canonical.id) {
            return {
              status: "existing",
              event: storedEvent,
            };
          }
        }
      }

      return {
        status: "created",
        event: canonical,
      };

    } catch (error) {
      if (error instanceof EventStoreError) throw error;
      throw new EventStoreError("PERSISTENCE_FAILURE", "Failed to persist event due to unexpected error.", error);
    }
  }

  private static mapRowToCanonical(row: any): CanonicalEvent {
    const payload = row.payload || {};
    const canonicalMeta = payload._canonical || {};

    const { _canonical: _, ...restPayload } = payload;

    return {
      id: row.id,
      workspaceId: row.workspaceId,
      eventType: row.eventType,
      entityType: row.entityType,
      entityId: row.entityId || undefined,
      actorId: row.actorId || "system",
      occurredAt: canonicalMeta.occurredAt || (row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt),
      schemaVersion: canonicalMeta.schemaVersion || "1.0.0",
      correlationId: row.correlationId,
      causationId: row.causationId,
      idempotencyKey: row.idempotencyKey || canonicalMeta.idempotencyKey || undefined,
      payload: restPayload,
      metadata: canonicalMeta.metadata,
    };
  }
}
