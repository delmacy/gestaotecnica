import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { resolveNavigationInventory } from '../../src/platform/builder/contracts/navigation-inventory';
import type { WorkspaceContext } from '../../src/platform/workspace/workspace-context';

describe('Navigation Inventory Contract API', () => {
  it('should return active modules and future modules based on workspace context', () => {
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

    // Should include Dashboard and UI Contracts by default (no moduleKey required), plus Tasker, Capabilities, Registry
    assert.equal(result.activeModules.length, 5, 'Should have 5 active modules');

    const activeHrefs = result.activeModules.map((m) => m.href);
    assert.ok(activeHrefs.includes('/builder'));
    assert.ok(activeHrefs.includes('/builder/ui-contracts'));
    assert.ok(activeHrefs.includes('/builder/tasker'));
    assert.ok(activeHrefs.includes('/builder/capabilities'));
    assert.ok(activeHrefs.includes('/builder/registry'));

    // Should not include modules that are not enabled
    assert.ok(!activeHrefs.includes('/builder/form-builder'));
    assert.ok(!activeHrefs.includes('/builder/settings'));

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
