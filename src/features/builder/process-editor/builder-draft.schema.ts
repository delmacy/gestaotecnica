import { z } from "zod";

export const BuilderDraftMetadataSchema = z.record(z.string(), z.unknown());
export const BuilderDraftPayloadSchema = z.unknown().superRefine((val, ctx) => {
  if (val !== undefined && (typeof val !== "object" || val === null || Array.isArray(val))) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Payload must be a valid JSON object.",
    });
  }
});

export const BuilderDraftValidationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "O nome do processo é obrigatório."),
  status: z.enum(["draft", "published", "archived"]),
  nodes: z.array(z.object({ id: z.string() }).passthrough()),
  edges: z.array(z.object({ id: z.string() }).passthrough()),
  metadata: BuilderDraftMetadataSchema.optional(),
  payload: BuilderDraftPayloadSchema.optional(),
}).passthrough();
