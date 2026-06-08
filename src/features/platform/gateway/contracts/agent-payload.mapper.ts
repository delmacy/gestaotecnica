import { AgentCandidateSubmission } from "../agent-gateway.service";
import { AgentProcessCandidatePayload } from "./agent-payload.contract";

export function mapAgentPayloadToCandidateInput(
  payload: AgentProcessCandidatePayload
): AgentCandidateSubmission {
  const description = payload.description
    ? `${payload.description}\n\nJustification: ${payload.proposal.justification}`
    : `Justification: ${payload.proposal.justification}`;

  const evidence: Record<string, unknown> = {
    ...payload.evidence.raw,
    agent: {
      source: payload.agent.source,
      type: payload.agent.type,
      name: payload.agent.name,
      version: payload.agent.version,
    },
    proposal: {
      confidenceScore: payload.proposal.confidenceScore,
      suggestedStates: payload.proposal.suggestedStates,
      suggestedForms: payload.proposal.suggestedForms,
    },
    summary: payload.evidence.summary,
    observedSignals: payload.evidence.observedSignals,
    attachments: payload.evidence.attachments,
    metadata: payload.metadata,
  };

  return {
    workspaceId: payload.workspaceId,
    name: payload.name,
    description,
    proposedDefinition: payload.proposal.proposedDefinition,
    evidence,
  };
}

export function mapLegacyPayloadToCandidateInput(
  payload: {
    workspaceId: string;
    name: string;
    description?: string;
    proposedDefinition?: Record<string, unknown>;
    evidence?: Record<string, unknown>;
  }
): AgentCandidateSubmission {
  return {
    workspaceId: payload.workspaceId,
    name: payload.name,
    description: payload.description,
    proposedDefinition: payload.proposedDefinition || {},
    evidence: payload.evidence || {},
  };
}
