import { z } from "zod";

/**
 * Generic `createEvent` input contract.
 *
 * Association fields (e.g. `assetId`, `serviceOrderId`, `workItemId`) MUST be
 * carried inside `payload`, never as top-level input properties. The schema is
 * `.strict()` so that any future attempt to reintroduce association fields at
 * the top level is rejected by validation.
 */
export const CreateEventInputSchema = z
  .object({
    eventType: z.string().min(1),
    entityType: z.string().min(1),
    entityId: z.string().min(1),
    payload: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type CreateEventInput = z.infer<typeof CreateEventInputSchema>;

/**
 * Pure helper that resolves the event payload written to the event log.
 * Preserves any association fields retained inside the payload as-is.
 */
export function buildEventPayload(payload?: Record<string, unknown>): Record<string, unknown> {
  return { ...(payload ?? {}) };
}