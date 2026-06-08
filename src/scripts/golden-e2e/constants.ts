// src/scripts/golden-e2e/constants.ts
// Nomenclatura Canônica do Seed - Golden E2E

export const GOLDEN_E2E_NAMESPACE = "system-builder-golden-e2e";

export const GOLDEN_E2E = {
  organization: {
    key: `org_${GOLDEN_E2E_NAMESPACE}`,
    name: "Golden E2E Organization",
  },
  workspace: {
    key: `workspace_${GOLDEN_E2E_NAMESPACE}`,
    name: "Golden E2E Workspace",
  },
  controlWorkspace: {
    key: `workspace_${GOLDEN_E2E_NAMESPACE}_control`,
    name: "Golden E2E Control Workspace",
  },
  user: {
    email: "golden.e2e@system-builder.local",
    name: "Golden E2E Test User",
  },
  module: {
    key: `module_operations_${GOLDEN_E2E_NAMESPACE}`,
    name: "Operations Module (Golden E2E)",
  },
  capabilities: [
    {
      key: `capability_process_intake_${GOLDEN_E2E_NAMESPACE}`,
      name: "Process Intake",
      description: "Capability for taking in processes",
    },
    {
      key: `capability_process_triage_${GOLDEN_E2E_NAMESPACE}`,
      name: "Process Triage",
      description: "Capability for triaging processes",
    },
    {
      key: `capability_process_execution_${GOLDEN_E2E_NAMESPACE}`,
      name: "Process Execution",
      description: "Capability for executing processes",
    },
    {
      key: `capability_process_audit_${GOLDEN_E2E_NAMESPACE}`,
      name: "Process Audit",
      description: "Capability for auditing processes",
    },
  ],
  candidate: {
    name: "Atendimento Técnico Golden E2E",
    description: "Candidate integration test for Golden E2E",
  },
  nodes: {
    intake: { id: "intake", type: "start", label: "Intake" },
    triage: { id: "triage", type: "action", label: "Triage" },
    in_progress: { id: "in_progress", type: "action", label: "In Progress" },
    waiting_customer: { id: "waiting_customer", type: "action", label: "Waiting Customer" },
    resolved: { id: "resolved", type: "action", label: "Resolved" },
    closed: { id: "closed", type: "end", label: "Closed" },
  },
  edges: [
    { id: "e-intake-triage", source: "intake", target: "triage" },
    { id: "e-triage-in_progress", source: "triage", target: "in_progress" },
    { id: "e-in_progress-resolved", source: "in_progress", target: "resolved" },
    { id: "e-in_progress-waiting_customer", source: "in_progress", target: "waiting_customer" },
    { id: "e-waiting_customer-in_progress", source: "waiting_customer", target: "in_progress" },
    { id: "e-resolved-closed", source: "resolved", target: "closed" },
  ],
};
