import { getRuntimeDb } from "@/db";
import { events } from "@/db/runtime/schema/workflow";
import { eq, and, desc, sql } from "drizzle-orm";
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

    const canonical: CanonicalEvent = {
      ...event,
      idempotencyKey,
      id: crypto.randomUUID(),
      workspaceId: context.workspaceId,
      actorId: context.actor.id || "system",
      occurredAt: new Date().toISOString(),
      schemaVersion: "1.0.0",
      correlationId: context.correlationId || event.correlationId,
    };

    // Validate against contract
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

      // Ensure entityId and actorId are null if not valid UUIDs to satisfy Postgres uuid type
      const entityId = isValidUuid(canonical.entityId) ? canonical.entityId : null;
      const actorId = isValidUuid(canonical.actorId) ? canonical.actorId : null;

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
          ${entityId},
          ${actorId},
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
      throw new EventStoreError("PERSISTENCE_FAILURE", "Failed to persist event due to unexpected error.", error);
    }
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
      entityId: row.entityId,
      actorId: row.actorId,
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
