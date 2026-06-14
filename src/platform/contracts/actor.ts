import { z } from "zod";

/**
 * ActorReference - reference to the identity performing the action.
 * Authorized types: human, system, worker, integration.
 */
export const ActorTypeSchema = z.enum(["human", "system", "worker", "integration"]);
export type ActorType = z.infer<typeof ActorTypeSchema>;

export const ActorReferenceSchema = z.object({
  type: ActorTypeSchema,
  id: z.string().min(1),
});

export type ActorReference = z.infer<typeof ActorReferenceSchema>;
