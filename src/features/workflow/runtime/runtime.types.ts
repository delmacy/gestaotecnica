export type ProcessInstanceStatus =
  | "pending"
  | "active"
  | "completed"
  | "cancelled"
  | "failed";

export type ProcessInstanceStepStatus =
  | "pending"
  | "active"
  | "completed"
  | "skipped"
  | "failed";

export interface ProcessInstanceRecord {
  id: string;
  workspaceId: string;
  processDefinitionId: string;
  processVersionId: string;
  status: ProcessInstanceStatus;
  currentNodeId?: string;
  startedBy?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProcessInstanceStepRecord {
  id: string;
  processInstanceId: string;
  nodeId: string;
  nodeType: string;
  status: ProcessInstanceStepStatus;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
}

export interface StartProcessInstanceInput {
  workspaceId: string;
  processDefinitionId: string;
  processVersionId: string;
  startedBy?: string;
}

export type StartProcessInstanceResult =
  | {
      ok: true;
      data: ProcessInstanceRecord;
    }
  | {
      ok: false;
      error: { code: string; message: string };
    };
