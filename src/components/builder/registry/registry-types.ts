export type RegistryItemType =
  | 'capability'
  | 'action'
  | 'dependency_rule'
  | 'capability_model'
  | 'entity_model'
  | 'process_model'
  | 'view_contract'
  | 'decision'
  | 'document_contract';

export type RegistryItemStatus =
  | 'documented'
  | 'needs_review'
  | 'ready_for_design'
  | 'future'
  | 'blocked';

export type RegistryRisk = 'low' | 'medium' | 'high' | 'critical';

export interface RegistryDocumentLink {
  url: string;
  label: string;
}

export interface RegistryItem {
  id: string;
  name: string;
  slug: string;
  type: RegistryItemType;
  description: string;
  status: RegistryItemStatus;
  source_document?: string;
  related_capability?: string;
  depends_on: string[];
  used_by: string[];
  rules: string[];
  document_links: RegistryDocumentLink[];
  risk_level: RegistryRisk;
  notes?: string;
  synthetic: boolean;
}
