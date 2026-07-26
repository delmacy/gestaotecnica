import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { resolveCancelBack } from '../../src/platform/builder/contracts/cancel-back/resolve-cancel-back';

describe('resolveCancelBack', () => {
  it('should return DISCARD_ABORTED if isDirty is true and action is not DISCARD', () => {
    const outcome = resolveCancelBack({
      action: 'CANCEL',
      context: 'EDIT',
      isDirty: true,
      module: 'work-items',
      entityId: '123',
      hasPermissionForOrigin: true
    });
    assert.strictEqual(outcome.type, 'DISCARD_ABORTED');
    assert.strictEqual(outcome.destinationPath, null);
  });

  it('should return FALLBACK_DASHBOARD if permission is missing', () => {
    const outcome = resolveCancelBack({
      action: 'CANCEL',
      context: 'CREATE',
      isDirty: false,
      module: 'work-items',
      originPath: '/builder/restricted-area',
      hasPermissionForOrigin: false
    });
    assert.strictEqual(outcome.type, 'FALLBACK_DASHBOARD');
    assert.strictEqual(outcome.destinationPath, '/builder/dashboard');
  });

  it('should route to list for CANCEL_CREATE without origin path', () => {
    const outcome = resolveCancelBack({
      action: 'CANCEL',
      context: 'CREATE',
      isDirty: false,
      module: 'work-items',
      hasPermissionForOrigin: true
    });
    assert.strictEqual(outcome.type, 'CANCEL_CREATE');
    assert.strictEqual(outcome.destinationPath, '/builder/work-items');
  });

  it('should route to origin for CANCEL_CREATE with origin path', () => {
    const outcome = resolveCancelBack({
      action: 'CANCEL',
      context: 'CREATE',
      isDirty: false,
      module: 'work-items',
      originPath: '/builder/work-items?status=open',
      hasPermissionForOrigin: true
    });
    assert.strictEqual(outcome.type, 'CANCEL_CREATE');
    assert.strictEqual(outcome.destinationPath, '/builder/work-items?status=open');
  });

  it('should route to detail for CANCEL_EDIT', () => {
    const outcome = resolveCancelBack({
      action: 'CANCEL',
      context: 'EDIT',
      isDirty: false,
      module: 'work-items',
      entityId: '123',
      hasPermissionForOrigin: true
    });
    assert.strictEqual(outcome.type, 'CANCEL_EDIT');
    assert.strictEqual(outcome.destinationPath, '/builder/work-items/detail/123');
  });

  it('should route to list or origin for BACK_FROM_DETAIL', () => {
    const outcome = resolveCancelBack({
      action: 'BACK',
      context: 'DETAIL',
      isDirty: false,
      module: 'work-items',
      hasPermissionForOrigin: true
    });
    assert.strictEqual(outcome.type, 'BACK_FROM_DETAIL');
    assert.strictEqual(outcome.destinationPath, '/builder/work-items');
  });
});
