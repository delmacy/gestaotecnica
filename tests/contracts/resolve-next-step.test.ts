import { describe, it } from 'node:test';
import assert from 'node:assert';
import { resolveNextStep } from '../../src/platform/builder/contracts/next-step/resolve-next-step';
import { WorkspaceContext } from '../../src/platform/workspace';
import { OriginContext } from '../../src/platform/builder/contracts/origin-context/origin-context-contract';

describe('Next Step Resolution Contract', () => {
  const baseWorkspaceContext: WorkspaceContext = {
    workspaceId: 'ws-123',
    workspaceKey: 'ws-123',
    actor: {
      type: 'user',
      id: 'u-123',
    },
    source: 'ui',
    correlationId: 'c-123',
    scopes: [],
    environmentMode: 'real',
    enabledModules: ['registry', 'work-items', 'process-mirroring']
  };

  const baseOriginContext: OriginContext = {
    originPath: '/builder/registry',
    returnPath: '/builder/registry',
    returnLabel: 'Return to Registry',
    isBlocked: false,
    isDemo: false,
    isSynthetic: false,
    isValidScope: true
  };

  it('should resolve CREATE_ENTITY_SUCCESS to detail view', () => {
    const result = resolveNextStep({
      outcome: 'CREATE_ENTITY_SUCCESS',
      moduleKey: 'registry',
      entityId: 'ent-789',
      workspaceContext: baseWorkspaceContext,
      originContext: baseOriginContext
    });

    assert.strictEqual(result.destination, '/builder/registry/detail/ent-789');
    assert.strictEqual(result.status, 'normal');
    assert.strictEqual(result.label, 'View New Entry');
  });

  it('should handle demo mode for CREATE_ENTITY_SUCCESS', () => {
    const result = resolveNextStep({
      outcome: 'CREATE_ENTITY_SUCCESS',
      moduleKey: 'registry',
      entityId: 'ent-789',
      workspaceContext: { ...baseWorkspaceContext, environmentMode: 'demo' },
      originContext: baseOriginContext
    });

    assert.strictEqual(result.destination, '/builder/registry');
    assert.strictEqual(result.status, 'demo_simulation');
    assert.strictEqual(result.label, 'Simulation Complete');
  });

  it('should resolve blocked destination access safely', () => {
    const result = resolveNextStep({
      outcome: 'CREATE_ENTITY_SUCCESS',
      moduleKey: 'registry',
      entityId: 'ent-789',
      workspaceContext: baseWorkspaceContext,
      originContext: baseOriginContext,
      hasDestinationAccess: false
    });

    assert.strictEqual(result.destination, '/builder/registry'); // fallback to origin return path
    assert.strictEqual(result.status, 'blocked');
    assert.strictEqual(result.label, 'Action Successful');
    assert.ok(result.message?.includes('administrator review'));
  });

  it('should resolve PROCESS_ANALYSIS_SUCCESS to results view', () => {
    const result = resolveNextStep({
      outcome: 'PROCESS_ANALYSIS_SUCCESS',
      moduleKey: 'process-mirroring',
      jobId: 'job-999',
      workspaceContext: baseWorkspaceContext,
      originContext: baseOriginContext
    });

    assert.strictEqual(result.destination, '/builder/process-mirroring/results/job-999');
    assert.strictEqual(result.status, 'normal');
    assert.strictEqual(result.label, 'Analysis Ready - View Results');
  });

  it('should resolve DELETE_ENTITY_SUCCESS to list view', () => {
    const result = resolveNextStep({
      outcome: 'DELETE_ENTITY_SUCCESS',
      moduleKey: 'registry',
      entityId: 'ent-789',
      workspaceContext: baseWorkspaceContext,
      originContext: baseOriginContext
    });

    assert.strictEqual(result.destination, '/builder/registry');
    assert.strictEqual(result.status, 'normal');
    assert.strictEqual(result.label, 'Deletion Successful');
  });

  it('should handle demo mode for DELETE_ENTITY_SUCCESS appropriately', () => {
    const result = resolveNextStep({
      outcome: 'DELETE_ENTITY_SUCCESS',
      moduleKey: 'registry',
      entityId: 'ent-789',
      workspaceContext: { ...baseWorkspaceContext, environmentMode: 'demo' },
      originContext: baseOriginContext
    });

    assert.strictEqual(result.destination, '/builder/registry');
    assert.strictEqual(result.status, 'demo_simulation');
    assert.strictEqual(result.label, 'Simulation Complete');
    assert.ok(result.message?.includes('restricted in Demo Mode'));
  });
});
