import { describe, it } from 'node:test';
import assert from 'node:assert';
import { POST } from '../../src/app/api/builder/navigation/next-step/route';

describe('Next Step Resolution API', () => {
  it('should return bad request for invalid outcome', async () => {
    // We create a minimal mock request for NextRequest
    const req = {
      json: async () => ({ outcome: 'INVALID_STUFF', moduleKey: 'registry' })
    } as any;

    const res = await POST(req);
    assert.strictEqual(res.status, 400);
  });

  it('should return bad request for missing moduleKey', async () => {
    const req = {
      json: async () => ({ outcome: 'CREATE_ENTITY_SUCCESS' })
    } as any;

    const res = await POST(req);
    assert.strictEqual(res.status, 400);
  });
});
