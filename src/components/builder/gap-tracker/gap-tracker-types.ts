export type GapType =
  | 'missing_source'
  | 'missing_evidence'
  | 'missing_consent'
  | 'missing_validation'
  | 'conflicting_sources'
  | 'ambiguous_owner'
  | 'unclear_process_step'
  | 'unknown_legacy_field'
  | 'unconfirmed_rule'
  | 'privacy_risk';

export type GapSeverity = 'low' | 'medium' | 'high' | 'critical';
export type GapImpact = 'low' | 'medium' | 'high' | 'blocking';
export type GapStatus =
  | 'open'
  | 'pending_source'
  | 'pending_review'
  | 'reviewed_synthetic'
  | 'blocked_real_source'
  | 'accepted_for_demo'
  | 'deferred'
  | 'closed_synthetic';

export type DataSourceMode =
  | 'synthetic'
  | 'mock'
  | 'real_pending'
  | 'real_blocked'
  | 'mixed'
  | 'future_real_validation';

export type GapReviewDecision =
  | 'not_reviewed'
  | 'synthetic_only'
  | 'usable_for_demo'
  | 'needs_real_source'
  | 'needs_validation'
  | 'blocked'
  | 'deferred';

export interface GapSourceRequirement {
  id: string;
  name: string;
  description: string;
  system?: string;
}

export interface GapEvidenceRequirement {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface GapRelation {
  id: string;
  type: 'observation' | 'capability';
  title: string;
}

export interface ProcessGap {
  id: string;
  pilot_id: string;
  title: string;
  description: string;
  gap_type: GapType;
  severity: GapSeverity;
  impact: GapImpact;
  status: GapStatus;
  data_source_mode: DataSourceMode;
  owner_role: string;
  required_sources: GapSourceRequirement[];
  missing_evidence: GapEvidenceRequirement[];
  related_observations: GapRelation[];
  related_capabilities: GapRelation[];
  risk_if_missing: string;
  next_action: string;
  review_decision: GapReviewDecision;
  synthetic: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}
