import { z } from "zod";
import { UtilityAppKeySchema } from "./utility-app";
import { ActionDescriptorKeySchema } from "@/platform/actions/contracts/action-descriptor";
import { checkSafety } from "@/platform/actions/contracts/safe-traversal";

/**
 * Utility App Action Direction
 * - consumes: Utility App calls the Action.
 * - exposes: Utility App provides the implementation for the Action.
 */
export const UtilityAppActionDirectionSchema = z.enum(["consumes", "exposes"]);
export type UtilityAppActionDirection = z.infer<typeof UtilityAppActionDirectionSchema>;

/**
 * Utility App Action Binding Schema
 * Canonical contract for declaring how a Utility App interacts with an Action Descriptor.
 * This is a pure declarative binding and does not include execution logic.
 */
export const UtilityAppActionBindingSchema = z
  .object({
    utilityAppKey: UtilityAppKeySchema,
    actionKey: ActionDescriptorKeySchema,
    direction: UtilityAppActionDirectionSchema,
    operationKey: z.string().min(1).max(100),
    inputMapping: z.record(z.string(), z.string()).optional(),
    outputMapping: z.record(z.string(), z.string()).optional(),
    enabled: z.boolean(),
    metadata: z.unknown().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    // Validate metadata safety if present
    if (data.metadata !== undefined) {
      const safetyResult = checkSafety(data.metadata);
      if (!safetyResult.isSafe) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `metadata is unsafe: ${safetyResult.reason}`,
          path: ["metadata"],
        });
      }
    }

    // Ensure mapping keys and values are safe and targets are unique.
    const mappings: ["inputMapping", "outputMapping"] = ["inputMapping", "outputMapping"];
    for (const mappingPath of mappings) {
      const mapping = data[mappingPath];
      if (mapping) {
        const targets = new Set<string>();
        const allKeys = new Set([
           ...Object.keys(mapping),
           ...Object.getOwnPropertyNames(mapping)
        ]);

        for (const key of allKeys) {
           const value = (mapping as Record<string, string>)[key];

           if (key === "__proto__" || key === "prototype" || key === "constructor") {
             ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: `Illegal key in ${mappingPath}: ${key}`,
               path: [mappingPath, key],
             });
           }
           if (value === "__proto__" || value === "prototype" || value === "constructor") {
             ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: `Illegal value in ${mappingPath}: ${value}`,
               path: [mappingPath, key],
             });
           }

           if (targets.has(value)) {
             ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: `Duplicate target field in ${mappingPath}: ${value}`,
               path: [mappingPath, key],
             });
           }
           targets.add(value);
        }
      }
    }
  });

export type UtilityAppActionBinding = z.infer<typeof UtilityAppActionBindingSchema>;
