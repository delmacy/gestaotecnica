import { ProcessInstance, ProcessInstanceSchema } from "../types/process-instance";
import { CorrelationContext } from "../../../contracts";

/**
 * Maps raw data to a canonical ProcessInstance.
 * Handles potential snake_case to camelCase conversion for mandatory fields.
 */
export function mapToProcessInstance(
  raw: any,
  context?: { correlation?: CorrelationContext; metadata?: Record<string, unknown> }
): ProcessInstance {
  const normalized: any = {
    id: raw.id,
    workspaceId: raw.workspaceId ?? raw.workspace_id,
    processVersionId: raw.processVersionId ?? raw.process_version_id,
    definitionId: raw.definitionId ?? raw.definition_id,
    definitionVersion: raw.definitionVersion ?? raw.definition_version,
    currentStateId: raw.currentStateId ?? raw.current_state_id,
    status: raw.status,
    createdById: raw.hasOwnProperty('createdById') ? raw.createdById : (raw.hasOwnProperty('created_by_id') ? raw.created_by_id : null),
    createdAt: raw.createdAt ?? raw.created_at,
    updatedAt: raw.updatedAt ?? raw.updated_at,
    metadata: raw.metadata,
  };

  const parsed = ProcessInstanceSchema.parse(normalized);

  if (context?.metadata) {
    return {
      ...parsed,
      metadata: {
        ...parsed.metadata,
        ...context.metadata,
      },
    };
  }

  return parsed;
}
