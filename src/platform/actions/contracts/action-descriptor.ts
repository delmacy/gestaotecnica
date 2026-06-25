import { z } from "zod";
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

    // Use z.unknown() to allow checkSafety to handle all object introspection
    // and avoid any early trigger of getters by Zod.
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
    const schemas: ["inputSchema", "outputSchema"] = ["inputSchema", "outputSchema"];

    for (const schemaPath of schemas) {
      const schemaValue = data[schemaPath];

      // 1. Must be a plain object (UnknownRecord equivalent)
      // We manually check for object and non-array here as top-level requirement.
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

/**
 * Validates an action descriptor against the canonical contract.
 * @param descriptor The object to validate.
 * @returns The validated ActionDescriptor.
 * @throws z.ZodError if the descriptor is invalid according to the schema.
 */
export function validateActionDescriptor(descriptor: unknown): ActionDescriptor {
  return ActionDescriptorSchema.parse(descriptor);
}
