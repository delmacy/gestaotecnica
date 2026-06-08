import { AgentProcessCandidatePayload } from "../contracts/agent-payload.contract";

export const mockValidCanonicalPayload: AgentProcessCandidatePayload = {
  workspaceId: "00000000-0000-0000-0000-000000000000",
  name: "Employee Onboarding",
  description: "A standard employee onboarding process.",
  agent: {
    source: "n8n",
    type: "observation_agent",
    name: "HR Bot",
    version: "1.0.0",
  },
  proposal: {
    justification: "Observed repeating patterns in Slack #hr channel.",
    confidenceScore: 0.95,
    proposedDefinition: {
      nodes: [{ id: "1", type: "start" }, { id: "2", type: "task" }],
      edges: [{ source: "1", target: "2" }],
    },
    suggestedStates: [
      { key: "new", label: "New", order: 1 },
      { key: "in_progress", label: "In Progress", order: 2 },
    ],
    suggestedForms: [
      {
        key: "employee_info",
        title: "Employee Information",
        fields: [
          { key: "name", label: "Full Name", type: "text", required: true },
          { key: "start_date", label: "Start Date", type: "date", required: true },
        ],
      },
    ],
  },
  evidence: {
    summary: "Found 15 onboarding requests this month.",
    observedSignals: [
      {
        source: "slack",
        summary: "User requested onboarding checklist.",
        occurredAt: new Date().toISOString(),
      },
    ],
  },
};

export const mockMinimalCanonicalPayload: AgentProcessCandidatePayload = {
  workspaceId: "00000000-0000-0000-0000-000000000000",
  name: "Simple Approval",
  agent: {
    source: "manual_api",
    type: "unknown",
  },
  proposal: {
    justification: "Requested by user via API.",
    proposedDefinition: {},
  },
  evidence: {},
};

export const mockLegacyPayload = {
  workspaceId: "00000000-0000-0000-0000-000000000000",
  name: "Legacy Process",
  description: "Created via old API.",
  proposedDefinition: { nodes: [] },
  evidence: { source: "legacy" },
};

export const mockInvalidPayloadMissingWorkspaceId = {
  name: "No Workspace",
  agent: { source: "n8n", type: "unknown" },
  proposal: { justification: "test", proposedDefinition: {} },
  evidence: {},
};

export const mockInvalidPayloadMissingJustification = {
  workspaceId: "00000000-0000-0000-0000-000000000000",
  name: "No Justification",
  agent: { source: "n8n", type: "unknown" },
  proposal: { proposedDefinition: {} },
  evidence: {},
};

export const mockInvalidPayloadConfidenceScore = {
  workspaceId: "00000000-0000-0000-0000-000000000000",
  name: "Bad Score",
  agent: { source: "n8n", type: "unknown" },
  proposal: { justification: "test", confidenceScore: 1.5, proposedDefinition: {} },
  evidence: {},
};

export const mockInvalidPayloadTooManyStates = {
  workspaceId: "00000000-0000-0000-0000-000000000000",
  name: "Too Many States",
  agent: { source: "n8n", type: "unknown" },
  proposal: {
    justification: "test",
    proposedDefinition: {},
    suggestedStates: Array.from({ length: 35 }).map((_, i) => ({
      key: `state_${i}`,
      label: `State ${i}`,
    })),
  },
  evidence: {},
};

export const mockInvalidPayloadTryingToControlStatus = {
  workspaceId: "00000000-0000-0000-0000-000000000000",
  name: "Hacker Bot",
  status: "published", // Should be ignored or rejected
  agent: { source: "n8n", type: "unknown" },
  proposal: { justification: "test", proposedDefinition: {} },
  evidence: {},
};
