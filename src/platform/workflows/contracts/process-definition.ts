import { z } from "zod";
import {
  EntityIdSchema,
  WorkspaceIdSchema,
  ISODateTimeSchema,
  UnknownRecordSchema,
} from "@/platform/contracts";

/**
 * Process Definition Status
 */
export const ProcessDefinitionStatusSchema = z.enum(["draft", "published", "archived"]);
export type ProcessDefinitionStatus = z.infer<typeof ProcessDefinitionStatusSchema>;

/**
 * Process Version Status
 */
export const ProcessVersionStatusSchema = z.enum(["draft", "published", "archived"]);
export type ProcessVersionStatus = z.infer<typeof ProcessVersionStatusSchema>;

/**
 * Process Definition Key
 * Rules:
 * - 3 to 100 characters
 * - Starts with lowercase letter
 * - Only a-z, 0-9 and hyphen
 * - No trailing hyphen
 * - No consecutive hyphens
 */
export const ProcessDefinitionKeySchema = z
  .string()
  .min(3)
  .max(100)
  .regex(/^[a-z](?:[a-z0-9]|-(?!-))*[a-z0-9]$/);
export type ProcessDefinitionKey = z.infer<typeof ProcessDefinitionKeySchema>;

/**
 * Process Version Number
 */
export const ProcessVersionNumberSchema = z.number().int().min(1);
export type ProcessVersionNumber = z.infer<typeof ProcessVersionNumberSchema>;

/**
 * Internal Process Definition Envelope
 * (Minimal structure for nodes and edges)
 */
const ProcessDefinitionEnvelopeSchema = z
  .object({
    schemaVersion: z.string().min(1),
    nodes: z.array(z.unknown()),
    edges: z.array(z.unknown()),
    metadata: UnknownRecordSchema.optional(),
  })
  .strict();

/**
 * Process Definition Schema
 */
export const ProcessDefinitionSchema = z
  .object({
    id: EntityIdSchema,
    workspaceId: WorkspaceIdSchema,
    key: ProcessDefinitionKeySchema,
    name: z.string().min(1).max(200),
    status: ProcessDefinitionStatusSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
    createdById: EntityIdSchema,
    description: z.string().max(2000).optional(),
    publishedVersionId: EntityIdSchema.optional(),
    blueprintKey: z.string().min(1).optional(),
    blueprintVersion: z.number().int().positive().optional(),
    metadata: UnknownRecordSchema.optional(),
  })
  .strict();

export type ProcessDefinition = z.infer<typeof ProcessDefinitionSchema>;

/**
 * Process Version Schema
 */
export const ProcessVersionSchema = z
  .object({
    id: EntityIdSchema,
    workspaceId: WorkspaceIdSchema,
    processDefinitionId: EntityIdSchema,
    version: ProcessVersionNumberSchema,
    status: ProcessVersionStatusSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
    createdById: EntityIdSchema,
    definition: ProcessDefinitionEnvelopeSchema,
    publishedAt: ISODateTimeSchema.optional(),
    publishedById: EntityIdSchema.optional(),
    changeSummary: z.string().optional(),
    metadata: UnknownRecordSchema.optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.status === "published") {
      if (!data.publishedAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "publishedAt is required when status is published",
          path: ["publishedAt"],
        });
      }
      if (!data.publishedById) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "publishedById is required when status is published",
          path: ["publishedById"],
        });
      }
    }
  });

export type ProcessVersion = z.infer<typeof ProcessVersionSchema>;
