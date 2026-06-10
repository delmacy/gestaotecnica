export type TaskStatus = 'backlog' | 'ready' | 'in_progress' | 'review' | 'done' | 'blocked' | 'cancelled';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskGroup = 'A' | 'B' | 'C' | 'D';

export interface TaskEvidence {
  id: string;
  name: string;
  filePath: string;
  provided: boolean;
}

export interface TaskDependency {
  taskId: string;
  relationship: 'depends_on' | 'blocked_by' | 'blocks';
}

export interface TaskAgent {
  id: string;
  name: string;
  role: string;
}

export interface TaskTransition {
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  timestamp: string;
  reason?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  module: string;
  group: TaskGroup;
  type: 'architecture' | 'contract' | 'implementation' | 'documentation';
  priority: TaskPriority;
  status: TaskStatus;
  summary: string;
  depends_on: TaskDependency[];
  blocked_by: TaskDependency[];
  agent_owner?: TaskAgent;
  expected_files: string[];
  acceptance_criteria: string[];
  evidence: TaskEvidence[];
  created_at: string;
  updated_at: string;
  source_docs: string[];
  next_action: string;
  is_synthetic?: boolean;
}
