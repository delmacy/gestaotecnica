# Enterprise Map Static Schema Contract

## EnterpriseMapBlueprint
- id
- name
- slug
- description
- map_scope
- data_source_mode
- readiness_status
- layers
- nodes
- relationships
- domains
- capabilities
- processes
- value_streams
- systems
- applications
- data_objects
- documents
- actor_roles
- owner_placeholders
- integration_placeholders
- risks
- gaps
- evidence_references
- governance_references
- related_forms
- related_views
- related_workflows
- related_docs
- synthetic
- notes

## EnterpriseMapNode
- id
- key
- label
- node_type
- description
- domain_ref
- layer_refs
- position
- status
- data_source_mode
- readiness_status
- risk_refs
- gap_refs
- evidence_refs
- governance_refs
- synthetic
- notes

## EnterpriseMapRelationship
- id
- source_node_id
- target_node_id
- relationship_type
- label
- direction
- criticality
- data_source_mode
- readiness_status
- synthetic
- notes

## Node Types
domain, capability, process, process_step, value_stream, system, application, data_object, document, actor_role, owner_placeholder, integration_placeholder, risk, gap, evidence, governance_rule

## Relationship Types
contains, supports, executes, participates_in, produces, consumes, depends_on, integrates_with, governed_by, evidenced_by, has_risk, has_gap, precedes, hands_off_to, uses_form, uses_view, uses_workflow

## Data Source Modes
synthetic, mock, contract_reference, real_pending, real_blocked, future_real_validation

## Readiness
draft, mock_ready, needs_validation, ready_for_demo, blocked_real_sources, future_workspace_map

## Criticality
informational, low, medium, high, critical_placeholder
