# Gap Tracker Mock Data Contract

## Tipos conceituais

- ProcessGap
- GapType
- GapSeverity
- GapImpact
- GapStatus
- DataSourceMode
- GapRisk
- GapSourceRequirement
- GapEvidenceRequirement
- GapOwnerRole
- GapNextAction
- GapReviewDecision
- GapRelation

## Campos mínimos de ProcessGap

- id
- pilot_id
- title
- description
- gap_type
- severity
- impact
- status
- data_source_mode
- owner_role
- required_sources
- missing_evidence
- related_observations
- related_capabilities
- risk_if_missing
- next_action
- review_decision
- synthetic
- notes

## Gap types

- missing_source
- missing_evidence
- missing_consent
- missing_validation
- conflicting_sources
- ambiguous_owner
- unclear_process_step
- unknown_legacy_field
- unconfirmed_rule
- privacy_risk

## Severity

- low
- medium
- high
- critical

## Impact

- low
- medium
- high
- blocking

## Status

- open
- pending_source
- pending_review
- reviewed_synthetic
- blocked_real_source
- accepted_for_demo
- deferred
- closed_synthetic

## Data source modes

- synthetic
- mock
- real_pending
- real_blocked
- mixed
- future_real_validation

## Review decision

- not_reviewed
- synthetic_only
- usable_for_demo
- needs_real_source
- needs_validation
- blocked
- deferred
