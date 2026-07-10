import { getRuntimeDb } from "@/db";
import { events } from "@/db/runtime/schema/workflow";
import { eq, and, desc, sql } from "drizzle-orm";
import crypto from "node:crypto";
import {
  CanonicalEvent,
  CanonicalEventSchema,
} from "./canonical-contract";
import { EventReceipt, EventReceiptSchema } from "./event-types";
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

const BATCH_LIMIT = 100;

export class EventWriter {
  /**
   * Appends a single domain event to the log.
   * Ensuring workspace isolation and canonical structure.
   * Guarantees idempotency via database constraints.
   */
  static async appendDomainEvent(
    event: Omit<CanonicalEvent, "id" | "workspaceId" | "actorId" | "occurredAt" | "schemaVersion">,
    context: WorkspaceContext,
  ): Promise<CanonicalEvent> {
    const result = await this.appendDomainEventInternal(event, context);
    return result.event;
  }

  /**
   * Internal version that returns detailed status.
   */
  static async appendDomainEventInternal(
    event: Omit<CanonicalEvent, "id" | "workspaceId" | "actorId" | "occurredAt" | "schemaVersion">,
    context: WorkspaceContext,
  ): Promise<AppendEventResult> {
    if (!context || !context.workspaceId) {
      throw new EventStoreError("MISSING_WORKSPACE_CONTEXT", "Workspace context is required for appending events.");
    }

    const db = getRuntimeDb();
    const canonical = this.prepareEvent(event, context);

    try {
      return await this.persistSingleEvent(db, canonical, context);
    } catch (error) {
      if (error instanceof EventStoreError) throw error;
      throw new EventStoreError("PERSISTENCE_FAILURE", "Failed to persist event due to unexpected error.", error);
    }
  }

  /**
   * Appends multiple domain events in a single atomic transaction.
   * Rejects empty batches or batches exceeding the limit.
   */
  static async appendDomainEventBatch(
    domainEvents: Omit<CanonicalEvent, "id" | "workspaceId" | "actorId" | "occurredAt" | "schemaVersion">[],
    context: WorkspaceContext,
  ): Promise<CanonicalEvent[]> {
    if (!context || !context.workspaceId) {
      throw new EventStoreError("MISSING_WORKSPACE_CONTEXT", "Workspace context is required for appending events.");
    }

    if (!domainEvents || domainEvents.length === 0) {
      throw new EventStoreError("EMPTY_BATCH", "Cannot append an empty batch of events.");
    }

    if (domainEvents.length > BATCH_LIMIT) {
      throw new EventStoreError("BATCH_LIMIT_EXCEEDED", `Batch size exceeds limit of ${BATCH_LIMIT} events.`);
    }

    const batchId = crypto.randomUUID();
    const preparedEvents = domainEvents.map((e, index) =>
      this.prepareEvent(e, context, { batchId, batchIndex: index })
    );

    const db = getRuntimeDb();

    try {
      return await db.transaction(async (tx: any) => {
        const results: CanonicalEvent[] = [];
        for (const prepared of preparedEvents) {
          const result = await this.persistSingleEvent(tx, prepared, context);
          results.push(result.event);
        }
        return results;
      });
    } catch (error) {
      if (error instanceof EventStoreError) throw error;
      // Convert unexpected database errors to TRANSACTION_FAILURE
      throw new EventStoreError("TRANSACTION_FAILURE", "Failed to persist batch due to transaction error.", error);
    }
  }

  /**
   * Appends multiple domain events.
   * NOTE: This version is NOT atomic. Each event is persisted individually.
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
   * Creates an explicitly validated EventReceipt boundary object
   * based on the canonical event.
   */
  static createReceipt(
    event: CanonicalEvent,
    status: "success" | "error" | "skipped",
    options?: { processorId?: string; error?: string }
  ): EventReceipt {
    const receipt = {
      eventId: event.id,
      processorId: options?.processorId,
      processedAt: new Date().toISOString(),
      status,
      correlationId: event.correlationId,
      idempotencyKey: event.idempotencyKey,
      error: options?.error,
    };

    return EventReceiptSchema.parse(receipt);
  }

  private static prepareEvent(
    event: Omit<CanonicalEvent, "id" | "workspaceId" | "actorId" | "occurredAt" | "schemaVersion">,
    context: WorkspaceContext,
    batchMeta?: { batchId: string; batchIndex: number }
  ): CanonicalEvent {
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
      id: crypto.randomUUID(),
      workspaceId: context.workspaceId,
      actorId: contextActorId || "system",
      occurredAt: new Date().toISOString(),
      schemaVersion: "1.0.0",
      correlationId: context.correlationId || event.correlationId,
      metadata: {
        ...event.metadata,
        ...(batchMeta ? { batchId: batchMeta.batchId, _batchIndex: batchMeta.batchIndex } : {})
      }
    };

    // Validate against contract (Zod)
    CanonicalEventSchema.parse(canonical);

    return canonical;
  }

  private static async persistSingleEvent(
    db: any,
    canonical: CanonicalEvent,
    context: WorkspaceContext,
  ): Promise<AppendEventResult> {
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

    if (canonical.idempotencyKey) {
      const existingRows = await db
        .select()
        .from(events)
        .where(
          and(
            eq(events.workspaceId, context.workspaceId),
            eq(events.idempotencyKey, canonical.idempotencyKey)
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
  }

  /**
   * Retrieves events from a specific batch.
   */
  static async getBatch(
    batchId: string,
    context: WorkspaceContext,
  ): Promise<CanonicalEvent[]> {
    const db = getRuntimeDb();
    const rows = await db
      .select()
      .from(events)
      .where(
        and(
          eq(events.workspaceId, context.workspaceId),
          sql`payload->'_canonical'->'metadata'->>'batchId' = ${batchId}`
        )
      )
      .orderBy(sql`(payload->'_canonical'->'metadata'->>'_batchIndex')::integer ASC`);

    return rows.map(this.mapRowToCanonical);
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
