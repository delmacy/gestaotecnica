import { z } from "zod";
import { EntityIdSchema, UnknownRecordSchema } from "@/platform/contracts";
import { ProcessDefinitionKeySchema } from "./process-definition-key";

/**
 * Process Node Type
 */
export const ProcessNodeTypeSchema = z.enum([
  "start",
  "action",
  "decision",
  "form",
  "wait",
  "subprocess",
  "end",
]);
export type ProcessNodeType = z.infer<typeof ProcessNodeTypeSchema>;

/**
 * Process Node Position
 */
export const ProcessNodePositionSchema = z
  .object({
    x: z.number().finite(),
    y: z.number().finite(),
  })
  .strict();
export type ProcessNodePosition = z.infer<typeof ProcessNodePositionSchema>;

/**
 * Process Node Schema
 */
export const ProcessNodeSchema = z
  .object({
    id: EntityIdSchema,
    key: ProcessDefinitionKeySchema,
    type: ProcessNodeTypeSchema,
    name: z.string().min(1).max(200),
    position: ProcessNodePositionSchema,
    config: UnknownRecordSchema,
    description: z.string().max(2000).optional(),
    actionKey: z.string().min(1).optional(),
    formKey: z.string().min(1).optional(),
    subprocessDefinitionKey: ProcessDefinitionKeySchema.optional(),
    metadata: UnknownRecordSchema.optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.type === "action" && !data.actionKey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "actionKey is required when type is action",
        path: ["actionKey"],
      });
    }
    if (data.type === "form" && !data.formKey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "formKey is required when type is form",
        path: ["formKey"],
      });
    }
    if (data.type === "subprocess" && !data.subprocessDefinitionKey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "subprocessDefinitionKey is required when type is subprocess",
        path: ["subprocessDefinitionKey"],
      });
    }
  });

export type ProcessNode = z.infer<typeof ProcessNodeSchema>;

/**
 * Process Edge Type
 */
export const ProcessEdgeTypeSchema = z.enum(["default", "conditional", "error", "timeout"]);
export type ProcessEdgeType = z.infer<typeof ProcessEdgeTypeSchema>;

/**
 * Process Edge Condition
 */
export const ProcessEdgeConditionSchema = z
  .object({
    expression: z.string().min(1).max(4000),
    language: z.enum(["expression", "json_logic"]),
    description: z.string().max(1000).optional(),
    metadata: UnknownRecordSchema.optional(),
  })
  .strict();
export type ProcessEdgeCondition = z.infer<typeof ProcessEdgeConditionSchema>;

/**
 * Process Edge Schema
 */
export const ProcessEdgeSchema = z
  .object({
    id: EntityIdSchema,
    sourceNodeId: EntityIdSchema,
    targetNodeId: EntityIdSchema,
    type: ProcessEdgeTypeSchema,
    priority: z.number().int().min(0),
    name: z.string().min(1).max(200).optional(),
    condition: ProcessEdgeConditionSchema.optional(),
    metadata: UnknownRecordSchema.optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.type === "conditional" && !data.condition) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "condition is required when type is conditional",
        path: ["condition"],
      });
    }
  });

export type ProcessEdge = z.infer<typeof ProcessEdgeSchema>;
