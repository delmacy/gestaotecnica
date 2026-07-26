import { test } from 'node:test';
import assert from 'node:assert';
import module from 'node:module';

// Use unknown instead of any to satisfy the strict constraint
let originalRequire: unknown;

test.before(() => {
  originalRequire = module.Module.prototype.require;
  module.Module.prototype.require = function (id: string) {
    if (id.endsWith('@/db')) {
      return {
        getDb: () => ({
          select: () => ({
            from: () => ({
              // Only define one where function that handles both cases
              where: () => {
                  const list = [{ id: 'ws-1', name: 'Primary Operations', status: 'active', adaptationKey: 'real' },
                                { id: 'ws-2', name: 'Beta Features', status: 'active', adaptationKey: 'synthetic' }];
                  // Add a limit method to the array to simulate the db chain
                  (list as unknown as { limit: () => unknown }).limit = () => [{ id: 'ws-2' }];
                  return list;
              }
            })
          })
        })
      };
    }
    const req = originalRequire as (this: unknown, id: string) => unknown;
    return req.call(this, id);
  };
});

test.after(() => {
  if (originalRequire) {
    module.Module.prototype.require = originalRequire as (id: string) => unknown;
  }
});

test('Workspace and Client Context Switching - API Journey Validation', async (t) => {
  // Requires must happen inside the test after the mock is set up
  const { GET, POST } = require('@/app/api/builder/navigation/workspace-switching/route');

  await t.test('GET /api/builder/navigation/workspace-switching should return available workspaces with appropriate demo/synthetic labels', async () => {
    const mockReq = {
      url: 'http://localhost/api/builder/navigation/workspace-switching?userId=usr_123'
    };

    const res = await GET(mockReq as unknown as Request);
    const data = await res.json();

    assert.strictEqual(res.status, 200, 'Expected status to be 200');
    assert.ok(data.workspaces, 'Expected response to contain workspaces array');

    const workspaces = data.workspaces;
    assert.strictEqual(workspaces.length, 2, 'Expected 2 workspaces in response');

    const primaryOps = workspaces.find((w: { workspaceId: string }) => w.workspaceId === 'ws-1');
    assert.ok(primaryOps, 'Primary Operations workspace should exist');
    assert.strictEqual(primaryOps.isSynthetic, false, 'Primary operations should not be synthetic');

    const betaFeatures = workspaces.find((w: { workspaceId: string }) => w.workspaceId === 'ws-2');
    assert.ok(betaFeatures, 'Beta Features workspace should exist');
    assert.strictEqual(betaFeatures.isSynthetic, true, 'Beta features should be flagged as synthetic');
  });

  await t.test('POST /api/builder/navigation/workspace-switching should allow switching to authorized workspace and provide a redirectUrl', async () => {
    const mockReq = {
      json: async () => ({
        currentWorkspaceId: 'ws-1',
        targetWorkspaceId: 'ws-2',
        userId: 'usr_123'
      })
    };

    const res = await POST(mockReq as unknown as Request);
    const data = await res.json();

    assert.strictEqual(res.status, 200, 'Expected status to be 200');
    assert.strictEqual(data.status, 'success', 'Expected status to be success');
    assert.strictEqual(data.redirectUrl, '/builder', 'Expected redirectUrl to be /builder');
  });

  await t.test('POST /api/builder/navigation/workspace-switching should block forbidden workspace', async () => {
    const mockReq = {
      json: async () => ({
        currentWorkspaceId: 'ws-1',
        targetWorkspaceId: 'forbidden-ws',
        userId: 'usr_123'
      })
    };

    const res = await POST(mockReq as unknown as Request);
    const data = await res.json();

    assert.strictEqual(res.status, 200, 'Expected status to be 200');
    assert.strictEqual(data.status, 'forbidden', 'Expected status to be forbidden');
    assert.ok(data.message.includes('Not authorized'), 'Expected message to contain Not authorized');
  });
});
