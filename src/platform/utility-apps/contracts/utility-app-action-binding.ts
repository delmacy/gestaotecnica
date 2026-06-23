import { z } from "zod";
import { ActionDescriptorKeySchema } from "@/platform/actions/contracts/action-descriptor";
import { checkSafety } from "@/platform/actions/contracts/safe-traversal";

export const UtilityAppActionBindingSchema = z.object({
  actionDescriptorKey: ActionDescriptorKeySchema,
  mapping: z.record(z.string(), z.string()).describe("Mapping of { sourceField: targetField }"),
  metadata: z.unknown().optional()
}).strict()
.superRefine((data, ctx) => {
  if (data.metadata !== undefined) {
    if (data.metadata === null || typeof data.metadata !== "object" || Array.isArray(data.metadata)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "metadata must be a plain object",
        path: ["metadata"],
      });
      return;
    }

    const safetyResult = checkSafety(data.metadata);
    if (!safetyResult.isSafe) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `metadata is unsafe: ${safetyResult.reason}`,
        path: ["metadata"],
      });
    }
  }
});

export type UtilityAppActionBinding = z.infer<typeof UtilityAppActionBindingSchema>;
