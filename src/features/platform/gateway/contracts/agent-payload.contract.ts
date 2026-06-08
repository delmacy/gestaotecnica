export type AgentSuggestedState = {
  key: string;
  label: string;
  description?: string;
  order?: number;
};

export type AgentSuggestedFormField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select" | "checkbox" | "file" | "unknown";
  required?: boolean;
  options?: string[];
};

export type AgentSuggestedForm = {
  key: string;
  title: string;
  fields: AgentSuggestedFormField[];
};

export type AgentObservedSignal = {
  source: string;
  summary: string;
  occurredAt?: string;
  reference?: string;
};

export type AgentEvidenceAttachment = {
  name: string;
  url?: string;
  mimeType?: string;
  description?: string;
};

export type AgentProcessCandidatePayload = {
  workspaceId: string;
  name: string;
  description?: string;

  agent: {
    source: "paperclip" | "n8n" | "manual_api" | "unknown";
    type: "process_builder" | "form_builder" | "observation_agent" | "unknown";
    name?: string;
    version?: string;
  };

  proposal: {
    justification: string;
    confidenceScore?: number;
    proposedDefinition: Record<string, unknown>;
    suggestedStates?: AgentSuggestedState[];
    suggestedForms?: AgentSuggestedForm[];
  };

  evidence: {
    summary?: string;
    observedSignals?: AgentObservedSignal[];
    attachments?: AgentEvidenceAttachment[];
    raw?: Record<string, unknown>;
  };

  metadata?: {
    externalReference?: string;
    submittedAt?: string;
    tags?: string[];
  };
};
