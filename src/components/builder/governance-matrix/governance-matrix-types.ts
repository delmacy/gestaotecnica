export type GovernanceRoleType = 'platform_superuser' | 'platform_builder' | 'platform_admin' | 'workspace_owner' | 'workspace_admin' | 'manager' | 'supervisor' | 'operator' | 'technician' | 'requester' | 'viewer' | 'automation_actor_placeholder' | 'external_actor_placeholder';

export type GovernanceResourceType = 'platform' | 'workspace' | 'capability' | 'process' | 'form' | 'view' | 'workflow' | 'record' | 'document' | 'evidence' | 'report' | 'integration_placeholder';

export type GovernanceAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'assign' | 'execute_placeholder' | 'publish_placeholder' | 'configure' | 'manage_users_placeholder' | 'export_placeholder' | 'audit';

export type GovernancePermissionEffect = 'allowed' | 'denied' | 'conditional' | 'approval_required' | 'not_defined' | 'future_policy';

export type GovernanceScopeType = 'global' | 'platform' | 'workspace' | 'team' | 'own_records' | 'assigned_records' | 'process_instance' | 'capability' | 'future_dynamic_scope';

export type GovernanceDataSourceMode = 'synthetic' | 'mock' | 'existing_profile_reference' | 'real_pending' | 'real_blocked' | 'future_real_validation';

export type GovernanceReadinessStatus = 'draft' | 'mock_ready' | 'needs_validation' | 'ready_for_demo' | 'blocked_real_rbac' | 'future_enforcement';

export interface GovernanceMatrix {
  id: string;
  name: string;
  slug: string;
  description: string;
  governance_area: string;
  data_source_mode: GovernanceDataSourceMode;
  readiness_status: GovernanceReadinessStatus;
  roles: GovernanceRole[];
  resources: GovernanceResource[];
  actions: GovernanceAction[];
  permissions: GovernancePermission[];
  approval_rules: GovernanceApprovalRule[];
  segregation_rules: GovernanceSegregationRule[];
  conflicts: GovernanceConflict[];
  warnings: GovernanceWarning[];
  bindings: GovernanceBinding[];
  audit_expectations: GovernanceAuditExpectation[];
  related_forms: string[];
  related_views: string[];
  related_workflows: string[];
  related_capabilities: string[];
  synthetic: boolean;
  notes: string;
}

export interface GovernanceRole {
  id: string;
  key: string;
  label: string;
  description: string;
  role_type: GovernanceRoleType;
  scope: GovernanceScopeType;
  inherits_from?: string;
  permission_refs: string[];
  approval_rule_refs: string[];
  segregation_rule_refs: string[];
  data_source_mode: GovernanceDataSourceMode;
  readiness_status: GovernanceReadinessStatus;
  synthetic: boolean;
  notes: string;
}

export interface GovernanceResource {
  id: string;
  key: string;
  name: string;
  resource_type: GovernanceResourceType;
}

export interface GovernancePermission {
  id: string;
  roleId: string;
  resourceId: string;
  action: GovernanceAction;
  effect: GovernancePermissionEffect;
  scope?: GovernanceScopeType;
}

export interface GovernanceApprovalRule {
  id: string;
  description: string;
  required_role: GovernanceRoleType;
}

export interface GovernanceSegregationRule {
  id: string;
  description: string;
  role_a: string; // role key
  role_b: string; // role key
}

export interface GovernanceConflict {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface GovernanceWarning {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error';
}

export interface GovernanceBinding {
  id: string;
  type: 'form' | 'view' | 'workflow';
  target_id: string;
  description: string;
}

export interface GovernanceAuditExpectation {
  id: string;
  action: GovernanceAction;
  expected_data: string;
}
