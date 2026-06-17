import { z } from "zod";
import { UtilityAppKeySchema } from "./utility-app";
import { ActionDescriptorKeySchema } from "@/platform/actions/contracts/action-descriptor";
import { SafeJsonRecordSchema } from "@/platform/contracts/safe-json";

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
    // Use unknown to prevent early traversal before SafeJsonRecordSchema
    inputMapping: z.unknown().optional(),
    outputMapping: z.unknown().optional(),
    enabled: z.boolean(),
    metadata: SafeJsonRecordSchema.optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    // Validate Mappings using SafeJsonRecordSchema first
    const mappingPaths: ["inputMapping", "outputMapping"] = ["inputMapping", "outputMapping"];
    for (const path of mappingPaths) {
      const mapping = data[path];
      if (mapping === undefined) continue;

      // 1. Validate through canonical SafeJsonRecordSchema (handles proxies, accessors, etc.)
      const safeResult = SafeJsonRecordSchema.safeParse(mapping);
      if (!safeResult.success) {
        for (const issue of safeResult.error.issues) {
          ctx.addIssue({ ...issue, path: [path, ...issue.path] });
        }
        continue;
      }

      // 2. Structural Validation and uniqueness/pollution check
      const parseResult = MappingObjectSchema.safeParse(mapping);
      if (!parseResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${path} structure is invalid: values must be strings`,
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
