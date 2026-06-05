import { StartProcessInstanceInput } from "./runtime.types";

export function validateStartProcessInstanceInput(
  input: Partial<StartProcessInstanceInput>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.workspaceId) {
    errors.push("workspaceId is required");
  }

  if (!input.processDefinitionId) {
    errors.push("processDefinitionId is required");
  }

  if (!input.processVersionId) {
    errors.push("processVersionId is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
