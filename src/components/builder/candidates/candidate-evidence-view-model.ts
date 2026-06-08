export type CandidateEvidenceViewModel = {
  hasStructuredEvidence: boolean;

  agent?: {
    source?: string;
    type?: string;
    name?: string;
    version?: string;
  };

  proposal?: {
    confidenceScore?: number;
    suggestedStates?: Array<{
      key: string;
      label: string;
      description?: string;
      order?: number;
    }>;
    suggestedForms?: Array<{
      key: string;
      title: string;
      fields: Array<{
        key: string;
        label: string;
        type: string;
        required?: boolean;
        options?: string[];
      }>;
    }>;
  };

  summary?: string;

  observedSignals?: Array<{
    source: string;
    summary: string;
    occurredAt?: string;
    reference?: string;
  }>;

  attachments?: Array<{
    name: string;
    url?: string;
    mimeType?: string;
    description?: string;
  }>;

  metadata?: {
    externalReference?: string;
    submittedAt?: string;
    tags?: string[];
  };

  raw: Record<string, unknown>;
};

export function parseCandidateEvidence(evidence: Record<string, unknown> | null | undefined): CandidateEvidenceViewModel {
  const raw = evidence || {};
  const hasStructuredEvidence = 'agent' in raw || 'proposal' in raw || 'observedSignals' in raw || 'attachments' in raw || 'metadata' in raw;

  const getObj = (key: string): Record<string, unknown> | undefined => {
    return raw[key] && typeof raw[key] === 'object' && !Array.isArray(raw[key]) ? raw[key] as Record<string, unknown> : undefined;
  };

  const getArray = (key: string): unknown[] | undefined => {
    return raw[key] && Array.isArray(raw[key]) ? raw[key] as unknown[] : undefined;
  };

  const getString = (obj: Record<string, unknown> | undefined, key: string): string | undefined => {
    return typeof obj?.[key] === 'string' ? obj[key] as string : undefined;
  };

  const getNumber = (obj: Record<string, unknown> | undefined, key: string): number | undefined => {
    return typeof obj?.[key] === 'number' ? obj[key] as number : undefined;
  };

  const getBoolean = (obj: Record<string, unknown> | undefined, key: string): boolean | undefined => {
      return typeof obj?.[key] === 'boolean' ? obj[key] as boolean : undefined;
  };

  const agentObj = getObj('agent');
  const proposalObj = getObj('proposal');
  const metadataObj = getObj('metadata');
  const observedSignalsArr = getArray('observedSignals');
  const attachmentsArr = getArray('attachments');

  const model: CandidateEvidenceViewModel = {
    hasStructuredEvidence,
    raw,
  };

  if (agentObj) {
    model.agent = {
      source: getString(agentObj, 'source'),
      type: getString(agentObj, 'type'),
      name: getString(agentObj, 'name'),
      version: getString(agentObj, 'version'),
    };
  }

  if (proposalObj) {
    model.proposal = {
      confidenceScore: getNumber(proposalObj, 'confidenceScore'),
    };

    const suggestedStates = proposalObj.suggestedStates;
    if (Array.isArray(suggestedStates)) {
      const validStates = suggestedStates.filter((s): s is Record<string, unknown> => typeof s === 'object' && s !== null && typeof s.key === 'string' && typeof s.label === 'string');
      if (validStates.length > 0) {
        model.proposal.suggestedStates = validStates.map(s => ({
          key: getString(s, 'key') as string,
          label: getString(s, 'label') as string,
          description: getString(s, 'description'),
          order: getNumber(s, 'order'),
        }));
      }
    }

    const suggestedForms = proposalObj.suggestedForms;
    if (Array.isArray(suggestedForms)) {
      const validForms = suggestedForms.filter((f): f is Record<string, unknown> => typeof f === 'object' && f !== null && typeof f.key === 'string' && typeof f.title === 'string');
      if (validForms.length > 0) {
        model.proposal.suggestedForms = validForms.map(f => {
            const fieldsArr = Array.isArray(f.fields) ? f.fields : [];
            const validFields = fieldsArr.filter((field): field is Record<string, unknown> => typeof field === 'object' && field !== null && typeof field.key === 'string' && typeof field.label === 'string' && typeof field.type === 'string');
            return {
                key: getString(f, 'key') as string,
                title: getString(f, 'title') as string,
                fields: validFields.map(field => ({
                    key: getString(field, 'key') as string,
                    label: getString(field, 'label') as string,
                    type: getString(field, 'type') as string,
                    required: getBoolean(field, 'required'),
                    options: Array.isArray(field.options) ? field.options.filter(o => typeof o === 'string') as string[] : undefined,
                }))
            };
        });
      }
    }
  }

  model.summary = typeof raw.summary === 'string' ? raw.summary : undefined;

  if (observedSignalsArr) {
    const validSignals = observedSignalsArr.filter((s): s is Record<string, unknown> => typeof s === 'object' && s !== null && typeof (s as Record<string, unknown>).source === 'string' && typeof (s as Record<string, unknown>).summary === 'string');
    if (validSignals.length > 0) {
      model.observedSignals = validSignals.map(s => ({
        source: getString(s, 'source') as string,
        summary: getString(s, 'summary') as string,
        occurredAt: getString(s, 'occurredAt'),
        reference: getString(s, 'reference'),
      }));
    }
  }

  if (attachmentsArr) {
    const validAttachments = attachmentsArr.filter((a): a is Record<string, unknown> => typeof a === 'object' && a !== null && typeof (a as Record<string, unknown>).name === 'string');
    if (validAttachments.length > 0) {
      model.attachments = validAttachments.map(a => ({
        name: getString(a, 'name') as string,
        url: getString(a, 'url'),
        mimeType: getString(a, 'mimeType'),
        description: getString(a, 'description'),
      }));
    }
  }

  if (metadataObj) {
    model.metadata = {
      externalReference: getString(metadataObj, 'externalReference'),
      submittedAt: getString(metadataObj, 'submittedAt'),
      tags: Array.isArray(metadataObj.tags) ? metadataObj.tags.filter(t => typeof t === 'string') as string[] : undefined,
    };
  }

  return model;
}
