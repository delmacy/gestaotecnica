export type ProcessInstanceStatus = "active" | "completed" | "failed" | "pending" | "cancelled";

export type ActionExecutionStatus = "pending" | "running" | "completed" | "failed" | "skipped";

export interface ProcessInstanceRecord {
  id: string;
  workspaceId: string;
  processVersionId: string;
  currentStateId: string | null;
  status: ProcessInstanceStatus;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessPayloadRecord {
  id: string;
  instanceId: string;
  workspaceId: string;
  schemaVersion: string;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionExecutionRecord {
  id: string;
  workspaceId: string;
  instanceId: string;
  actionKey: string;
  actorId: string | null;
  inputPayload: Record<string, unknown>;
  outputPayload: Record<string, unknown>;
  status: ActionExecutionStatus;
  error: string | null;
  startedAt: Date;
  finishedAt: Date | null;
}

// Data input interfaces

export interface StartProcessInstanceInput {
  workspaceId: string;
  processVersionId: string;
  createdById?: string;
  initialPayload?: Record<string, unknown>;
}

export interface ProcessInstanceInsert {
  id?: string;
  workspaceId: string;
  processVersionId: string;
  currentStateId?: string | null;
  status?: ProcessInstanceStatus;
  createdById?: string | null;
}

export interface ActionExecutionInsert {
  id?: string;
  workspaceId: string;
  instanceId: string;
  actionKey: string;
  actorId?: string | null;
  inputPayload?: Record<string, unknown>;
  outputPayload?: Record<string, unknown>;
  status?: ActionExecutionStatus;
  error?: string | null;
  finishedAt?: Date | null;
}
