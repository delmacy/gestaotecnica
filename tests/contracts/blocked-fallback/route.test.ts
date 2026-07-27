import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { NextRequest } from "next/server";
import { POST } from '../../../src/app/api/builder/navigation/blocked-fallback/route';

describe('Blocked Fallback Route', () => {
  it('returns a successful fallback destination on valid payload', async () => {
    const req = {
      json: async () => ({
        reason: 'unauthorized',
      }),
    } as unknown as NextRequest;

    const res = await POST(req);
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.strictEqual(data.destination.fallbackPath, '/auth/login');
    assert.strictEqual(data.destination.reason, 'unauthorized');
  });

  it('returns 400 on invalid payload', async () => {
    const req = {
      json: async () => ({
        reason: 'unknown_reason_here',
      }),
    } as unknown as NextRequest;

    const res = await POST(req);
    assert.strictEqual(res.status, 400);
  });
});
