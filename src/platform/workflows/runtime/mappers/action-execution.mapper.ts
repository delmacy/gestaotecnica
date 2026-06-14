import { ActionExecution, ActionExecutionSchema } from "../types/action-execution";

/**
 * Maps raw data to a canonical ActionExecution.
 * Handles potential snake_case to camelCase conversion for mandatory fields.
 */
export function mapToActionExecution(raw: any): ActionExecution {
  const normalized: any = {
    id: raw.id,
    workspaceId: raw.workspaceId ?? raw.workspace_id,
    instanceId: raw.instanceId ?? raw.instance_id,
    actionKey: raw.actionKey ?? raw.action_key ?? raw.node_id,
    actorId: raw.hasOwnProperty('actorId') ? raw.actorId : (raw.hasOwnProperty('actor_id') ? raw.actor_id : null),
    inputPayload: raw.inputPayload ?? raw.input_payload,
    outputPayload: raw.outputPayload ?? raw.output_payload,
    status: raw.status,
    error: raw.error,
    startedAt: raw.startedAt ?? raw.started_at,
    finishedAt: raw.finishedAt ?? raw.finished_at,
    correlationId: raw.correlationId ?? raw.correlation_id,
    causationId: raw.causationId ?? raw.causation_id,
  };

  return ActionExecutionSchema.parse(normalized);
}
