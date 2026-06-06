import { z } from "zod";

export const processCandidateStatusSchema = z.enum([
  "draft",
  "under_analysis",
  "waiting_review",
  "approved",
  "rejected",
  "published",
]);

export const processCandidateOriginSchema = z.enum([
  "manual",
  "agent",
  "integration",
  "imported",
]);

export const processCandidateInsertSchema = z.object({
  id: z.string().uuid().optional(),
  workspaceId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  status: processCandidateStatusSchema.optional().default("draft"),
  origin: processCandidateOriginSchema.optional().default("manual"),
  proposedDefinition: z.record(z.string(), z.unknown()).nullable().optional(),
  evidence: z.record(z.string(), z.unknown()).nullable().optional(),
  createdById: z.string().uuid().nullable().optional(),
});
