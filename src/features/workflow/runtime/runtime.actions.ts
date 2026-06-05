"use server";

import { startProcessInstanceServerBoundary } from "./runtime.server";
import type { StartProcessInstanceInput, ProcessInstanceRecord } from "./runtime.types";
import type { RuntimeResult } from "./runtime.errors";

/**
 * Server action to start a new process instance.
 * @param input Payload containing workspaceId and processVersionId
 * @returns Standardized RuntimeResult indicating success or structured error
 */
export async function startProcessInstanceAction(
  input: StartProcessInstanceInput
): Promise<RuntimeResult<ProcessInstanceRecord>> {
  // A thin wrapper that connects Next.js form components to the server boundary
  return startProcessInstanceServerBoundary(input);
}
