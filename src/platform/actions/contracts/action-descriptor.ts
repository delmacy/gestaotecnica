import { z } from "zod";
import { UnknownRecordSchema } from "@/platform/contracts";
import { hasFunction } from "./safe-traversal";

/**
 * Action Descriptor Status
 * Represents the lifecycle state of the action descriptor.
 * (Optional extension, made optional due to lack of immediate persistence evidence)
 */
export const ActionDescriptorStatusSchema = z.enum([
  "draft",
  "published",
  "deprecated",
  "archived",
]);
export type ActionDescriptorStatus = z.infer<typeof ActionDescriptorStatusSchema>;

/**
 * Action Execution Mode
 * Defines how the action is expected to be executed.
 * (Optional extension)
 */
export const ActionExecutionModeSchema = z.enum(["sync", "async"]);
export type ActionExecutionMode = z.infer<typeof ActionExecutionModeSchema>;

/**
 * Action Side Effect
 * Categorizes the impact of the action on the system state.
 * (Optional extension)
 */
export const ActionSideEffectSchema = z.enum(["none", "read", "write", "external"]);
export type ActionSideEffect = z.infer<typeof ActionSideEffectSchema>;

/**
 * Action Descriptor Key
 * Rules:
 * - Namespace and name separated by dot (e.g. "workspaces.update")
 * - lowercase alphanumeric and underscores
 * - At least one dot required for qualification
 */
export const ActionDescriptorKeySchema = z
  .string()
  .min(3)
  .max(100)
  .regex(/^[a-z0-9_]+(?:\.[a-z0-9_]+)+$/);
export type ActionDescriptorKey = z.infer<typeof ActionDescriptorKeySchema>;

/**
 * Action Descriptor Schema
 * Canonical contract for describing an Action in the technical catalog.
 * It contains metadata and I/O contracts, but NO executable code.
 */
export const ActionDescriptorSchema = z
  .object({
    key: ActionDescriptorKeySchema,
    name: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),

    // Mandatory field to decouple descriptor from implementation.
    // Maps to the key used in the memory-resident registry/ActionDefinition.
    handlerKey: z.string().min(1).max(200),

    // Mandatory I/O schemas
    inputSchema: UnknownRecordSchema,
    outputSchema: UnknownRecordSchema,

    // Optional fields (extensions without current DB/Runtime mandatory evidence)
    version: z.number().int().positive().optional(),
    status: ActionDescriptorStatusSchema.optional(),
    executionMode: ActionExecutionModeSchema.optional(),
    sideEffect: ActionSideEffectSchema.optional(),
    idempotent: z.boolean().optional(),
    timeoutMs: z.number().int().positive().optional(),
    tags: z
      .array(z.string().min(1))
      .optional()
      .refine((items) => !items || new Set(items).size === items.length, {
        message: "tags must be unique",
      }),
  })
  .strict()
  .superRefine((data, ctx) => {
    // Safe recursive check for functions in schemas
    if (hasFunction(data.inputSchema)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "inputSchema must not contain functions",
        path: ["inputSchema"],
      });
    }

    if (hasFunction(data.outputSchema)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "outputSchema must not contain functions",
        path: ["outputSchema"],
      });
    }
  });

export type ActionDescriptor = z.infer<typeof ActionDescriptorSchema>;
