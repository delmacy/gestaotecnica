// src/scripts/launch-demo/constants.ts
// Deterministic seed definitions for the Launch Alpha (No PII)

export const LAUNCH_ALPHA_NAMESPACE = "launch-alpha-real";

export const LAUNCH_ALPHA = {
  organization: {
    key: `org_${LAUNCH_ALPHA_NAMESPACE}`,
    name: "Alpha Real Organization",
  },
  workspace: {
    key: `workspace_${LAUNCH_ALPHA_NAMESPACE}`,
    name: "Alpha Real Workspace",
  },
  users: {
    admin: {
      email: "alpha-admin@example.com",
      name: "Alpha Real Admin User",
      accessProfile: "admin" as const,
    },
    operator: {
      email: "alpha-operator@example.com",
      name: "Alpha Real Operator User",
      accessProfile: "operador" as const,
    },
    viewer: {
      email: "alpha-viewer@example.com",
      name: "Alpha Real Viewer User",
      accessProfile: "operador" as const,
    },
  },
  module: {
    key: `module_core_${LAUNCH_ALPHA_NAMESPACE}`,
    name: "Core Real Module",
  },
  capabilities: [
    {
      key: `capability_intake_${LAUNCH_ALPHA_NAMESPACE}`,
      name: "Real Intake",
      description: "Initial intake for real processes",
    },
    {
      key: `capability_approval_${LAUNCH_ALPHA_NAMESPACE}`,
      name: "Real Approval",
      description: "Approval step for real processes",
    },
  ],
  candidate: {
    name: "Real Workflow Alpha",
    description: "Launch real candidate workflow",
  },
  nodes: {
    start: { id: "start", type: "start", label: "Start" },
    review: { id: "review", type: "action", label: "Review" },
    approve: { id: "approve", type: "action", label: "Approve" },
    end: { id: "end", type: "end", label: "End" },
  },
  edges: [
    { id: "e-start-review", source: "start", target: "review" },
    { id: "e-review-approve", source: "review", target: "approve" },
    { id: "e-approve-end", source: "approve", target: "end" },
  ],
};
