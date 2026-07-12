import { z } from "zod";
import { EntityIdSchema, ISODateTimeSchema } from "@/platform/contracts";

export const DraftSaveResultEnvelopeSchema = z.union([
  z.object({
    ok: z.literal(true),
    data: z.object({
      draftId: EntityIdSchema,
      savedAt: ISODateTimeSchema,
      version: z.number().int().optional(),
    }).strict(),
  }).strict(),
  z.object({
    ok: z.literal(false),
    error: z.discriminatedUnion("type", [
      z.object({
        type: z.literal("validation_failure"),
        code: z.string(),
        message: z.string(),
        issues: z.array(z.unknown()).optional(),
      }).strict(),
      z.object({
        type: z.literal("conflict_failure"),
        code: z.string(),
        message: z.string(),
        conflictingVersion: z.number().int().optional(),
      }).strict(),
    ]),
  }).strict(),
]);

export type DraftSaveResultEnvelope = z.infer<typeof DraftSaveResultEnvelopeSchema>;
