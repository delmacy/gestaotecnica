import { z } from "zod";
import { checkSafeJsonValue } from "../../../platform/contracts/safe-json";

/**
 * Utility to build strict action payload schemas that enforce the safe JSON boundary.
 * Accepts a Zod shape, enforces strictness, and deeply validates the payload
 * to reject unsafe values (functions, accessors, built-ins, prototypes).
 */
export function createPayloadSchema<T extends z.ZodRawShape>(shape: T) {
  return z
    .object(shape)
    .strict()
    .superRefine((data, ctx) => {
      const result = checkSafeJsonValue(data);
      if (!result.isSafe) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unsafe payload: ${result.reason}`,
        });
      }
    });
}
