import { GovernanceMatrix, GovernanceRole, GovernanceResource, GovernancePermission, GovernanceAction, GovernancePermissionEffect } from './governance-matrix-types';

const defaultActions: GovernanceAction[] = [
  'view', 'create', 'edit', 'delete', 'approve', 'assign', 'configure', 'audit', 'manage_users_placeholder', 'export_placeholder'
];

const mockRoles1: GovernanceRole[] = [
  { id: 'r1', key: 'platform_superuser', label: 'Platform Superuser', description: 'Access everything', role_type: 'platform_superuser', scope: 'global', permission_refs: [], approval_rule_refs: [], segregation_rule_refs: [], data_source_mode: 'synthetic', readiness_status: 'mock_ready', synthetic: true, notes: '' },
  { id: 'r2', key: 'platform_builder', label: 'Platform Builder (builder)', description: 'System Builder Platform Access', role_type: 'platform_builder', scope: 'platform', permission_refs: [], approval_rule_refs: [], segregation_rule_refs: [], data_source_mode: 'existing_profile_reference', readiness_status: 'mock_ready', synthetic: true, notes: 'Reference to existing auth profile' },
  { id: 'r3', key: 'platform_admin', label: 'Platform Admin (admin)', description: 'System Administrator', role_type: 'platform_admin', scope: 'platform', permission_refs: [], approval_rule_refs: [], segregation_rule_refs: [], data_source_mode: 'existing_profile_reference', readiness_status: 'mock_ready', synthetic: true, notes: '' },
  { id: 'r4', key: 'workspace_owner', label: 'Workspace Owner', description: 'Tenant Owner', role_type: 'workspace_owner', scope: 'workspace', permission_refs: [], approval_rule_refs: [], segregation_rule_refs: [], data_source_mode: 'synthetic', readiness_status: 'mock_ready', synthetic: true, notes: '' },
  { id: 'r5', key: 'operator', label: 'Operator (operador)', description: 'Standard Operator', role_type: 'operator', scope: 'workspace', permission_refs: [], approval_rule_refs: [], segregation_rule_refs: [], data_source_mode: 'existing_profile_reference', readiness_status: 'mock_ready', synthetic: true, notes: '' },
  { id: 'r6', key: 'viewer', label: 'Viewer', description: 'Read only access', role_type: 'viewer', scope: 'workspace', permission_refs: [], approval_rule_refs: [], segregation_rule_refs: [], data_source_mode: 'synthetic', readiness_status: 'mock_ready', synthetic: true, notes: '' }
];

const mockResources1: GovernanceResource[] = [
  { id: 'res1', key: 'platform_settings', name: 'Platform Settings', resource_type: 'platform' },
  { id: 'res2', key: 'workspace_config', name: 'Workspace Config', resource_type: 'workspace' },
  { id: 'res3', key: 'capability_registry', name: 'Capability Registry', resource_type: 'capability' },
  { id: 'res4', key: 'process_blueprints', name: 'Process Blueprints', resource_type: 'process' },
  { id: 'res5', key: 'forms', name: 'Forms', resource_type: 'form' },
  { id: 'res6', key: 'views', name: 'Views', resource_type: 'view' },
  { id: 'res7', key: 'workflows', name: 'Workflows', resource_type: 'workflow' },
  { id: 'res8', key: 'audit_logs', name: 'Audit Logs', resource_type: 'report' },
];

function generatePermissions(roles: GovernanceRole[], resources: GovernanceResource[], actions: GovernanceAction[]): GovernancePermission[] {
  const permissions: GovernancePermission[] = [];
  let idCounter = 1;
  roles.forEach(role => {
    resources.forEach(resource => {
      actions.forEach(action => {
        let effect: GovernancePermissionEffect = 'not_defined';
        if (role.key === 'platform_superuser') {
          effect = 'allowed';
        } else if (role.key === 'platform_builder' && ['capability', 'process', 'form', 'view', 'workflow'].includes(resource.resource_type)) {
           effect = action === 'delete' ? 'approval_required' : 'allowed';
        } else if (role.key === 'viewer' && action !== 'view') {
           effect = 'denied';
        } else if (role.key === 'operator') {
           effect = ['view', 'create', 'edit'].includes(action) ? 'conditional' : 'denied';
        } else if (action === 'audit') {
           effect = role.key === 'platform_admin' ? 'allowed' : 'denied';
        }

        permissions.push({
          id: `p${idCounter++}`,
          roleId: role.id,
          resourceId: resource.id,
          action,
          effect,
          scope: role.scope
        });
      });
    });
  });
  return permissions;
}

