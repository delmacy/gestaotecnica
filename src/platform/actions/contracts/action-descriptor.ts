import { z } from "zod";
import { UnknownRecordSchema } from "@/platform/contracts";

/**
 * Action Descriptor Status
 * Represents the lifecycle state of the action descriptor.
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
 */
export const ActionExecutionModeSchema = z.enum(["sync", "async"]);
export type ActionExecutionMode = z.infer<typeof ActionExecutionModeSchema>;

/**
 * Action Side Effect
 * Categorizes the impact of the action on the system state.
 */
export const ActionSideEffectSchema = z.enum(["none", "read", "write", "external"]);
export type ActionSideEffect = z.infer<typeof ActionSideEffectSchema>;

/**
 * Action Descriptor Key
 * Rules:
 * - Namespace and name separated by dot (e.g. "workspaces.update")
 * - lowercase alphanumeric and underscores
 * - At least one dot required
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
    version: z.number().int().positive(),
    status: ActionDescriptorStatusSchema,
    inputSchema: UnknownRecordSchema,
    outputSchema: UnknownRecordSchema,
    handlerKey: z.string().min(1).max(200),
    executionMode: ActionExecutionModeSchema,
    idempotent: z.boolean().default(false),
    sideEffect: ActionSideEffectSchema,
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
    // Recursive check for functions in schemas (as they are UnknownRecord which could have anything in theory if not checked)
    // Although UnknownRecord is z.record(z.string(), z.unknown()), we want to explicitly forbid function-like values if possible.
    // However, Zod's unknown allows anything. We will enforce this in tests and here via a custom check.

    const containsFunction = (obj: unknown): boolean => {
      if (typeof obj === "function") return true;
      if (obj !== null && typeof obj === "object") {
        return Object.values(obj).some(containsFunction);
      }
      return false;
    };

    if (containsFunction(data.inputSchema)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "inputSchema must not contain functions",
        path: ["inputSchema"],
      });
    }

    if (containsFunction(data.outputSchema)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "outputSchema must not contain functions",
        path: ["outputSchema"],
      });
    }
  });

export type ActionDescriptor = z.infer<typeof ActionDescriptorSchema>;
