export type CapabilityCategory =
  | 'foundation'
  | 'relationship'
  | 'work-management'
  | 'resource'
  | 'information'
  | 'control'
  | 'intelligence'
  | 'commercial'
  | 'legal';

export type CapabilityMvpPriority =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'future';

export type CapabilityStatus =
  | 'documented'
  | 'needs_review'
  | 'ready_for_design'
  | 'future'
  | 'blocked';

export type CapabilityInstallState =
  | 'available'
  | 'simulated_requested'
  | 'not_available'
  | 'future';

export type CapabilityDependency = string;

export interface CapabilityBoundary {
  type: 'overlap' | 'composition' | 'external';
  description: string;
}

export interface CapabilityDocumentLink {
  title: string;
  url: string;
}

export interface CapabilityItem {
  id: string;
  slug: string;
  name: string;
  category: CapabilityCategory;
  description: string;
  core_business: boolean;
  mvp_priority: CapabilityMvpPriority;
  status: CapabilityStatus;
  depends_on: CapabilityDependency[];
  used_by: CapabilityDependency[];
  owns_entities: string[];
  does_not_own: string[];
  main_processes: string[];
  main_events: string[];
  related_docs: CapabilityDocumentLink[];
  boundary_risk: CapabilityBoundary[];
  install_state: CapabilityInstallState;
  synthetic_notes: string;
}
