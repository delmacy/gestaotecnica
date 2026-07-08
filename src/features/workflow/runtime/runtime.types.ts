export type RuntimePayload = Record<string, unknown>;

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
  data: RuntimePayload;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionExecutionRecord {
  id: string;
  workspaceId: string;
  instanceId: string;
  actionKey: string;
  actorId: string | null;
  inputPayload: RuntimePayload;
  outputPayload: RuntimePayload;
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
  initialPayload?: RuntimePayload;
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
  inputPayload?: RuntimePayload;
  outputPayload?: RuntimePayload;
  status?: ActionExecutionStatus;
  error?: string | null;
  finishedAt?: Date | null;
}

// Step Execution concepts (mapped on top of actionExecution)

export type StepExecutionStatus = ActionExecutionStatus;

export interface StepExecutionInput {
  workspaceId: string;
  processInstanceId: string;
  actionKey: string;
  input: RuntimePayload;
  actorId?: string;
}

export interface StepExecutionOutput {
  workspaceId: string;
  processInstanceId: string;
  actionKey: string;
  output: RuntimePayload;
  status: StepExecutionStatus;
  error?: string;
}

export interface AdvanceStepInput {
  workspaceId: string;
  processInstanceId: string;
  actionKey?: string;
  actionExecutionId?: string;
  output?: RuntimePayload;
  actorId?: string;
  status?: StepExecutionStatus;
}

export interface AdvanceStepResult {
  executionId: string;
  instanceId: string;
  status: StepExecutionStatus;
}

export interface UpdateActionExecutionInput {
  workspaceId: string;
  instanceId: string;
  actionExecutionId: string;
  status: ActionExecutionStatus;
  outputPayload?: RuntimePayload;
  error?: string | null;
  finishedAt?: Date;
}
