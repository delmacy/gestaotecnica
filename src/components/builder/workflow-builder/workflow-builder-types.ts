export type NodeType = "trigger" | "action" | "condition" | "gateway" | "end";

export interface GovernanceWarning {
  id: string;
  message: string;
  severity: "info" | "warning" | "error";
  type: "real_pending" | "real_blocked" | "best_practice";
}

export interface NodeBinding {
  id: string;
  type: "role" | "form" | "view" | "capability";
  targetId: string;
  targetName: string;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  bindings: NodeBinding[];
  actions: { id: string; name: string }[];
  conditions: { id: string; expression: string }[];
  warnings: GovernanceWarning[];
}

export interface WorkflowTransition {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

export interface WorkflowBlueprint {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  transitions: WorkflowTransition[];
  readinessStatus: "draft" | "needs_validation" | "ready";
}
