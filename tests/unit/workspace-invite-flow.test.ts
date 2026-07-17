import test from 'node:test';
import assert from 'node:assert';
import proxyquire from 'proxyquire';

let mockInsertCount = 0;
let mockValuesCalledWith: Record<string, unknown> | null = null;
let mockOnConflictDoUpdateCalledWith: Record<string, unknown> | null = null;

const mockDb = {
  insert: () => {
    mockInsertCount++;
    return mockDb;
  },
  values: (vals: Record<string, unknown>) => {
    if (vals.email) mockValuesCalledWith = vals;
    return mockDb;
  },
  onConflictDoUpdate: (args: Record<string, unknown>) => {
    if (args.target) mockOnConflictDoUpdateCalledWith = args;
    return mockDb;
  },
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
  t.beforeEach(() => {
    mockInsertCount = 0;
    mockValuesCalledWith = null;
    mockOnConflictDoUpdateCalledWith = null;
  });

  await t.test('should successfully insert user and member record', async () => {
    const input = {
      workspaceId: 'ws-123',
      email: 'Test@eXample.com',
      name: 'Test User',
    };

    const context = {
      workspaceId: 'ws-123',
      workspaceKey: 'ws1',
      actor: { type: 'system' as const },
      source: 'system' as const,
      enabledModules: ['workspace'],
      scopes: ['*'],
      correlationId: 'test-123',
    };

    const result = await inviteUserKernelAction.handler(input, context as unknown);

    assert.strictEqual(result.success, true);
    assert.deepStrictEqual(result.data, {
      userId: 'mock-user-id',
      workspaceId: 'ws-123',
    });

    assert.strictEqual(mockInsertCount, 2); // 1 for user, 1 for member
    assert.strictEqual(mockValuesCalledWith?.email, 'test@example.com'); // checks normalization
    assert.strictEqual(mockValuesCalledWith?.name, 'Test User');
    assert.strictEqual((mockOnConflictDoUpdateCalledWith?.set as Record<string, unknown>)?.name, 'Test User');
  });

  await t.test('should successfully insert user with no name', async () => {
    const input = {
      workspaceId: 'ws-123',
      email: 'test-existing@example.com',
    };

    const context = {
      workspaceId: 'ws-123',
      workspaceKey: 'ws1',
      actor: { type: 'system' as const },
      source: 'system' as const,
      enabledModules: ['workspace'],
      scopes: ['*'],
      correlationId: 'test-123',
    };

    const result = await inviteUserKernelAction.handler(input, context as unknown);

    assert.strictEqual(result.success, true);
    assert.deepStrictEqual(result.data, {
      userId: 'mock-user-id',
      workspaceId: 'ws-123',
    });

    assert.strictEqual(mockInsertCount, 2);
    assert.strictEqual(mockValuesCalledWith?.name, null);
    assert.strictEqual((mockOnConflictDoUpdateCalledWith?.set as Record<string, unknown>)?.name, undefined); // ensures it does not overwrite with null
  });

  await t.test('should reject invalid email formats', async () => {
    const input = {
      workspaceId: 'ws-123',
      email: 'invalid-email',
    };

    const context = {
      workspaceId: 'ws-123',
      workspaceKey: 'ws1',
      actor: { type: 'system' as const },
      source: 'system' as const,
      enabledModules: ['workspace'],
      scopes: ['*'],
      correlationId: 'test-123',
    };

    const result = await inviteUserKernelAction.handler(input, context as unknown);

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error?.code, 'INVALID_EMAIL');
  });
});
