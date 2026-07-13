import { z } from "zod";
import { CorrelationIdSchema } from "@/platform/contracts";
import { UUIDSchema } from "@/platform/contracts";

export const RuntimeSupportLookupQuerySchema = z.object({
  organizationId: UUIDSchema,
  workspaceId: UUIDSchema,
  correlationId: CorrelationIdSchema,
}).strict();

export type RuntimeSupportLookupQuery = Readonly<z.infer<typeof RuntimeSupportLookupQuerySchema>>;
