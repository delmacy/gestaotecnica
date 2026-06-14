import { CanonicalEvent, CanonicalEventSchema } from "../types/canonical-event";
import { EventMapperInput, EventMapperInputSchema } from "../types/input-types";

export class EventMappingError extends Error {
  constructor(public readonly details: unknown) {
    super("Failed to map event to canonical envelope");
    this.name = "EventMappingError";
  }
}

/**
 * Normalizes a date-like input to an ISO 8601 string.
 */
function normalizeDate(date: string | Date | number): string {
  if (date instanceof Date) {
    return date.toISOString();
  }
  if (typeof date === "number") {
    return new Date(date).toISOString();
  }
  // If it's already a string, Zod will validate if it's a valid ISO datetime
  return new Date(date).toISOString();
}

/**
 * Pure function to map raw input to a Canonical Event Envelope.
 * Preserves correlation_id and causation_id, and normalizes timestamps.
 */
export function mapToCanonicalEvent(input: EventMapperInput): CanonicalEvent {
  const validation = EventMapperInputSchema.safeParse(input);

  if (!validation.success) {
    throw new EventMappingError(validation.error.format());
  }

  const { data } = validation;

  const canonical: CanonicalEvent = {
    eventId: data.eventId,
    eventType: data.eventType,
    eventVersion: data.eventVersion,
    occurredAt: normalizeDate(data.occurredAt),
    recordedAt: data.recordedAt ? normalizeDate(data.recordedAt) : undefined,
    workspaceId: data.workspaceId,
    actor: data.actor,
    subjectType: data.subjectType,
    subjectId: data.subjectId,
    correlationId: data.correlationId,
    causationId: data.causationId,
    source: data.source,
    payload: { ...data.payload }, // Shallow copy to ensure non-mutation
    metadata: data.metadata ? { ...data.metadata } : undefined,
    schemaVersion: data.schemaVersion,
  };

  const finalValidation = CanonicalEventSchema.safeParse(canonical);
  if (!finalValidation.success) {
    throw new EventMappingError(finalValidation.error.format());
  }

  return finalValidation.data;
}
