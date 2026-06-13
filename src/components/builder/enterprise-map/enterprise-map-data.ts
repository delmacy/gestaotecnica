import { EnterpriseMapBlueprint, EnterpriseMapNode, EnterpriseMapEdge } from './enterprise-map-types';

const defaultNodeData = {
  dataSourceMode: 'synthetic' as const,
  readinessStatus: 'mock_ready' as const,
  synthetic: true,
};

const defaultEdgeData = {
  dataSourceMode: 'synthetic' as const,
  readinessStatus: 'mock_ready' as const,
  synthetic: true,
};

function createMockNodesAndEdges() {
  const nodes: EnterpriseMapNode[] = [
    // Domains
    { id: 'd1', type: 'customNode', position: { x: 100, y: 100 }, data: { ...defaultNodeData, id: 'd1', label: 'Core Operations', type: 'domain', description: 'Core Operations Domain' } },
    { id: 'd2', type: 'customNode', position: { x: 400, y: 100 }, data: { ...defaultNodeData, id: 'd2', label: 'Support Services', type: 'domain', description: 'Support Services Domain' } },
    { id: 'd3', type: 'customNode', position: { x: 700, y: 100 }, data: { ...defaultNodeData, id: 'd3', label: 'Governance', type: 'domain', description: 'Governance Domain' } },

    // Capabilities
    { id: 'c1', type: 'customNode', position: { x: 100, y: 250 }, data: { ...defaultNodeData, id: 'c1', label: 'Service Intake', type: 'capability', description: 'Intake Capability' } },
    { id: 'c2', type: 'customNode', position: { x: 250, y: 250 }, data: { ...defaultNodeData, id: 'c2', label: 'Triage', type: 'capability', description: 'Triage Capability' } },
    { id: 'c3', type: 'customNode', position: { x: 400, y: 250 }, data: { ...defaultNodeData, id: 'c3', label: 'Assignment', type: 'capability', description: 'Assignment Capability' } },
    { id: 'c4', type: 'customNode', position: { x: 550, y: 250 }, data: { ...defaultNodeData, id: 'c4', label: 'Execution', type: 'capability', description: 'Execution Capability' } },
    { id: 'c5', type: 'customNode', position: { x: 700, y: 250 }, data: { ...defaultNodeData, id: 'c5', label: 'Validation', type: 'capability', description: 'Validation Capability' } },
    { id: 'c6', type: 'customNode', position: { x: 850, y: 250 }, data: { ...defaultNodeData, id: 'c6', label: 'Closure', type: 'capability', description: 'Closure Capability' } },

    // Processes
    { id: 'p1', type: 'customNode', position: { x: 100, y: 400 }, data: { ...defaultNodeData, id: 'p1', label: 'Technical Service Intake', type: 'process', description: 'Process for technical service' } },
    { id: 'p2', type: 'customNode', position: { x: 300, y: 400 }, data: { ...defaultNodeData, id: 'p2', label: 'Issue Resolution', type: 'process', description: 'Issue resolution process' } },
    { id: 'p3', type: 'customNode', position: { x: 500, y: 400 }, data: { ...defaultNodeData, id: 'p3', label: 'Audit Follow-up', type: 'process', description: 'Audit process' } },
    { id: 'p4', type: 'customNode', position: { x: 700, y: 400 }, data: { ...defaultNodeData, id: 'p4', label: 'Asset Management', type: 'process', description: 'Asset process' } },

    // Value Stream
    { id: 'vs1', type: 'customNode', position: { x: 400, y: 50 }, data: { ...defaultNodeData, id: 'vs1', label: 'Idea to Value', type: 'value_stream', description: 'Main value stream' } },

    // Systems & Apps
    { id: 's1', type: 'customNode', position: { x: 100, y: 550 }, data: { ...defaultNodeData, id: 's1', label: 'ERP System', type: 'system', description: 'Core ERP' } },
    { id: 's2', type: 'customNode', position: { x: 300, y: 550 }, data: { ...defaultNodeData, id: 's2', label: 'CRM', type: 'system', description: 'Customer portal' } },
    { id: 'a1', type: 'customNode', position: { x: 500, y: 550 }, data: { ...defaultNodeData, id: 'a1', label: 'Mobile App', type: 'application', description: 'Field app' } },

    // Data Objects & Documents
    { id: 'do1', type: 'customNode', position: { x: 100, y: 700 }, data: { ...defaultNodeData, id: 'do1', label: 'Work Request', type: 'data_object', description: 'WR Data' } },
    { id: 'do2', type: 'customNode', position: { x: 250, y: 700 }, data: { ...defaultNodeData, id: 'do2', label: 'Technical Record', type: 'data_object', description: 'TR Data' } },
    { id: 'do3', type: 'customNode', position: { x: 400, y: 700 }, data: { ...defaultNodeData, id: 'do3', label: 'Asset Reference', type: 'data_object', description: 'AR Data' } },
    { id: 'do4', type: 'customNode', position: { x: 550, y: 700 }, data: { ...defaultNodeData, id: 'do4', label: 'Notification Placeholder', type: 'data_object', description: 'Notification Data', dataSourceMode: 'real_pending' } },
    { id: 'doc1', type: 'customNode', position: { x: 700, y: 700 }, data: { ...defaultNodeData, id: 'doc1', label: 'SLA Document', type: 'document', description: 'SLA Doc' } },
    { id: 'doc2', type: 'customNode', position: { x: 850, y: 700 }, data: { ...defaultNodeData, id: 'doc2', label: 'Compliance Report', type: 'document', description: 'Compliance Doc' } },

    // Roles & Placeholders
    { id: 'r1', type: 'customNode', position: { x: 100, y: 850 }, data: { ...defaultNodeData, id: 'r1', label: 'Technician', type: 'actor_role', description: 'Tech Role' } },
    { id: 'r2', type: 'customNode', position: { x: 250, y: 850 }, data: { ...defaultNodeData, id: 'r2', label: 'Supervisor', type: 'actor_role', description: 'Supervisor Role' } },
    { id: 'r3', type: 'customNode', position: { x: 400, y: 850 }, data: { ...defaultNodeData, id: 'r3', label: 'Manager', type: 'actor_role', description: 'Manager Role' } },
    { id: 'r4', type: 'customNode', position: { x: 550, y: 850 }, data: { ...defaultNodeData, id: 'r4', label: 'Auditor', type: 'actor_role', description: 'Auditor Role' } },
    { id: 'op1', type: 'customNode', position: { x: 700, y: 850 }, data: { ...defaultNodeData, id: 'op1', label: 'External Vendor', type: 'owner_placeholder', description: 'Vendor' } },
    { id: 'op2', type: 'customNode', position: { x: 850, y: 850 }, data: { ...defaultNodeData, id: 'op2', label: 'Client Contact', type: 'owner_placeholder', description: 'Client' } },
    { id: 'ip1', type: 'customNode', position: { x: 100, y: 1000 }, data: { ...defaultNodeData, id: 'ip1', label: 'Legacy DB Sync', type: 'integration_placeholder', description: 'Legacy DB', dataSourceMode: 'real_blocked' } },
    { id: 'ip2', type: 'customNode', position: { x: 300, y: 1000 }, data: { ...defaultNodeData, id: 'ip2', label: 'Email Gateway', type: 'integration_placeholder', description: 'Email' } },

    // Risks, Gaps, Evidence, Governance
    { id: 'risk1', type: 'customNode', position: { x: 100, y: 1150 }, data: { ...defaultNodeData, id: 'risk1', label: 'Data Loss Risk', type: 'risk', description: 'Risk of data loss' } },
    { id: 'risk2', type: 'customNode', position: { x: 250, y: 1150 }, data: { ...defaultNodeData, id: 'risk2', label: 'Delay Risk', type: 'risk', description: 'Risk of delay' } },
    { id: 'risk3', type: 'customNode', position: { x: 400, y: 1150 }, data: { ...defaultNodeData, id: 'risk3', label: 'Compliance Risk', type: 'risk', description: 'Compliance risk' } },
    { id: 'gap1', type: 'customNode', position: { x: 550, y: 1150 }, data: { ...defaultNodeData, id: 'gap1', label: 'Missing Validation', type: 'gap', description: 'Missing step' } },
    { id: 'gap2', type: 'customNode', position: { x: 700, y: 1150 }, data: { ...defaultNodeData, id: 'gap2', label: 'No Automation', type: 'gap', description: 'Manual process' } },
    { id: 'gap3', type: 'customNode', position: { x: 850, y: 1150 }, data: { ...defaultNodeData, id: 'gap3', label: 'Siloed Data', type: 'gap', description: 'Data is siloed' } },
    { id: 'ev1', type: 'customNode', position: { x: 100, y: 1300 }, data: { ...defaultNodeData, id: 'ev1', label: 'Audit Log 1', type: 'evidence', description: 'Evidence 1' } },
    { id: 'ev2', type: 'customNode', position: { x: 250, y: 1300 }, data: { ...defaultNodeData, id: 'ev2', label: 'Screenshot 1', type: 'evidence', description: 'Evidence 2' } },
    { id: 'ev3', type: 'customNode', position: { x: 400, y: 1300 }, data: { ...defaultNodeData, id: 'ev3', label: 'Interview Note', type: 'evidence', description: 'Evidence 3' } },
    { id: 'gov1', type: 'customNode', position: { x: 550, y: 1300 }, data: { ...defaultNodeData, id: 'gov1', label: 'ISO 9001', type: 'governance_rule', description: 'Gov 1' } },
    { id: 'gov2', type: 'customNode', position: { x: 700, y: 1300 }, data: { ...defaultNodeData, id: 'gov2', label: 'Data Privacy', type: 'governance_rule', description: 'Gov 2' } },
    { id: 'gov3', type: 'customNode', position: { x: 850, y: 1300 }, data: { ...defaultNodeData, id: 'gov3', label: 'Access Control', type: 'governance_rule', description: 'Gov 3' } },
  ];

  const edges: EnterpriseMapEdge[] = [
    { id: 'e1', source: 'd1', target: 'c1', data: { ...defaultEdgeData, id: 'e1', type: 'contains', criticality: 'informational' } },
    { id: 'e2', source: 'c1', target: 'p1', data: { ...defaultEdgeData, id: 'e2', type: 'supports', criticality: 'informational' } },
    { id: 'e3', source: 'p1', target: 'do1', data: { ...defaultEdgeData, id: 'e3', type: 'produces', criticality: 'low' } },
    { id: 'e4', source: 'do1', target: 's1', data: { ...defaultEdgeData, id: 'e4', type: 'depends_on', criticality: 'informational' } },
    { id: 'e5', source: 'p1', target: 'r1', data: { ...defaultEdgeData, id: 'e5', type: 'executes', criticality: 'informational' } },
    { id: 'e6', source: 'vs1', target: 'd1', data: { ...defaultEdgeData, id: 'e6', type: 'contains', criticality: 'informational' } },
    { id: 'e7', source: 's1', target: 'ip1', data: { ...defaultEdgeData, id: 'e7', type: 'integrates_with', criticality: 'medium' } },
    { id: 'e8', source: 'c2', target: 'p2', data: { ...defaultEdgeData, id: 'e8', type: 'supports', criticality: 'informational' } },
    { id: 'e9', source: 'p2', target: 'do2', data: { ...defaultEdgeData, id: 'e9', type: 'produces', criticality: 'informational' } },
    { id: 'e10', source: 'do2', target: 's2', data: { ...defaultEdgeData, id: 'e10', type: 'depends_on', criticality: 'informational' } },
    { id: 'e11', source: 'p2', target: 'r2', data: { ...defaultEdgeData, id: 'e11', type: 'executes', criticality: 'informational' } },
    { id: 'e12', source: 's2', target: 'ip2', data: { ...defaultEdgeData, id: 'e12', type: 'integrates_with', criticality: 'informational' } },
    { id: 'e13', source: 'c3', target: 'p3', data: { ...defaultEdgeData, id: 'e13', type: 'supports', criticality: 'informational' } },
    { id: 'e14', source: 'p3', target: 'do3', data: { ...defaultEdgeData, id: 'e14', type: 'produces', criticality: 'informational' } },
    { id: 'e15', source: 'p3', target: 'r3', data: { ...defaultEdgeData, id: 'e15', type: 'executes', criticality: 'informational' } },
    { id: 'e16', source: 'c4', target: 'p4', data: { ...defaultEdgeData, id: 'e16', type: 'supports', criticality: 'informational' } },
    { id: 'e17', source: 'p4', target: 'do4', data: { ...defaultEdgeData, id: 'e17', type: 'produces', criticality: 'informational' } },
    { id: 'e18', source: 'p4', target: 'r4', data: { ...defaultEdgeData, id: 'e18', type: 'executes', criticality: 'informational' } },
    { id: 'e19', source: 'p1', target: 'risk1', data: { ...defaultEdgeData, id: 'e19', type: 'has_risk', criticality: 'medium' } },
    { id: 'e20', source: 'p2', target: 'gap1', data: { ...defaultEdgeData, id: 'e20', type: 'has_gap', criticality: 'low' } },
    { id: 'e21', source: 'p3', target: 'ev1', data: { ...defaultEdgeData, id: 'e21', type: 'evidenced_by', criticality: 'informational' } },
    { id: 'e22', source: 'p4', target: 'gov1', data: { ...defaultEdgeData, id: 'e22', type: 'governed_by', criticality: 'informational' } },
    { id: 'e23', source: 's1', target: 'a1', data: { ...defaultEdgeData, id: 'e23', type: 'integrates_with', criticality: 'informational' } },
    { id: 'e24', source: 'p1', target: 'op1', data: { ...defaultEdgeData, id: 'e24', type: 'participates_in', criticality: 'informational' } },
    { id: 'e25', source: 'p2', target: 'doc1', data: { ...defaultEdgeData, id: 'e25', type: 'consumes', criticality: 'informational' } },
  ];

  return { nodes, edges };
}

