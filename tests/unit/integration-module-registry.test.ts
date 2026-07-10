import test from 'node:test';
import assert from 'node:assert/strict';
import proxyquire from 'proxyquire';

const stubs = {
  '@/modules/acquisitions/queries': { getAcquisitionNeeds: async () => 'mock_acquisitions' },
  '@/modules/assets/queries': { getAssetTypeOptions: async () => 'mock_asset_types', getAssets: async () => 'mock_assets' },
  '@/modules/automations/queries': { getAutomationRules: async () => 'mock_rules', getAutomationRuns: async () => 'mock_runs' },
  '@/modules/documents/queries': { getTechnicalDocuments: async () => 'mock_documents' },
  '@/modules/events/queries': { getEvents: async () => 'mock_events' },
  '@/modules/legacy/queries': { getLegacyRecords: async () => 'mock_legacy' },
  '@/modules/maintenance-plans/queries': { getMaintenancePlans: async () => 'mock_maintenance_plans' },
  '@/modules/reports/queries': { getReports: async () => 'mock_reports' },
  '@/modules/schedules/queries': { getSchedules: async () => 'mock_schedules' },
  '@/modules/service-orders/queries': { getServiceOrders: async () => 'mock_service_orders' },
  '@/modules/shifts/queries': { getShifts: async () => 'mock_shifts' },
  '@/modules/technical-projects/queries': { getTechnicalProjects: async () => 'mock_technical_projects' },
  '@/modules/work-items/queries': { getWorkItems: async () => 'mock_work_items' },
  '@/modules/workforce/queries': { getTechnicians: async () => 'mock_technicians', getWorkforceAllocations: async () => 'mock_allocations', getTechnicianUnavailabilities: async () => 'mock_unavailabilities' }
};

const moduleRegistry = proxyquire('../../src/platform/integrations/module-registry', stubs);
const { gatewayModules, readGatewayModule } = moduleRegistry;

test('Integration Module Registry', async (t) => {
  await t.test('gatewayModules contains expected gateway entries', () => {
    assert.ok(Array.isArray(gatewayModules));
    assert.strictEqual(gatewayModules.length, 15);
    const workItems = gatewayModules.find((m: any) => m.key === 'work-items');
    assert.deepEqual(workItems, { key: 'work-items', name: 'Work Items', methods: ['GET'], packHints: ['operacoes-tecnicas'] });
  });

  await t.test('readGatewayModule routes known module keys to their respective queries', async () => {
    assert.strictEqual(await readGatewayModule('work-items'), 'mock_work_items');
    assert.strictEqual(await readGatewayModule('service-orders'), 'mock_service_orders');
    assert.deepEqual(await readGatewayModule('assets'), { assets: 'mock_assets', assetTypes: 'mock_asset_types' });
    assert.deepEqual(await readGatewayModule('workforce'), { technicians: 'mock_technicians', allocations: 'mock_allocations', unavailabilities: 'mock_unavailabilities' });
    assert.strictEqual(await readGatewayModule('schedules'), 'mock_schedules');
    assert.strictEqual(await readGatewayModule('shifts'), 'mock_shifts');
    assert.strictEqual(await readGatewayModule('documents'), 'mock_documents');
    assert.strictEqual(await readGatewayModule('reports'), 'mock_reports');
    assert.strictEqual(await readGatewayModule('legacy'), 'mock_legacy');
    assert.deepEqual(await readGatewayModule('automations'), { rules: 'mock_rules', runs: 'mock_runs' });
    assert.strictEqual(await readGatewayModule('events'), 'mock_events');
    assert.strictEqual(await readGatewayModule('maintenance-plans'), 'mock_maintenance_plans');
    assert.strictEqual(await readGatewayModule('technical-projects'), 'mock_technical_projects');
    assert.strictEqual(await readGatewayModule('acquisitions'), 'mock_acquisitions');
  });

  await t.test('readGatewayModule returns null for unknown moduleKey', async () => {
    assert.strictEqual(await readGatewayModule('unknown_module_xyz'), null);
  });
});
