import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { resolveBreadcrumbInventory } from '../../../../../src/platform/builder/contracts/breadcrumb/breadcrumb-inventory';
import type { WorkspaceContext } from '../../../../../src/platform/workspace';

describe('Breadcrumb Inventory', () => {
  const mockContext: WorkspaceContext = {
    workspaceId: 'test-ws-123',
    workspaceKey: 'test-ws',
    actor: {
      type: 'user',
      id: 'test-user',
    },
    source: 'ui',
    environmentMode: 'real',
    enabledModules: ['work-items', 'registry'],
    scopes: [],
    correlationId: 'test-corr-id',
  };

  const syntheticContext: WorkspaceContext = {
    ...mockContext,
    environmentMode: 'synthetic',
  };

  it('should return just the Workspace root for /builder', () => {
    const nodes = resolveBreadcrumbInventory(mockContext, { pathname: '/builder' });
    assert.equal(nodes.length, 1);
    assert.equal(nodes[0].label, 'Workspace');
    assert.equal(nodes[0].href, '/builder');
    assert.equal(nodes[0].isClickable, false); // Active page is not clickable
  });

  it('should return just the Platform Admin root for /admin', () => {
    const nodes = resolveBreadcrumbInventory(mockContext, { pathname: '/admin' });
    assert.equal(nodes.length, 1);
    assert.equal(nodes[0].label, 'Platform Admin');
    assert.equal(nodes[0].href, '/admin');
    assert.equal(nodes[0].isClickable, false);
  });

  it('should resolve Tasker module correctly', () => {
    const nodes = resolveBreadcrumbInventory(mockContext, { pathname: '/builder/tasker' });
    assert.equal(nodes.length, 2);
    assert.equal(nodes[0].label, 'Workspace');
    assert.equal(nodes[0].isClickable, true);
    assert.equal(nodes[1].label, 'Tasker');
    assert.equal(nodes[1].isClickable, false);
  });

  it('should resolve deep nested paths', () => {
    const nodes = resolveBreadcrumbInventory(mockContext, { pathname: '/builder/tasker/123-abc' });
    assert.equal(nodes.length, 3);
    assert.equal(nodes[1].label, 'Tasker');
    assert.equal(nodes[1].isClickable, true);
    assert.equal(nodes[2].label, '123 Abc'); // Default fallback label formatting
    assert.equal(nodes[2].isClickable, false);
  });

  it('should resolve Platform Admin deep nested paths', () => {
    const nodes = resolveBreadcrumbInventory(mockContext, { pathname: '/admin/users/123' });
    assert.equal(nodes.length, 3);
    assert.equal(nodes[0].label, 'Platform Admin');
    assert.equal(nodes[0].href, '/admin');
    assert.equal(nodes[1].label, 'Users');
    assert.equal(nodes[2].label, '123');
    assert.equal(nodes[2].isClickable, false);
  });

  it('should use dynamic labels when provided', () => {
    const nodes = resolveBreadcrumbInventory(mockContext, {
      pathname: '/builder/tasker/task-1',
      dynamicLabels: { 'task-1': 'Update Documentation' }
    });
    assert.equal(nodes.length, 3);
    assert.equal(nodes[2].label, 'Update Documentation');
  });

  it('should prefix with Mock in synthetic mode if no dynamic label is provided', () => {
    const nodes = resolveBreadcrumbInventory(syntheticContext, { pathname: '/builder/tasker/task-1' });
    assert.equal(nodes.length, 3);
    assert.equal(nodes[2].label, 'Mock Task 1');
  });

  it('should not prefix with Mock in synthetic mode if dynamic label is provided', () => {
    const nodes = resolveBreadcrumbInventory(syntheticContext, {
      pathname: '/builder/tasker/task-1',
      dynamicLabels: { 'task-1': 'Synthetic Title from DB' }
    });
    assert.equal(nodes.length, 3);
    assert.equal(nodes[2].label, 'Synthetic Title from DB');
  });

  it('should render Entity Not Found state for missing items', () => {
    const nodes = resolveBreadcrumbInventory(mockContext, {
      pathname: '/builder/tasker/invalid-id',
      isNotFound: true
    });
    assert.equal(nodes.length, 3);
    assert.equal(nodes[2].label, 'Entity Not Found');
    assert.equal(nodes[2].isClickable, false);
  });

  it('should render Restricted Area state for blocked items', () => {
    const nodes = resolveBreadcrumbInventory(mockContext, {
      pathname: '/builder/tasker/secret-task',
      isBlocked: true
    });
    assert.equal(nodes.length, 3);
    assert.equal(nodes[2].label, 'Restricted Area');
    assert.equal(nodes[2].isClickable, false);
  });

  it('should handle missing modules (fallback formatting)', () => {
    const nodes = resolveBreadcrumbInventory(mockContext, { pathname: '/builder/unknown-module/123' });
    assert.equal(nodes.length, 3);
    assert.equal(nodes[1].label, 'Unknown Module'); // Format Segment output
  });

  it('should block traversal on coming_soon modules', () => {
    // Workflow Builder is defined in FUTURE_ROUTES in navigation-inventory.ts
    const nodes = resolveBreadcrumbInventory(mockContext, { pathname: '/builder/workflow-builder/deep-link' });
    assert.equal(nodes.length, 2);
    assert.equal(nodes[1].label, 'Workflow Builder');
    assert.equal(nodes[1].isClickable, false); // Because it is stopped at future module
  });

});
