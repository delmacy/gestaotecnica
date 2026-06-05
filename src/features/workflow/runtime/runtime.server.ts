import { getRuntimeDb } from "@/db/index";
import { startProcessInstance } from "./runtime.service";
import type { StartProcessInstanceInput, ProcessInstanceRecord } from "./runtime.types";
import type { RuntimeResult } from "./runtime.errors";

/**
 * Server boundary for runtime operations.
 * Fetches the required database context and executes the service.
 */
export async function startProcessInstanceServerBoundary(
  input: StartProcessInstanceInput
): Promise<RuntimeResult<ProcessInstanceRecord>> {
  try {
    const db = getRuntimeDb();

    // Call the service logic with the injected db context
    const result = await startProcessInstance(db, input);

    return result;
  } catch (err: unknown) {
    console.error("Runtime boundary error (startProcessInstanceServerBoundary):", err);
    return {
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An internal server error occurred while starting the process instance.",
      },
    };
  }
}
