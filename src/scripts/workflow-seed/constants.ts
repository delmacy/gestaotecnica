export const WORKFLOW_SEED_NAMESPACE = "workflow-seed-1";

export const WORKFLOW_SEED = {
  organization: {
    key: `org_${WORKFLOW_SEED_NAMESPACE}`,
    name: "Workflow Seed Org",
  },
  workspace: {
    key: `workspace_${WORKFLOW_SEED_NAMESPACE}`,
    name: "Workflow Seed Workspace",
  },
  user: {
    email: "workflow.seed@example.local",
    name: "Workflow Seed User",
  },
  module: {
    key: `module_core_${WORKFLOW_SEED_NAMESPACE}`,
    name: "Workflow Seed Module",
  },
  capabilities: [
    {
      key: `capability_intake_${WORKFLOW_SEED_NAMESPACE}`,
      name: "Workflow Seed Intake",
      description: "Initial intake for workflow seed",
    }
  ],
  candidate: {
    name: "Workflow Seed Candidate",
    description: "Launch seed candidate workflow",
  },
  nodes: {
    start: { id: "start", type: "start", label: "Start" },
    end: { id: "end", type: "end", label: "End" },
  },
  edges: [
    { id: "e-start-end", source: "start", target: "end" },
  ],
  forms: [
    {
      key: `form_request_${WORKFLOW_SEED_NAMESPACE}`,
      name: "Workflow Seed Request",
      description: "A minimal request form",
      fields: [
        { key: "request_title", label: "Title", type: "text", required: true },
        { key: "request_description", label: "Description", type: "textarea", required: false },
      ],
    },
  ],
};
