import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { resolveBlockedFallback } from '../../../src/app/api/builder/navigation/blocked-fallback/resolve-blocked-fallback';

describe('resolveBlockedFallback', () => {
  it('resolves unauthorized correctly', () => {
    const result = resolveBlockedFallback({
      reason: 'unauthorized',
    });

    assert.strictEqual(result.fallbackPath, '/auth/login');
    assert.strictEqual(result.shouldRedirect, true);
    assert.strictEqual(result.reason, 'unauthorized');
  });

  it('resolves forbidden_workspace correctly', () => {
    const result = resolveBlockedFallback({
      reason: 'forbidden_workspace',
      workspaceId: 'tenant-1',
    });

    assert.strictEqual(result.fallbackPath, '/builder/tenant-1');
    assert.strictEqual(result.shouldRedirect, false);
    assert.strictEqual(result.userMessage, 'This configuration requires Workspace Admin privileges.');
  });

  it('resolves forbidden_platform correctly', () => {
    const result = resolveBlockedFallback({
      reason: 'forbidden_platform',
    });

    assert.strictEqual(result.fallbackPath, '/admin');
    assert.strictEqual(result.shouldRedirect, false);
    assert.strictEqual(result.userMessage, 'Platform Access Restricted.');
  });

  it('resolves not_found to module list when moduleName is provided', () => {
    const result = resolveBlockedFallback({
      reason: 'not_found',
      workspaceId: 'tenant-1',
      moduleName: 'capabilities',
    });

    assert.strictEqual(result.fallbackPath, '/builder/tenant-1/capabilities');
    assert.strictEqual(result.userMessage, 'Configuration Unavailable.');
  });

  it('handles demo mode correctly (intercepting actions)', () => {
    const result = resolveBlockedFallback({
      reason: 'forbidden_workspace',
      originalPath: '/builder/tenant-1/settings',
      environmentMode: 'demo'
    });

    assert.strictEqual(result.reason, 'demo_restricted');
    assert.strictEqual(result.fallbackPath, '/builder/tenant-1/settings');
    assert.strictEqual(result.shouldRedirect, false);
    assert.strictEqual(result.userMessage, 'Action restricted in Demo Simulation. No changes were made.');
  });
});
