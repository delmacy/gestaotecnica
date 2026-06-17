import { z } from "zod";
import { checkSafety } from "./safe-traversal";

/**
 * Redefinition of UnknownRecordSchema to ensure strict compliance and avoid
 * circular dependencies with platform contracts if they ever occur.
 * No 'any' allowed.
 */
const UnknownRecordSchema = z.record(z.string(), z.unknown());

/**
 * Action Descriptor Status
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
 */
export const ActionExecutionModeSchema = z.enum(["sync", "async"]);
export type ActionExecutionMode = z.infer<typeof ActionExecutionModeSchema>;

/**
 * Action Side Effect
 */
export const ActionSideEffectSchema = z.enum(["none", "read", "write", "external"]);
export type ActionSideEffect = z.infer<typeof ActionSideEffectSchema>;

/**
 * Action Descriptor Key
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
 * Strict validation and safety checks for schemas.
 */
export const ActionDescriptorSchema = z
  .object({
    key: ActionDescriptorKeySchema,
    name: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    handlerKey: z.string().min(1).max(200),
    inputSchema: z.unknown(),
    outputSchema: z.unknown(),
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
    // We check inputSchema and outputSchema for safety.
    // Use z.unknown() to avoid Zod triggering getters during its own parsing.

    const inputResult = checkSafety(data.inputSchema);
    if (!inputResult.isSafe) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `inputSchema is unsafe: ${inputResult.reason}`,
        path: ["inputSchema"],
      });
    }

    const outputResult = checkSafety(data.outputSchema);
    if (!outputResult.isSafe) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `outputSchema is unsafe: ${outputResult.reason}`,
        path: ["outputSchema"],
      });
    }
  });

export type ActionDescriptor = z.infer<typeof ActionDescriptorSchema>;
