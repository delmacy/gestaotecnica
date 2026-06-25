import { describe, it } from 'node:test';
import assert from 'node:assert';
import { initializePlatformKernel } from '../../src/platform/kernel';
import { listActions } from '../../src/platform/actions';
import { mapActionToRegistryItem } from '../../src/components/builder/registry/action-mapper';

describe('Action Registry View Mapping', () => {
  it('should successfully map real actions to registry items', () => {
    initializePlatformKernel();
    const actions = listActions();

    assert.ok(actions.length > 0, 'Should have registered actions from kernel');

    const mapped = actions.map(mapActionToRegistryItem);

    assert.strictEqual(mapped.length, actions.length);

    // Check mapping properties
    const firstAction = mapped[0];
    const originalAction = actions[0];

    assert.strictEqual(firstAction.type, 'action', 'Type should be action');
    assert.ok(firstAction.id.startsWith('action-'), 'ID should be prefixed with action-');
    assert.strictEqual(firstAction.slug, originalAction.key, 'Slug should match action key');
    assert.strictEqual(typeof firstAction.synthetic, 'boolean', 'Synthetic flag should be present');

    // Check that properties from ActionDefinition are preserved
    assert.ok(firstAction.name.length > 0, 'Name should be generated or preserved');
    assert.strictEqual(firstAction.related_capability, originalAction.moduleKey, 'Capability should link to moduleKey');
  });
});
