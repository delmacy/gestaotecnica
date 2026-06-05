import { startProcessInstanceAction } from "@/features/workflow/runtime/runtime.actions";
import type { StartProcessInstanceInput } from "@/features/workflow/runtime/runtime.types";

export async function startBuilderProcessInstance(input: StartProcessInstanceInput) {
  try {
    const result = await startProcessInstanceAction(input);

    if (!result.ok) {
      console.error("Failed to start process instance", result.error);
      return { ok: false, error: result.error.message || "Failed to start process instance" };
    }

    return { ok: true, data: result.data };
  } catch (err: unknown) {
    console.error("Client error calling startProcessInstanceAction", err);
    return { ok: false, error: "An unexpected error occurred" };
  }
}
