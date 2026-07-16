import { z } from "zod";
import { WorkspaceIdSchema, EntityIdSchema } from "./identifiers";
import { ActorReferenceSchema } from "./actor";

export const IdentityContextSchema = z.object({
  workspaceId: WorkspaceIdSchema.optional(),
  actor: ActorReferenceSchema,
  entityId: EntityIdSchema.optional(),
});

export type IdentityContext = Readonly<z.infer<typeof IdentityContextSchema>>;
