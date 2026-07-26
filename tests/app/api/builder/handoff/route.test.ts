import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import Module from 'node:module';

describe('POST /api/builder/handoff', () => {
  let POST: (req: Request) => Promise<Response>;

  before(async () => {
    // Mock Next.js generic imports
    const originalRequire = Module.prototype.require;
    (Module.prototype as unknown as { require: typeof originalRequire }).require = function(id: string) {
      if (id === 'next/server') {
        return {
          NextResponse: {
            json: (body: unknown, init?: { status?: number }) => {
              return {
                status: init?.status ?? 200,
                json: async () => body
              };
            }
          }
        };
      }
      return originalRequire.apply(this, arguments as unknown as [id: string]);
    };

    // Lazy load the route now that next/server is mocked
    const Route = await import('../../../../../src/app/api/builder/handoff/route');
    POST = Route.POST;
  });

  test('returns 400 for invalid payload', async () => {
    const req = {
      json: async () => ({
        appId: '123'
        // Missing version and environmentId
      })
    } as unknown as Request;

    const res = await POST(req);
    assert.strictEqual(res.status, 400);

    const data = await res.json() as { success: boolean, status: string, message: string };
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.status, 'empty');
    assert.strictEqual(data.message, 'Invalid request payload');
  });

  test('resolves successfully for valid payload', async () => {
    const req = {
      json: async () => ({
        appId: 'app-1',
        version: '1.0.0',
        environmentId: 'prod'
      })
    } as unknown as Request;

    const res = await POST(req);
    assert.strictEqual(res.status, 200);

    const data = await res.json() as { success: boolean, status: string, message: string };
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.status, 'success');
    assert.strictEqual(data.message, 'Deploying to Production Network');
  });
});