export const mockBlueprints: EnterpriseMapBlueprint[] = [
  {
    id: 'bp-1',
    name: 'System Builder Platform Map — Synthetic',
    description: 'System Builder platform architecture mock',
    mapScope: 'platform',
    dataSourceMode: 'synthetic',
    readinessStatus: 'mock_ready',
    synthetic: true,
    ...createMockNodesAndEdges()
  },
  {
    id: 'bp-2',
    name: 'Technical Service Enterprise Map — Synthetic',
    description: 'Technical service mock showing Intake, Triage, Validation, etc.',
    mapScope: 'technical_service',
    dataSourceMode: 'synthetic',
    readinessStatus: 'mock_ready',
    synthetic: true,
    ...createMockNodesAndEdges()
  },
  {
    id: 'bp-3',
    name: 'Clinic Operations Enterprise Map — Synthetic',
    description: 'Clinic ops mock',
    mapScope: 'clinic',
    dataSourceMode: 'synthetic',
    readinessStatus: 'mock_ready',
    synthetic: true,
    ...createMockNodesAndEdges()
  },
  {
    id: 'bp-4',
    name: 'Workshop Operations Enterprise Map — Synthetic',
    description: 'Workshop ops mock',
    mapScope: 'workshop',
    dataSourceMode: 'synthetic',
    readinessStatus: 'mock_ready',
    synthetic: true,
    ...createMockNodesAndEdges()
  }
];
