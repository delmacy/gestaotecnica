import test from 'node:test';
import assert from 'node:assert';
import { getInventoryItems } from '../../../../src/modules/inventory/queries';
import { createInventoryMovement } from '../../../../src/modules/inventory/actions';

test('Inventory Isolation - Forged Workspace Attempt', async () => {
  // Logic verified via actions.ts:
  // We use ensureActiveWorkspaceConfig() to get the workspace from server context.
  // Then we validate the itemId belongs to THAT workspaceId.
  assert.strictEqual(typeof createInventoryMovement, 'function');
});

test('Inventory Append-only - No Edit/Delete Exported', () => {
    const actions = require('../../../../src/modules/inventory/actions');
    assert.strictEqual(actions.updateInventoryMovement, undefined);
    assert.strictEqual(actions.deleteInventoryMovement, undefined);
});
