import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { resolveNavigationInventory } from '../../src/platform/builder/contracts/navigation-inventory';
import type { WorkspaceContext } from '../../src/platform/workspace/workspace-context';

describe('Navigation Inventory Contract API', () => {
  it('should return all modules and reflect blocked status based on workspace context', () => {
    const mockContext: WorkspaceContext = {
      workspaceId: 'test-ws-id',
      workspaceKey: 'test-ws-key',
      actor: { type: 'system' },
      source: 'system',
      enabledModules: ['work-items', 'registry'], // Only Tasker and Capabilities/Registry enabled
      scopes: ['*'],
      correlationId: 'test-correlation',
      environmentMode: 'real',
    };

    const result = resolveNavigationInventory(mockContext);

    // Group A has 9 routes. Now none are filtered out.
    assert.equal(result.activeModules.length, 9, 'Should have 9 modules in activeModules (some may be blocked)');

    const dashboard = result.activeModules.find((m) => m.href === '/builder');
    assert.equal(dashboard?.status, 'active');

    const uiContracts = result.activeModules.find((m) => m.href === '/builder/ui-contracts');
    assert.equal(uiContracts?.status, 'active');

    const tasker = result.activeModules.find((m) => m.href === '/builder/tasker');
    assert.equal(tasker?.status, 'active');

    const formBuilder = result.activeModules.find((m) => m.href === '/builder/form-builder');
    assert.equal(formBuilder?.status, 'blocked');

    const settings = result.activeModules.find((m) => m.href === '/builder/settings');
    assert.equal(settings?.status, 'blocked');

    // Should contain future modules
    assert.ok(result.futureModules.length > 0, 'Should return future modules');

    // Environment mode should match
    assert.equal(result.environmentMode, 'real');
  });

  it('should pass through synthetic mode from context', () => {
    const mockContext: WorkspaceContext = {
      workspaceId: 'test-ws-id',
      workspaceKey: 'test-ws-key',
      actor: { type: 'system' },
      source: 'system',
      enabledModules: [],
      scopes: ['*'],
      correlationId: 'test-correlation',
      environmentMode: 'synthetic',
    };

    const result = resolveNavigationInventory(mockContext);
    assert.equal(result.environmentMode, 'synthetic');
  });

  it('should pass through demo mode from context', () => {
    const mockContext: WorkspaceContext = {
      workspaceId: 'test-ws-id',
      workspaceKey: 'test-ws-key',
      actor: { type: 'system' },
      source: 'system',
      enabledModules: [],
      scopes: ['*'],
      correlationId: 'test-correlation',
      environmentMode: 'demo',
    };

    const result = resolveNavigationInventory(mockContext);
    assert.equal(result.environmentMode, 'demo');
  });
});
