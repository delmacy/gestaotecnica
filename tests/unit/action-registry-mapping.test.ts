import { describe, it } from 'node:test';
import assert from 'node:assert';
import { mapActionToRegistryItem } from '../../src/components/builder/registry/registry-mappers';
import { ActionDefinition } from '../../src/platform/actions';

describe('Action Registry Mapping', () => {
  it('should correctly map an ActionDefinition to a RegistryItem', () => {
    const dummyAction: ActionDefinition = {
      key: 'test.dummy.action',
      moduleKey: 'test-module',
      uiLabel: 'Dummy Action Label',
      uiDescription: 'This is a test action.',
      emits: ['test.event'],
      callableBy: ['ui', 'automation'],
      requiredScopes: ['test:read', 'test:write'],
      requiredModules: ['auth-module'],
      targetEntity: 'DummyEntity',
      idempotent: true,
      handler: async () => ({ success: true })
    };

    const registryItem = mapActionToRegistryItem(dummyAction);

    assert.strictEqual(registryItem.id, 'action-test.dummy.action');
    assert.strictEqual(registryItem.name, 'Dummy Action Label');
    assert.strictEqual(registryItem.slug, 'test.dummy.action');
    assert.strictEqual(registryItem.type, 'action');
    assert.strictEqual(registryItem.description, 'This is a test action.');
    assert.strictEqual(registryItem.related_capability, 'test-module');
    assert.deepStrictEqual(registryItem.depends_on, ['auth-module']);
    assert.deepStrictEqual(registryItem.used_by, ['ui', 'automation']);

    // Notes contain formatted output
    assert.ok(registryItem.notes?.includes('Emits: test.event'));
    assert.ok(registryItem.notes?.includes('Callable By: ui, automation'));
    assert.ok(registryItem.notes?.includes('Required Scopes: test:read, test:write'));
    assert.ok(registryItem.notes?.includes('Idempotent: Yes'));
    assert.ok(registryItem.notes?.includes('Target Entity: DummyEntity'));
  });

  it('should handle empty or missing optional fields gracefully', () => {
    const minimalisticAction: ActionDefinition = {
      key: 'test.minimal',
      moduleKey: 'core',
      handler: async () => ({ success: true })
    };

    const registryItem = mapActionToRegistryItem(minimalisticAction);

    assert.strictEqual(registryItem.id, 'action-test.minimal');
    // Name falls back to formatted key if uiLabel is missing
    assert.strictEqual(registryItem.name, 'Test Minimal');
    assert.strictEqual(registryItem.description, 'No description provided.');
    assert.deepStrictEqual(registryItem.depends_on, []);
    assert.deepStrictEqual(registryItem.used_by, []);

    assert.ok(registryItem.notes?.includes('Emits: None'));
    assert.ok(registryItem.notes?.includes('Callable By: None'));
    assert.ok(registryItem.notes?.includes('Required Scopes: None'));
    assert.ok(registryItem.notes?.includes('Idempotent: No'));
    assert.ok(registryItem.notes?.includes('Target Entity: N/A'));
  });
});