export const mockMatrices: GovernanceMatrix[] = [
  {
    id: 'm1',
    name: 'System Builder Platform Governance — Synthetic',
    slug: 'sb-platform-gov',
    description: 'Governança central da plataforma System Builder.',
    governance_area: 'Platform Core',
    data_source_mode: 'mock',
    readiness_status: 'mock_ready',
    roles: mockRoles1,
    resources: mockResources1,
    actions: defaultActions,
    permissions: generatePermissions(mockRoles1, mockResources1, defaultActions),
    approval_rules: [
      { id: 'ar1', description: 'Deletion of blueprints requires Admin approval', required_role: 'platform_admin' },
      { id: 'ar2', description: 'Workspace creation requires Superuser approval', required_role: 'platform_superuser' },
      { id: 'ar3', description: 'Publishing requires Builder review', required_role: 'platform_builder' }
    ],
    segregation_rules: [
      { id: 'sr1', description: 'Builder and Operator cannot be the same user', role_a: 'platform_builder', role_b: 'operator' },
      { id: 'sr2', description: 'Admin cannot be standard Viewer', role_a: 'platform_admin', role_b: 'viewer' },
      { id: 'sr3', description: 'Owner cannot be Superuser', role_a: 'workspace_owner', role_b: 'platform_superuser' }
    ],
    conflicts: [
      { id: 'c1', description: 'Operator has conditional edit but no view on some resources', severity: 'medium' },
      { id: 'c2', description: 'Viewer has future_policy on Audit Logs', severity: 'low' },
      { id: 'c3', description: 'Builder has allowed delete without approval on Forms', severity: 'high' }
    ],
    warnings: [
      { id: 'w1', message: 'Platform Admin role is currently referencing an existing profile without real DB grants.', type: 'warning' },
      { id: 'w2', message: 'Not all actions are covered by permissions.', type: 'info' },
      { id: 'w3', message: 'Data source mode is mock. Real enforcement is blocked.', type: 'info' },
      { id: 'w4', message: 'This matrix requires real validation before demo.', type: 'error' }
    ],
    bindings: [
      { id: 'b1', type: 'form', target_id: 'form-123', description: 'Bound to Blueprint Form' },
      { id: 'b2', type: 'view', target_id: 'view-456', description: 'Bound to Dashboard View' },
      { id: 'b3', type: 'workflow', target_id: 'wf-789', description: 'Bound to Approval Workflow' },
      { id: 'b4', type: 'form', target_id: 'form-999', description: 'Bound to Settings Form' }
    ],
    audit_expectations: [
      { id: 'ae1', action: 'delete', expected_data: 'Reason for deletion' },
      { id: 'ae2', action: 'approve', expected_data: 'Approver ID and Timestamp' },
      { id: 'ae3', action: 'configure', expected_data: 'Previous and new configuration state' },
      { id: 'ae4', action: 'assign', expected_data: 'Assigned user ID' }
    ],
    related_forms: [],
    related_views: [],
    related_workflows: [],
    related_capabilities: ['organization', 'audit'],
    synthetic: true,
    notes: 'Matriz inicial com status real_pending e real_blocked.'
  },
  {
    id: 'm2',
    name: 'Technical Service Process Governance — Synthetic',
    slug: 'tech-service-gov',
    description: 'Processo de serviços técnicos (simulado).',
    governance_area: 'Technical Services',
    data_source_mode: 'real_pending',
    readiness_status: 'needs_validation',
    roles: mockRoles1.map(r => ({ ...r, id: r.id + '_2' })),
    resources: mockResources1.map(r => ({ ...r, id: r.id + '_2' })),
    actions: defaultActions,
    permissions: generatePermissions(mockRoles1.map(r => ({ ...r, id: r.id + '_2' })), mockResources1.map(r => ({ ...r, id: r.id + '_2' })), defaultActions),
    approval_rules: [{ id: 'ar4', description: 'A', required_role: 'manager' }, { id: 'ar5', description: 'B', required_role: 'supervisor' }, { id: 'ar6', description: 'C', required_role: 'operator' }],
    segregation_rules: [{ id: 'sr4', description: 'A', role_a: 'technician', role_b: 'manager' }, { id: 'sr5', description: 'B', role_a: 'supervisor', role_b: 'operator' }, { id: 'sr6', description: 'C', role_a: 'requester', role_b: 'technician' }],
    conflicts: [{ id: 'c4', description: 'A', severity: 'low' }, { id: 'c5', description: 'B', severity: 'medium' }, { id: 'c6', description: 'C', severity: 'high' }],
    warnings: [{ id: 'w5', message: 'A', type: 'info' }, { id: 'w6', message: 'B', type: 'warning' }, { id: 'w7', message: 'C', type: 'error' }, { id: 'w8', message: 'D', type: 'info' }],
    bindings: [{ id: 'b5', type: 'form', target_id: 'f1', description: 'f1' }, { id: 'b6', type: 'view', target_id: 'v1', description: 'v1' }, { id: 'b7', type: 'workflow', target_id: 'w1', description: 'w1' }, { id: 'b8', type: 'form', target_id: 'f2', description: 'f2' }],
    audit_expectations: [{ id: 'ae5', action: 'view', expected_data: '1' }, { id: 'ae6', action: 'edit', expected_data: '2' }, { id: 'ae7', action: 'create', expected_data: '3' }, { id: 'ae8', action: 'delete', expected_data: '4' }],
    related_forms: [], related_views: [], related_workflows: [], related_capabilities: [], synthetic: true, notes: ''
  },
  {
    id: 'm3',
    name: 'Clinic Appointment Process Governance — Synthetic',
    slug: 'clinic-gov',
    description: 'Processo de agendamento clínico (simulado).',
    governance_area: 'Healthcare',
    data_source_mode: 'real_blocked',
    readiness_status: 'blocked_real_rbac',
    roles: mockRoles1.map(r => ({ ...r, id: r.id + '_3' })),
    resources: mockResources1.map(r => ({ ...r, id: r.id + '_3' })),
    actions: defaultActions,
    permissions: generatePermissions(mockRoles1.map(r => ({ ...r, id: r.id + '_3' })), mockResources1.map(r => ({ ...r, id: r.id + '_3' })), defaultActions),
    approval_rules: [{ id: 'ar7', description: 'A', required_role: 'manager' }, { id: 'ar8', description: 'B', required_role: 'supervisor' }, { id: 'ar9', description: 'C', required_role: 'operator' }],
    segregation_rules: [{ id: 'sr7', description: 'A', role_a: 'technician', role_b: 'manager' }, { id: 'sr8', description: 'B', role_a: 'supervisor', role_b: 'operator' }, { id: 'sr9', description: 'C', role_a: 'requester', role_b: 'technician' }],
    conflicts: [{ id: 'c7', description: 'A', severity: 'low' }, { id: 'c8', description: 'B', severity: 'medium' }, { id: 'c9', description: 'C', severity: 'high' }],
    warnings: [{ id: 'w9', message: 'A', type: 'info' }, { id: 'w10', message: 'B', type: 'warning' }, { id: 'w11', message: 'C', type: 'error' }, { id: 'w12', message: 'D', type: 'info' }],
    bindings: [{ id: 'b9', type: 'form', target_id: 'f1', description: 'f1' }, { id: 'b10', type: 'view', target_id: 'v1', description: 'v1' }, { id: 'b11', type: 'workflow', target_id: 'w1', description: 'w1' }, { id: 'b12', type: 'form', target_id: 'f2', description: 'f2' }],
    audit_expectations: [{ id: 'ae9', action: 'view', expected_data: '1' }, { id: 'ae10', action: 'edit', expected_data: '2' }, { id: 'ae11', action: 'create', expected_data: '3' }, { id: 'ae12', action: 'delete', expected_data: '4' }],
    related_forms: [], related_views: [], related_workflows: [], related_capabilities: [], synthetic: true, notes: ''
  }
];
