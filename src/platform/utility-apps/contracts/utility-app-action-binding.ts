import { z } from "zod";
import { UtilityAppKeySchema } from "./utility-app";
import { ActionDescriptorKeySchema } from "@/platform/actions/contracts/action-descriptor";
import { checkSafety } from "@/platform/actions/contracts/safe-traversal";

/**
 * Utility App Action Direction
 */
export const UtilityAppActionDirectionSchema = z.enum(["consumes", "exposes"]);
export type UtilityAppActionDirection = z.infer<typeof UtilityAppActionDirectionSchema>;

/**
 * Mapping Schema
 * Internal validation for mapping objects after safety check.
 */
const MappingObjectSchema = z.record(z.string(), z.string());

/**
 * Utility App Action Binding Schema
 * Canonical contract for declaring how a Utility App interacts with an Action Descriptor.
 */
export const UtilityAppActionBindingSchema = z
  .object({
    utilityAppKey: UtilityAppKeySchema,
    actionKey: ActionDescriptorKeySchema,
    direction: UtilityAppActionDirectionSchema,
    operationKey: z.string().min(1).max(100),
    // Initially unknown to prevent Zod record traversal before safety check
    inputMapping: z.unknown().optional(),
    outputMapping: z.unknown().optional(),
    enabled: z.boolean(),
    metadata: z.unknown().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    // 1. Validate Metadata (must be a plain record and safe)
    if (data.metadata !== undefined) {
      if (data.metadata === null || typeof data.metadata !== "object" || Array.isArray(data.metadata)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "metadata must be a plain object",
          path: ["metadata"],
        });
      } else {
        const safetyResult = checkSafety(data.metadata);
        if (!safetyResult.isSafe) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `metadata is unsafe: ${safetyResult.reason}`,
            path: ["metadata"],
          });
        }
      }
    }

    // 2. Validate Mappings
    const mappingPaths: ["inputMapping", "outputMapping"] = ["inputMapping", "outputMapping"];
    for (const path of mappingPaths) {
      const mapping = data[path];
      if (mapping === undefined) continue;

      // 2.1 Basic Object Check
      if (mapping === null || typeof mapping !== "object" || Array.isArray(mapping)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${path} must be a plain object`,
          path: [path],
        });
        continue;
      }

      // 2.2 Safety Check (traverses own property descriptors)
      const safetyResult = checkSafety(mapping);
      if (!safetyResult.isSafe) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${path} is unsafe: ${safetyResult.reason}`,
          path: [path],
        });
        continue;
      }

      // 2.3 Structural Validation and uniqueness/pollution check
      const parseResult = MappingObjectSchema.safeParse(mapping);
      if (!parseResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${path} structure is invalid`,
          path: [path],
        });
        continue;
      }

      const targets = new Set<string>();
      const keys = Object.getOwnPropertyNames(mapping);
      for (const key of keys) {
        const value = parseResult.data[key];

        // Pollution check
        const dangerous = ["__proto__", "prototype", "constructor"];
        if (dangerous.includes(key)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Illegal key in ${path}: ${key}`,
            path: [path, key],
          });
        }
        if (dangerous.includes(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Illegal value in ${path}: ${value}`,
            path: [path, key],
          });
        }

        // Uniqueness check
        if (targets.has(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate target field in ${path}: ${value}`,
            path: [path, key],
          });
        }
        targets.add(value);
      }
    }
  });

export type UtilityAppActionBinding = z.infer<typeof UtilityAppActionBindingSchema> & {
  inputMapping?: Record<string, string>;
  outputMapping?: Record<string, string>;
};
