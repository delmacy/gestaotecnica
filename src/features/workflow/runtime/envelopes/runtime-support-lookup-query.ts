import { z } from "zod";
import { CorrelationIdSchema, WorkspaceIdSchema } from "@/platform/contracts";

export const RuntimeSupportLookupQuerySchema = z.object({
  workspaceId: WorkspaceIdSchema,
  correlationId: CorrelationIdSchema,
}).strict();

export type RuntimeSupportLookupQuery = Readonly<z.infer<typeof RuntimeSupportLookupQuerySchema>>;
