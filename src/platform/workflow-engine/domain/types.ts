export interface WorkflowProcessInstance {
  id: string;
  workspaceId: string;
  processVersionId: string;
  currentStateId: string | null;
  status: string;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowProcessDefinition {
  id: string;
  workspaceId: string;
  key: string;
  name: string;
  description: string | null;
  blueprintKey: string | null;
}

export interface WorkflowEvent {
  id: string;
  workspaceId: string;
  instanceId: string | null;
  eventType: string;
  actorId: string | null;
  payload: Record<string, unknown>;
  createdAt: Date;
}

export interface ActionResult {
  success: boolean;
  message?: string;
  payload?: Record<string, unknown>;
  error?: unknown;
}
