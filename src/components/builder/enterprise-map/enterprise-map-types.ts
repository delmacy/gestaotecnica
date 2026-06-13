export type NodeType = 'domain' | 'capability' | 'process' | 'process_step' | 'value_stream' | 'system' | 'application' | 'data_object' | 'document' | 'actor_role' | 'owner_placeholder' | 'integration_placeholder' | 'risk' | 'gap' | 'evidence' | 'governance_rule';
export type EdgeType = 'contains' | 'supports' | 'executes' | 'participates_in' | 'produces' | 'consumes' | 'depends_on' | 'integrates_with' | 'governed_by' | 'evidenced_by' | 'has_risk' | 'has_gap' | 'precedes' | 'hands_off_to' | 'uses_form' | 'uses_view' | 'uses_workflow';
export type PerspectiveType = 'process' | 'capability' | 'value_stream' | 'systems' | 'data' | 'people' | 'risk_gap' | 'evidence';
export type ReadinessStatus = 'draft' | 'mock_ready' | 'needs_validation' | 'ready_for_demo' | 'blocked_real_sources' | 'future_workspace_map';
export type DataSourceMode = 'synthetic' | 'mock' | 'contract_reference' | 'real_pending' | 'real_blocked' | 'future_real_validation';
export type Criticality = 'informational' | 'low' | 'medium' | 'high' | 'critical_placeholder';

export interface EnterpriseMapNodeData extends Record<string, unknown> {
  id: string;
  label: string;
  type: NodeType;
  description: string;
  domainRef?: string;
  status?: string;
  dataSourceMode: DataSourceMode;
  readinessStatus: ReadinessStatus;
  synthetic: boolean;
  notes?: string;
}

export interface EnterpriseMapNode {
  id: string;
  type: 'customNode';
  position: { x: number; y: number };
  data: EnterpriseMapNodeData;
}

export interface EnterpriseMapEdgeData extends Record<string, unknown> {
  id: string;
  type: EdgeType;
  label?: string;
  direction?: string;
  criticality: Criticality;
  dataSourceMode: DataSourceMode;
  readinessStatus: ReadinessStatus;
  synthetic: boolean;
  notes?: string;
}

export interface EnterpriseMapEdge {
  id: string;
  source: string;
  target: string;
  type?: 'customEdge' | 'default' | 'straight' | 'step' | 'smoothstep';
  animated?: boolean;
  data?: EnterpriseMapEdgeData;
}

export interface EnterpriseMapBlueprint {
  id: string;
  name: string;
  description: string;
  mapScope: string;
  dataSourceMode: DataSourceMode;
  readinessStatus: ReadinessStatus;
  nodes: EnterpriseMapNode[];
  edges: EnterpriseMapEdge[];
  synthetic: boolean;
}
