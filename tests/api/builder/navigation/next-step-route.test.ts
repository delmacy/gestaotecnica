import { describe, it } from 'node:test';
import assert from 'node:assert';

// Mock cookies for Next.js app router context
import Module from 'node:module';

// A simple way to mock next/headers for our node:test
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id: string, ...args: unknown[]) {
  if (id === 'next/headers') {
    return {
      cookies: () => ({
        get: (_name: string) => undefined,
      }),
    };
  }
  return originalRequire.apply(this, [id, ...args]);
};

import { NextRequest } from 'next/server';
import { POST } from '../../../../src/app/api/builder/navigation/next-step/route';

describe('POST /api/builder/navigation/next-step', () => {
  it('should return 400 for invalid payload', async () => {
    const request = new NextRequest('http://localhost:3000/api/builder/navigation/next-step', {
      method: 'POST',
      body: JSON.stringify({ outcome: 'INVALID_OUTCOME', moduleKey: 'registry' }),
    });

    const response = await POST(request);
    assert.strictEqual(response.status, 400);
    const json = await response.json();
    assert.strictEqual(json.error, 'Invalid request payload');
  });

  it('should resolve CREATE_ENTITY_SUCCESS to detail view', async () => {
    const request = new NextRequest('http://localhost:3000/api/builder/navigation/next-step', {
      method: 'POST',
      body: JSON.stringify({
        outcome: 'CREATE_ENTITY_SUCCESS',
        moduleKey: 'registry',
        entityId: 'ent-123'
      }),
    });

    const response = await POST(request);
    assert.strictEqual(response.status, 200);
    const json = await response.json();
    assert.strictEqual(json.destination, '/builder/registry/detail/ent-123');
    assert.strictEqual(json.status, 'normal');
    assert.strictEqual(json.label, 'View New Entry');
  });

  it('should resolve DELETE_ENTITY_SUCCESS to list view', async () => {
    const request = new NextRequest('http://localhost:3000/api/builder/navigation/next-step', {
      method: 'POST',
      body: JSON.stringify({
        outcome: 'DELETE_ENTITY_SUCCESS',
        moduleKey: 'registry',
        entityId: 'ent-123'
      }),
    });

    const response = await POST(request);
    assert.strictEqual(response.status, 200);
    const json = await response.json();
    assert.strictEqual(json.destination, '/builder/registry');
    assert.strictEqual(json.status, 'normal');
    assert.strictEqual(json.label, 'Deletion Successful');
  });
});
