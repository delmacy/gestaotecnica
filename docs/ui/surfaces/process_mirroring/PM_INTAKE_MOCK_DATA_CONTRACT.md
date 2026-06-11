# Mock Data Contract: Process Mirroring Intake

## Tipos conceituais
- ProcessPilot
- PilotStatus
- DataSourceMode
- SourceInventoryItem
- SourceType
- ConsentStatus
- Observation
- EvidenceItem
- EvidenceStrength
- CollectionGap
- AsIsMirrorDraft
- ValidationDecision
- CapabilityCandidate

## Campos mínimos de ProcessPilot
- id (string)
- name (string)
- slug (string)
- description (string)
- status (PilotStatus)
- data_source_mode (DataSourceMode)
- workspace_label (string)
- process_area (string)
- personas (string[])
- source_inventory (SourceInventoryItem[])
- observations (Observation[])
- evidence_items (EvidenceItem[])
- collection_gaps (CollectionGap[])
- as_is_summary (AsIsMirrorDraft)
- validation_decision (ValidationDecision)
- capability_candidates (CapabilityCandidate[])
- related_docs (string[])
- synthetic (boolean)
- notes (string)

## Status sugeridos
- draft
- collecting
- needs_validation
- validated_synthetic
- blocked_real_sources
- ready_for_capability_mapping
- future_real_validation

## Data source modes
- synthetic
- mock
- real_pending
- real_anonymized
- real_blocked
- mixed

## Source types
- message
- spreadsheet
- screenshot
- interview
- document
- system_export
- manual_note

## Validation decision
- not_reviewed
- synthetic_only
- needs_real_sources
- accepted_as_demo
- blocked
