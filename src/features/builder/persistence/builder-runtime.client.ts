import { startProcessInstanceAction } from "@/features/workflow/runtime/runtime.actions";
import type { StartProcessInstanceInput, ProcessInstanceRecord } from "@/features/workflow/runtime/runtime.types";

export type StartBuilderProcessInstanceResult =
  | { ok: true; data: ProcessInstanceRecord }
  | { ok: false; error: { code: string; message: string } };

export async function startBuilderProcessInstance(
  input: StartProcessInstanceInput
): Promise<StartBuilderProcessInstanceResult> {
  try {
    const result = await startProcessInstanceAction(input);

    if (!result.ok) {
      // Removing console error as requested in Phase 17X constraint 4
      return {
        ok: false,
        error: {
          code: result.error.code || "START_FAILED",
          message: result.error.message || "Failed to start process instance"
        }
      };
    }

    return { ok: true, data: result.data };
  } catch {
    // Removing console error as requested in Phase 17X constraint 4
    return {
      ok: false,
      error: {
        code: "CLIENT_ERROR",
        message: "An unexpected error occurred"
      }
    };
  }
}