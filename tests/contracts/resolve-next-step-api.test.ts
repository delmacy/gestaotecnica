import { describe, it } from 'node:test';
import assert from 'node:assert';
import { NextRequest } from "next/server";
import { POST } from '../../src/app/api/builder/navigation/next-step/route';

describe('Next Step Resolution API', () => {
  it('should return bad request for invalid outcome', async () => {
    // We create a minimal mock request for NextRequest
    const req = {
      json: async () => ({ outcome: 'INVALID_STUFF', moduleKey: 'registry' })
    } as unknown as NextRequest;

    const res = await POST(req);
    assert.strictEqual(res.status, 400);
  });

  it('should return bad request for missing moduleKey', async () => {
    const req = {
      json: async () => ({ outcome: 'CREATE_ENTITY_SUCCESS' })
    } as unknown as NextRequest;

    const res = await POST(req);
    assert.strictEqual(res.status, 400);
  });
});
