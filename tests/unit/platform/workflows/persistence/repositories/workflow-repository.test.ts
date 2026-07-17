import { describe, it } from 'node:test';
import assert from 'node:assert';
import proxyquire from 'proxyquire';

const workspaceA = '11111111-1111-1111-1111-111111111111';
const workspaceB = '22222222-2222-2222-2222-222222222222';
const mockUserId = '33333333-3333-3333-3333-333333333333';

describe('Workflow Repository Workspace Isolation', () => {

  it('saves and retrieves a process definition in a specific workspace', async () => {
    let whereCondition: unknown;

    const mockDb = {
        select: () => mockDb,
        from: () => mockDb,
        where: (args: unknown) => {
            whereCondition = args;
            return mockDb;
        },
        limit: () => {
            if (whereCondition === workspaceA) {
                return [{
                    id: '44444444-4444-4444-4444-444444444444',
                    workspaceId: workspaceA,
                    key: 'test-wf',
                    name: 'Test Workflow',
                    status: 'draft',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    createdById: mockUserId
                }];
            }
            return [];
        },
        update: () => mockDb,
        set: () => mockDb,
        insert: () => mockDb,
        values: () => mockDb
    }

    const mockGetRuntimeDb = () => mockDb;

    const { WorkflowRepository } = proxyquire('../../../../../../src/platform/workflows/infra/workflow.repository', {
      '@/db': {
        getRuntimeDb: mockGetRuntimeDb,
        '@noCallThru': true
      },
      '@/db/runtime/schema/workflow': {
          processDefinitions: {
              workspaceId: 'processDefinitions.workspaceId',
              id: 'processDefinitions.id'
          },
          processVersions: {
              processDefinitionId: 'processVersions.processDefinitionId',
              version: 'processVersions.version'
          },
          '@noCallThru': true
      },
      'drizzle-orm': {
          eq: (_field: unknown, val: unknown) => val,
          and: (cond1: unknown, _cond2: unknown) => cond1
      }
    });

    const repository = new WorkflowRepository();

    const sampleDef = {
        id: '44444444-4444-4444-4444-444444444444',
        workspaceId: workspaceA,
        key: 'test-wf',
        name: 'Test Workflow',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdById: mockUserId
    };

    await repository.saveDefinition(workspaceA, sampleDef);

    const retrieved = await repository.getDefinitionById(workspaceA, sampleDef.id);
    assert.ok(retrieved, 'Should retrieve the process definition');
    assert.strictEqual(retrieved.workspaceId, workspaceA);
  });

  it('returns null for missing workspace when retrieving definition', async () => {
    let whereCondition: unknown;

    const mockDb = {
        select: () => mockDb,
        from: () => mockDb,
        where: (args: unknown) => {
            whereCondition = args;
            return mockDb;
        },
        limit: () => {
            if (whereCondition === workspaceA) {
                return [{
                    id: '44444444-4444-4444-4444-444444444444',
                    workspaceId: workspaceA,
                    key: 'test-wf',
                    name: 'Test Workflow',
                    status: 'draft',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    createdById: mockUserId
                }];
            }
            return [];
        },
        update: () => mockDb,
        set: () => mockDb,
        insert: () => mockDb,
        values: () => mockDb
    }

    const mockGetRuntimeDb = () => mockDb;

    const { WorkflowRepository } = proxyquire('../../../../../../src/platform/workflows/infra/workflow.repository', {
      '@/db': {
        getRuntimeDb: mockGetRuntimeDb,
        '@noCallThru': true
      },
      '@/db/runtime/schema/workflow': {
          processDefinitions: {
              workspaceId: 'processDefinitions.workspaceId',
              id: 'processDefinitions.id'
          },
          processVersions: {
              processDefinitionId: 'processVersions.processDefinitionId',
              version: 'processVersions.version'
          },
          '@noCallThru': true
      },
      'drizzle-orm': {
          eq: (_field: unknown, val: unknown) => val,
          and: (cond1: unknown, _cond2: unknown) => cond1
      }
    });

    const repository = new WorkflowRepository();

    const sampleDef = {
        id: '44444444-4444-4444-4444-444444444444',
        workspaceId: workspaceA,
        key: 'test-wf',
        name: 'Test Workflow',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdById: mockUserId
    };

    const retrieved = await repository.getDefinitionById(workspaceB, sampleDef.id);
    assert.strictEqual(retrieved, null, 'Should not retrieve definition for incorrect workspace');
  });
});
