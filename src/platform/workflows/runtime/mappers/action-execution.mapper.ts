import { ActionExecution, ActionExecutionSchema } from "../types/action-execution";

/**
 * Maps raw data to a canonical ActionExecution.
 * Handles potential snake_case to camelCase conversion for mandatory fields.
 */
export function mapToActionExecution(raw: unknown): ActionExecution {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;

  const normalized = {
    id: data.id,
    workspaceId: data.workspaceId ?? data.workspace_id,
    instanceId: data.instanceId ?? data.instance_id,
    actionKey: data.actionKey ?? data.action_key ?? data.node_id,
    actorId: data.hasOwnProperty('actorId') ? data.actorId : (data.hasOwnProperty('actor_id') ? data.actor_id : null),
    inputPayload: data.inputPayload ?? data.input_payload,
    outputPayload: data.outputPayload ?? data.output_payload,
    status: data.status,
    error: data.error,
    startedAt: data.startedAt ?? data.started_at,
    finishedAt: data.finishedAt ?? data.finished_at,
    correlationId: data.correlationId ?? data.correlation_id,
    causationId: data.causationId ?? data.causation_id,
  };

  return ActionExecutionSchema.parse(normalized);
}
