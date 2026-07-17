import { describe, it } from 'node:test';
import assert from 'node:assert';
import proxyquire from 'proxyquire';

const workspaceA = '11111111-1111-1111-1111-111111111111';
const workspaceB = '22222222-2222-2222-2222-222222222222';

describe('Form Repository Workspace Isolation', () => {

  it('saves and retrieves a form in a specific workspace', async () => {
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
                return [{ id: '33333333-3333-3333-3333-333333333333', workspaceId: workspaceA }];
            }
            return [];
        },
        update: () => mockDb,
        set: () => mockDb,
        insert: () => mockDb,
        values: () => mockDb
    }

    const mockGetRuntimeDb = () => mockDb;

    const { FormRepository } = proxyquire('../../src/platform/forms/infra/form.repository', {
      '@/db': {
        getRuntimeDb: mockGetRuntimeDb,
        '@noCallThru': true
      },
      '@/db/runtime/schema/workflow': {
          forms: {
              workspaceId: 'forms.workspaceId',
              id: 'forms.id'
          },
          '@noCallThru': true
      },
      'drizzle-orm': {
          eq: (_field: unknown, val: unknown) => val,
          and: (cond1: unknown, _cond2: unknown) => cond1 // Hacky mock for and(workspaceId, id)
      }
    });

    const repository = new FormRepository();

    const sampleForm = {
        id: '33333333-3333-3333-3333-333333333333',
        key: 'test-form',
        name: 'Test Form',
        version: '1.0.0',
        status: 'draft',
        fields: [],
        layout: { sections: [] },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    await repository.saveForm(workspaceA, sampleForm);

    const retrieved = await repository.getFormById(workspaceA, sampleForm.id);
    assert.ok(retrieved, 'Should retrieve the form');
    assert.strictEqual(retrieved.workspaceId, workspaceA);
  });

  it('returns null for missing workspace', async () => {
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
                return [{ id: '33333333-3333-3333-3333-333333333333', workspaceId: workspaceA }];
            }
            return [];
        },
        update: () => mockDb,
        set: () => mockDb,
        insert: () => mockDb,
        values: () => mockDb
    }

    const mockGetRuntimeDb = () => mockDb;

    const { FormRepository } = proxyquire('../../src/platform/forms/infra/form.repository', {
      '@/db': {
        getRuntimeDb: mockGetRuntimeDb,
        '@noCallThru': true
      },
      '@/db/runtime/schema/workflow': {
          forms: {
              workspaceId: 'forms.workspaceId',
              id: 'forms.id'
          },
          '@noCallThru': true
      },
      'drizzle-orm': {
          eq: (_field: unknown, val: unknown) => val,
          and: (cond1: unknown, _cond2: unknown) => cond1 // Hacky mock for and(workspaceId, id)
      }
    });

    const repository = new FormRepository();

    const sampleForm = {
        id: '33333333-3333-3333-3333-333333333333',
        key: 'test-form',
        name: 'Test Form',
        version: '1.0.0',
        status: 'draft',
        fields: [],
        layout: { sections: [] },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const retrieved = await repository.getFormById(workspaceB, sampleForm.id);
    assert.strictEqual(retrieved, null, 'Should not retrieve form for incorrect workspace');
  });
});
