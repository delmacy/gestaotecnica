export type PilotStatus = 'draft' | 'collecting' | 'needs_validation' | 'validated_synthetic' | 'blocked_real_sources' | 'ready_for_capability_mapping' | 'future_real_validation';
export type DataSourceMode = 'synthetic' | 'mock' | 'real_pending' | 'real_anonymized' | 'real_blocked' | 'mixed';
export type SourceType = 'message' | 'spreadsheet' | 'screenshot' | 'interview' | 'document' | 'system_export' | 'manual_note';
export type EvidenceStrength = 'weak' | 'medium' | 'strong';

export interface SourceInventoryItem {
  id: string;
  type: SourceType;
  description: string;
  status: string;
}

export interface Observation {
  id: string;
  actor: string;
  action: string;
  system: string;
  notes?: string;
}

export interface EvidenceItem {
  id: string;
  observationId: string;
  sourceId: string;
  strength: EvidenceStrength;
  description: string;
}

export interface CollectionGap {
  id: string;
  type: string;
  description: string;
  status: 'open' | 'reviewed' | 'closed';
}

export interface AsIsMirrorDraft {
  summary: string;
  keySteps: string[];
}

export interface ValidationDecision {
  status: 'not_reviewed' | 'synthetic_only' | 'needs_real_sources' | 'accepted_as_demo' | 'blocked';
  notes: string;
}

export interface CapabilityCandidate {
  id: string;
  name: string;
  justification: string;
}

export interface ProcessPilot {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: PilotStatus;
  data_source_mode: DataSourceMode;
  workspace_label: string;
  process_area: string;
  personas: string[];
  source_inventory: SourceInventoryItem[];
  observations: Observation[];
  evidence_items: EvidenceItem[];
  collection_gaps: CollectionGap[];
  as_is_summary: AsIsMirrorDraft;
  validation_decision: ValidationDecision;
  capability_candidates: CapabilityCandidate[];
  related_docs: string[];
  synthetic: boolean;
  notes: string;
}
