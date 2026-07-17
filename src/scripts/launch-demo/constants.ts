// src/scripts/launch-demo/constants.ts
// Deterministic seed definitions for the Launch Demo (No PII)

export const LAUNCH_DEMO_NAMESPACE = "launch-demo-alpha";

export const LAUNCH_DEMO = {
  organization: {
    key: `org_${LAUNCH_DEMO_NAMESPACE}`,
    name: "Alpha Demo Organization",
  },
  workspace: {
    key: `workspace_${LAUNCH_DEMO_NAMESPACE}`,
    name: "Alpha Demo Workspace",
  },
  user: {
    email: "demo.alpha@example.local",
    name: "Demo Alpha User",
  },
  module: {
    key: `module_core_${LAUNCH_DEMO_NAMESPACE}`,
    name: "Core Demo Module",
  },
  capabilities: [
    {
      key: `capability_intake_${LAUNCH_DEMO_NAMESPACE}`,
      name: "Demo Intake",
      description: "Initial intake for demo processes",
    },
    {
      key: `capability_approval_${LAUNCH_DEMO_NAMESPACE}`,
      name: "Demo Approval",
      description: "Approval step for demo processes",
    },
  ],
  candidate: {
    name: "Demo Workflow Alpha",
    description: "Launch demo candidate workflow",
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
