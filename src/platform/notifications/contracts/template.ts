import { z } from "zod";
import { EntityIdSchema } from "@/platform/contracts/identifiers";
import { SchemaVersionSchema } from "@/platform/contracts/payload";

/**
 * NotificationTemplateReference - reference to a notification template.
 */
export const NotificationTemplateReferenceSchema = z.strictObject({
  id: EntityIdSchema,
  version: SchemaVersionSchema,
});

export type NotificationTemplateReference = z.infer<typeof NotificationTemplateReferenceSchema>;
