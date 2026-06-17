import { z } from "zod";
import { UnknownRecordSchema } from "@/platform/contracts";
import { checkSafety } from "./safe-traversal";

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
 */
export const ActionDescriptorSchema = z
  .object({
    key: ActionDescriptorKeySchema,
    name: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    handlerKey: z.string().min(1).max(200),

    // Explicitly use z.unknown() to avoid early getter execution by Zod's internal parsing.
    // Validation as record/object is handled by checkSafety and implicit serializability goals.
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
    // We manually enforce the UnknownRecordSchema contract (plain object)
    // to have total control over property access during validation.

    const schemas: ["inputSchema", "outputSchema"] = ["inputSchema", "outputSchema"];

    for (const schemaPath of schemas) {
      const schemaValue = data[schemaPath];

      // 1. Must be a plain object (UnknownRecord equivalent)
      if (schemaValue === null || typeof schemaValue !== "object" || Array.isArray(schemaValue)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${schemaPath} must be a plain object`,
          path: [schemaPath],
        });
        continue;
      }

      // 2. Perform deep safety check
      const safetyResult = checkSafety(schemaValue);
      if (!safetyResult.isSafe) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${schemaPath} is unsafe: ${safetyResult.reason}`,
          path: [schemaPath],
        });
      }
    }
  });

export type ActionDescriptor = z.infer<typeof ActionDescriptorSchema>;
