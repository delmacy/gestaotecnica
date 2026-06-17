import { z } from "zod";
import {
  EntityIdSchema,
  WorkspaceIdSchema,
  ISODateTimeSchema,
  UnknownRecordSchema,
} from "@/platform/contracts";
import { ProcessDefinitionKeySchema } from "./process-definition-key";
import { ProcessNodeSchema, ProcessEdgeSchema } from "./process-node-edge";

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

export {
  ProcessDefinitionKeySchema,
  type ProcessDefinitionKey,
} from "./process-definition-key";

/**
 * Process Version Number
 */
export const ProcessVersionNumberSchema = z.number().int().min(1);
export type ProcessVersionNumber = z.infer<typeof ProcessVersionNumberSchema>;

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
 * Internal Process Definition Graph Schema
 */
const ProcessGraphSchema = z
  .object({
    schemaVersion: z.string().min(1),
    nodes: z.array(ProcessNodeSchema),
    edges: z.array(ProcessEdgeSchema),
  })
  .strict()
  .superRefine((data, ctx) => {
    const nodeIds = new Set<string>();
    data.nodes.forEach((node, index) => {
      if (nodeIds.has(node.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate node ID: ${node.id}`,
          path: ["nodes", index, "id"],
        });
      }
      nodeIds.add(node.id);
    });

    const edgeIds = new Set<string>();
    data.edges.forEach((edge, index) => {
      if (edgeIds.has(edge.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate edge ID: ${edge.id}`,
          path: ["edges", index, "id"],
        });
      }
      edgeIds.add(edge.id);

      if (!nodeIds.has(edge.sourceNodeId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Edge source node not found: ${edge.sourceNodeId}`,
          path: ["edges", index, "sourceNodeId"],
        });
      }

      if (!nodeIds.has(edge.targetNodeId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Edge target node not found: ${edge.targetNodeId}`,
          path: ["edges", index, "targetNodeId"],
        });
      }
    });
  });

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
    definition: ProcessGraphSchema,
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
  })
  .transform((data) => Object.freeze(data));

export type ProcessVersion = z.infer<typeof ProcessVersionSchema>;

/**
 * Process Definition Envelope Schema
 * Composes Definition and Version (which owns the Graph)
 * Option A: ProcessVersion owns nodes/edges
 */
export const ProcessDefinitionEnvelopeSchema = z
  .object({
    definition: ProcessDefinitionSchema,
    version: ProcessVersionSchema,
  })
  .strict()
  .transform((data) => Object.freeze(data));

export type ProcessDefinitionEnvelope = z.infer<typeof ProcessDefinitionEnvelopeSchema>;
