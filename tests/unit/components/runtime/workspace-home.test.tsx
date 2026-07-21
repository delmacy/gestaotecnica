import { test } from 'node:test';
import assert from 'node:assert';
import { WorkspaceHome } from '../../../../src/components/runtime/workspace-home';

test('WorkspaceHome structural render test', () => {
  const element = WorkspaceHome({ workspaceKey: 'test-ws' });
  assert.ok(element, 'WorkspaceHome should return a React element');

  const cache = new Set();
  const stringified = JSON.stringify(element, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return;
      }
      cache.add(value);
    }
    // Convert functions (like components) to their names
    if (typeof value === 'function') {
      return value.name || 'function';
    }
    return value;
  });

  assert.ok(stringified.includes('Capabilities'), 'Capabilities title should be present');
  assert.ok(stringified.includes('/builder/capabilities'), 'Capabilities link should be present');
});
