import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { contextualPacks } from '../../src/platform/integrations/packs';

describe('Integration Packs Contract', () => {
  it('should have unique keys across all packs', () => {
    const keys = contextualPacks.map(p => p.key);
    const uniqueKeys = new Set(keys);
    assert.equal(keys.length, uniqueKeys.size, 'Pack keys must be unique');

    for (const key of keys) {
      assert.equal(typeof key, 'string', 'Pack key must be a string');
      assert.ok(key.length > 0, 'Pack key cannot be empty');
    }
  });

  it('should have all required descriptors for each pack', () => {
    for (const pack of contextualPacks) {
      assert.equal(typeof pack.key, 'string', 'Pack missing key or not a string');
      assert.ok(pack.key.length > 0, `Pack key is empty`);

      assert.equal(typeof pack.name, 'string', `Pack ${pack.key} missing name or not a string`);
      assert.ok(pack.name.length > 0, `Pack ${pack.key} name is empty`);

      assert.equal(typeof pack.department, 'string', `Pack ${pack.key} missing department or not a string`);
      assert.ok(pack.department.length > 0, `Pack ${pack.key} department is empty`);

      assert.equal(typeof pack.description, 'string', `Pack ${pack.key} missing description or not a string`);
      assert.ok(pack.description.length > 0, `Pack ${pack.key} description is empty`);

      assert.ok(Array.isArray(pack.requiredModules), `Pack ${pack.key} requiredModules must be an array`);
      for (const reqModule of pack.requiredModules) {
        assert.equal(typeof reqModule, 'string', `Pack ${pack.key} required module must be a string`);
        assert.ok(reqModule.length > 0, `Pack ${pack.key} required reqModule cannot be empty`);
      }

      assert.ok(Array.isArray(pack.optionalModules), `Pack ${pack.key} optionalModules must be an array`);
      for (const reqModule of pack.optionalModules) {
        assert.equal(typeof reqModule, 'string', `Pack ${pack.key} optional module must be a string`);
        assert.ok(reqModule.length > 0, `Pack ${pack.key} optional reqModule cannot be empty`);
      }
    }
  });
});
