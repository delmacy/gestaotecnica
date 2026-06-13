import { WorkflowBlueprint, WorkflowNode, WorkflowTransition } from "./workflow-builder-types";

// Helper to generate some nodes
const generateNodes = (count: number, prefix: string): WorkflowNode[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `node-${prefix}-${i}`,
    type: i === 0 ? "trigger" : i === count - 1 ? "end" : "action",
    label: `Node ${prefix} ${i}`,
    x: 100 + (i * 150),
    y: 200,
    bindings: [
      { id: `b1-${i}`, type: "role", targetId: "role-1", targetName: "Technician" },
      { id: `b2-${i}`, type: "form", targetId: "form-1", targetName: "Intake Form" },
      { id: `b3-${i}`, type: "view", targetId: "view-1", targetName: "Summary View" },
      { id: `b4-${i}`, type: "capability", targetId: "cap-1", targetName: "Work Orders" }
    ],
    actions: [
      { id: `a1-${i}`, name: "Send Notification" },
      { id: `a2-${i}`, name: "Update Status" },
      { id: `a3-${i}`, name: "Log Audit" },
      { id: `a4-${i}`, name: "Trigger Webhook" }
    ],
    conditions: [
      { id: `c1-${i}`, expression: "status == 'open'" },
      { id: `c2-${i}`, expression: "priority == 'high'" },
      { id: `c3-${i}`, expression: "user.role == 'admin'" },
      { id: `c4-${i}`, expression: "amount > 100" }
    ],
    warnings: [
      { id: `w1-${i}`, severity: "warning", type: "real_pending", message: "Real sources pending validation" },
      { id: `w2-${i}`, severity: "error", type: "real_blocked", message: "Blocked by lack of real data" },
      { id: `w3-${i}`, severity: "info", type: "best_practice", message: "Consider adding a fallback action" }
    ]
  }));
};

const generateTransitions = (nodes: WorkflowNode[]): WorkflowTransition[] => {
  const transitions: WorkflowTransition[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    transitions.push({
      id: `trans-${nodes[i].id}-${nodes[i+1].id}`,
      sourceId: nodes[i].id,
      targetId: nodes[i+1].id,
      label: `Go to ${i+1}`
    });
  }
  return transitions;
};

const technicalServiceNodes = generateNodes(8, "ts");
export const technicalServiceIntake: WorkflowBlueprint = {
  id: "bp-technical-service",
  name: "Technical Service Intake Workflow — Synthetic",
  description: "synthetic demo. not runtime workflow. not persisted. no real automation. real sources pending.",
  nodes: technicalServiceNodes,
  transitions: generateTransitions(technicalServiceNodes),
  readinessStatus: "needs_validation"
};

const clinicNodes = generateNodes(8, "clinic");
export const clinicAppointmentScheduling: WorkflowBlueprint = {
  id: "bp-clinic-appointment",
  name: "Clinic Appointment Scheduling Workflow — Synthetic",
  description: "Mock workflow for clinic appointments.",
  nodes: clinicNodes,
  transitions: generateTransitions(clinicNodes),
  readinessStatus: "draft"
};

const workshopNodes = generateNodes(8, "workshop");
export const workshopRepair: WorkflowBlueprint = {
  id: "bp-workshop-repair",
  name: "Workshop Repair Workflow — Synthetic",
  description: "Mock workflow for workshop repairs.",
  nodes: workshopNodes,
  transitions: generateTransitions(workshopNodes),
  readinessStatus: "draft"
};

export const mockBlueprints = [
  technicalServiceIntake,
  clinicAppointmentScheduling,
  workshopRepair
];
