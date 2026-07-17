import test from 'node:test';
import assert from 'node:assert';
import proxyquire from 'proxyquire';

const mockDb = {
  insert: () => mockDb,
  values: () => mockDb,
  onConflictDoUpdate: () => mockDb,
  onConflictDoNothing: () => mockDb,
  returning: () => [{ id: 'mock-user-id' }],
};

const mockGetRuntimeDb = () => mockDb;

const { inviteUserKernelAction } = proxyquire('../../src/platform/workspace/application/kernel-actions', {
  '@/db': {
    getRuntimeDb: mockGetRuntimeDb,
  },
  '@/db/runtime/schema/workspace': {
    organizations: {},
    workspaces: {},
    entityDefinitions: {},
    fieldDefinitions: {},
    dynamicRecords: {},
    workspaceMembers: { name: 'workspaceMembers' },
  },
  '@/db/runtime/schema/identity': {
    usersTable: { name: 'usersTable', email: 'email', id: 'id' },
  },
  '@/db/schema': {
    workspaceModuleConfigs: {},
  },
});

test('Invite User Kernel Action', async (t) => {
  await t.test('should successfully insert user and member record', async () => {
    const context = {
      workspaceId: 'ctx-workspace-1',
      workspaceKey: 'ws1',
      actor: { type: 'system' as const },
      source: 'system' as const,
      enabledModules: ['workspace'],
      scopes: ['*'],
      correlationId: 'test-123',
    };

    const input = {
      workspaceId: 'ws-123',
      email: 'test@example.com',
      name: 'Test User',
    };

    const result = await inviteUserKernelAction.handler(input, context as unknown);

    assert.strictEqual(result.success, true);
    assert.deepStrictEqual(result.data, {
      userId: 'mock-user-id',
      workspaceId: 'ws-123',
    });
  });
});
