export type UiContractGroup =
  | 'group_a_platform_foundation'
  | 'group_b_builder_design'
  | 'group_c_runtime_integration'
  | 'group_d_client_real';

export type UiContractImplementationStatus =
  | 'documented'
  | 'ready_for_readiness'
  | 'ready_for_dev'
  | 'implemented'
  | 'reviewed'
  | 'approved'
  | 'future'
  | 'blocked';

export type UiContractDevStatus =
  | 'not_started'
  | 'planned'
  | 'ready'
  | 'in_progress'
  | 'done'
  | 'blocked'
  | 'future';

export interface UiContractDependency {
  id: string;
  name: string;
  reason?: string;
  isBlocking: boolean;
}

export interface UiSurfaceContract {
  id: string;
  surface_id: string;
  surface_name: string;
  slug: string;
  group: UiContractGroup;
  route_candidate: string;
  purpose: string;
  persona: string | string[];
  scope: string;
  workspace_or_global: 'workspace' | 'global' | 'mixed';
  implementation_status: UiContractImplementationStatus;
  dev_status: UiContractDevStatus;
  related_capabilities: string[];
  data_inputs: string[];
  data_outputs: string[];
  commands: string[];
  frontend_risks: string | string[];
  evidence_required: string | string[];
  e2e_test_expectation: string;
  related_reviews: string[];
  related_tasks: string[];
  dependencies: UiContractDependency[];
  synthetic: boolean;
  notes: string;
}

export interface UiContractStaticIndex {
  version: string;
  lastUpdated: string;
  contracts: UiSurfaceContract[];
}
