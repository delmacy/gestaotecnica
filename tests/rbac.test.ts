import test from 'node:test';
import assert from 'node:assert';
import { User, Role, Action, hasPermission, hasRole } from '../src/platform/auth/rbac';

test('RBAC: hasRole checks', (t) => {
  const adminUser: User = { id: '1', roles: ['admin'] };
  const editorUser: User = { id: '2', roles: ['editor'] };

  assert.strictEqual(hasRole(adminUser, 'admin'), true);
  assert.strictEqual(hasRole(editorUser, 'admin'), false);
});

test('RBAC: hasPermission checks', (t) => {
  const adminUser: User = { id: '1', roles: ['admin'] };
  const editorUser: User = { id: '2', roles: ['editor'] };
  const viewerUser: User = { id: '3', roles: ['viewer'] };
  const noRoleUser: User = { id: '4', roles: [] };

  // Admin
  assert.strictEqual(hasPermission(adminUser, 'manage'), true);
  assert.strictEqual(hasPermission(adminUser, 'read'), true);

  // Editor
  assert.strictEqual(hasPermission(editorUser, 'create'), true);
  assert.strictEqual(hasPermission(editorUser, 'update'), true);
  assert.strictEqual(hasPermission(editorUser, 'delete'), false);
  assert.strictEqual(hasPermission(editorUser, 'manage'), false);

  // Viewer
  assert.strictEqual(hasPermission(viewerUser, 'read'), true);
  assert.strictEqual(hasPermission(viewerUser, 'create'), false);

  // No Role
  assert.strictEqual(hasPermission(noRoleUser, 'read'), false);
});
