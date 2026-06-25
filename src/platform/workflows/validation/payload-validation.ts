import { z } from "zod";
import { ProcessPayload, ProcessPayloadSchema } from "../runtime/types/process-payload";

export type PayloadValidationResult =
  | { success: true; data: ProcessPayload }
  | { success: false; error: z.ZodError };

/**
 * Validates a workflow runtime payload against the canonical ProcessPayloadSchema.
 * Enforces the strict safe JSON boundary for the `data` field.
 */
export function validateWorkflowPayload(payload: unknown): PayloadValidationResult {
  const result = ProcessPayloadSchema.safeParse(payload);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
