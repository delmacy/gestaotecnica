export type AsIsDataConfidence = 'low' | 'medium' | 'high' | 'unknown' | 'conflicting';

export type AsIsDataSourceMode = 'synthetic' | 'mock' | 'real_pending' | 'real_blocked' | 'mixed' | 'future_real_validation';

export type AsIsValidationStatus = 'not_reviewed' | 'synthetic_only' | 'partially_supported' | 'needs_real_validation' | 'accepted_as_demo' | 'blocked_real_sources' | 'future_validation';

export type AsIsStepType = 'intake' | 'triage' | 'decision' | 'assignment' | 'execution' | 'handoff' | 'approval' | 'documentation' | 'notification' | 'closure' | 'exception';

export interface AsIsActorRole {
  id: string;
  name: string; // e.g., 'Requester', 'Dispatcher', 'Technician', 'Supervisor'
  type: 'internal' | 'external' | 'system';
}

export interface AsIsDataPoint {
  id: string;
  name: string;
  type: 'document' | 'data_field' | 'physical_item' | 'verbal';
  description?: string;
}

export interface AsIsTouchpoint {
  id: string;
  name: string;
  type: 'system' | 'spreadsheet' | 'paper' | 'chat' | 'other';
  description?: string;
}

export interface AsIsEvidenceLink {
  id: string;
  title: string;
  url?: string;
  type: 'screenshot' | 'document' | 'interview_quote' | 'observation_note';
}

export interface AsIsGapOverlay {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AsIsRiskFlag {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
}

export interface AsIsCapabilityCandidate {
  id: string;
  capability_key: string; // e.g., 'requests', 'work_orders'
  reasoning: string;
}

export interface AsIsHandoff {
  id: string;
  from_role_id: string;
  to_role_id: string;
  method: string; // e.g., 'Verbal', 'WhatsApp', 'System Assignment'
  artifacts_passed: string[]; // IDs de inputs/outputs
}

export interface AsIsProcessStep {
  id: string;
  sequence: number;
  title: string;
  description: string;
  step_type: AsIsStepType;
  actor_role: string; // ID of AsIsActorRole
  input_refs: string[]; // IDs of AsIsDataPoint (inputs)
  output_refs: string[]; // IDs of AsIsDataPoint (outputs)
  system_touchpoints: AsIsTouchpoint[];
  document_touchpoints: AsIsTouchpoint[];
  evidence_refs: AsIsEvidenceLink[];
  gap_refs: AsIsGapOverlay[];
  risk_flags: AsIsRiskFlag[];
  capability_candidates: AsIsCapabilityCandidate[];
  data_source_mode: AsIsDataSourceMode;
  confidence: AsIsDataConfidence;
  validation_status: AsIsValidationStatus;
  synthetic: boolean;
  notes?: string;
}

export interface AsIsProcessMirror {
  id: string;
  title: string;
  slug: string;
  description: string;
  process_area: string;
  data_source_mode: AsIsDataSourceMode;
  validation_status: AsIsValidationStatus;
  confidence: AsIsDataConfidence;
  steps: AsIsProcessStep[];
  handoffs: AsIsHandoff[];
  gap_overlays: AsIsGapOverlay[];
  capability_candidates: AsIsCapabilityCandidate[];
  related_sources: string[];
  related_evidence: string[];
  related_observations: string[];
  related_docs: string[];
  synthetic: boolean;
  notes?: string;
}
