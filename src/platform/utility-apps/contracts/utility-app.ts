import { z } from "zod";
import {
  EntityIdSchema,
  WorkspaceIdSchema,
  ISODateTimeSchema,
  UnknownRecordSchema,
} from "@/platform/contracts";

/**
 * Utility App Category
 * Represents the specialized purpose of the utility app.
 */
export const UtilityAppCategorySchema = z.enum([
  "lookup",
  "calculation",
  "decision_table",
  "mapping",
  "reference_catalog",
  "diagnostic",
  "checklist",
  "comparison",
]);
export type UtilityAppCategory = z.infer<typeof UtilityAppCategorySchema>;

/**
 * Utility App Status
 * Represents the lifecycle state of the utility app.
 */
export const UtilityAppStatusSchema = z.enum(["draft", "published", "archived"]);
export type UtilityAppStatus = z.infer<typeof UtilityAppStatusSchema>;

/**
 * Utility App Key
 * Rules:
 * - 3 to 100 characters
 * - Starts with lowercase letter
 * - Only a-z, 0-9 and hyphen
 * - No trailing hyphen
 * - No consecutive hyphens
 *
 * Technical Note: This regex is deliberately shared with ProcessDefinitionKeySchema
 * for consistency across the System Builder, but UtilityAppKey remains a distinct
 * semantic contract and must not be used interchangeably with ProcessDefinitionKey.
 */
export const UtilityAppKeySchema = z
  .string()
  .min(3)
  .max(100)
  .regex(/^[a-z](?:[a-z0-9]|-(?!-))*[a-z0-9]$/);
export type UtilityAppKey = z.infer<typeof UtilityAppKeySchema>;

/**
 * Capability Key Reference
 * Local schema for referencing capabilities, following the registry convention.
 */
export const CapabilityKeySchema = z.string().regex(/^[a-z0-9-]+$/);
export type CapabilityKey = z.infer<typeof CapabilityKeySchema>;

/**
 * Utility App Definition Schema
 * Canonical contract for representing a Utility App in the System Builder.
 * Focused on specialized I/O execution semantics rather than temporal processes.
 */
export const UtilityAppDefinitionSchema = z
  .object({
    id: EntityIdSchema,
    workspaceId: WorkspaceIdSchema,
    key: UtilityAppKeySchema,
    name: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    category: UtilityAppCategorySchema,
    status: UtilityAppStatusSchema,
    version: z.number().int().positive(),
    inputSchema: UnknownRecordSchema,
    outputSchema: UnknownRecordSchema,
    configuration: UnknownRecordSchema,
    capabilityKeys: z
      .array(CapabilityKeySchema)
      .optional()
      .refine((items) => !items || new Set(items).size === items.length, {
        message: "capabilityKeys must be unique",
      }),
    tags: z
      .array(z.string().min(1))
      .optional()
      .refine((items) => !items || new Set(items).size === items.length, {
        message: "tags must be unique",
      }),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
    createdById: EntityIdSchema,
  })
  .strict();

export type UtilityAppDefinition = z.infer<typeof UtilityAppDefinitionSchema>;
