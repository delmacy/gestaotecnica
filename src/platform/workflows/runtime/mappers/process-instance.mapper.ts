import { ProcessInstance, ProcessInstanceSchema } from "../types/process-instance";
import { CorrelationContext } from "../../../contracts";

/**
 * Maps raw data to a canonical ProcessInstance.
 * Handles potential snake_case to camelCase conversion for mandatory fields.
 */
export function mapToProcessInstance(
  raw: unknown,
  context?: { correlation?: CorrelationContext; metadata?: Record<string, unknown> }
): ProcessInstance {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;

  const normalized = {
    id: data.id,
    workspaceId: data.workspaceId ?? data.workspace_id,
    processVersionId: data.processVersionId ?? data.process_version_id,
    currentStateId: data.currentStateId ?? data.current_state_id,
    status: data.status,
    createdById: Object.prototype.hasOwnProperty.call(data, 'createdById') ? data.createdById : (Object.prototype.hasOwnProperty.call(data, 'created_by_id') ? data.created_by_id : null),
    createdAt: data.createdAt ?? data.created_at,
    updatedAt: data.updatedAt ?? data.updated_at,
    metadata: data.metadata,
  };

  const parsed = ProcessInstanceSchema.parse(normalized);

  if (context?.metadata) {
    return {
      ...parsed,
      metadata: {
        ...(parsed.metadata as Record<string, unknown> || {}),
        ...context.metadata,
      },
    };
  }

  return parsed;
}
