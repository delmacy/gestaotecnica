import { test, describe } from 'node:test';
import assert from 'node:assert';
import { resolveBuilderHandoff } from '../../../../../src/platform/builder/contracts/handoff/resolve-handoff';

describe('resolveBuilderHandoff', () => {
  test('returns empty state for missing configurations', async () => {
    const response = await resolveBuilderHandoff({
      appId: 'app-1',
      version: 'empty',
      environmentId: 'prod'
    });

    assert.strictEqual(response.success, false);
    assert.strictEqual(response.status, 'empty');
    assert.strictEqual(response.message, 'No configurations to deploy');
  });

  test('returns blocked state for restricted environment', async () => {
    const response = await resolveBuilderHandoff({
      appId: 'app-1',
      version: '1.0.0',
      environmentId: 'blocked'
    });

    assert.strictEqual(response.success, false);
    assert.strictEqual(response.status, 'blocked');
    assert.strictEqual(response.message, 'Restricted');
  });

  test('returns demo state for demo environment', async () => {
    const response = await resolveBuilderHandoff({
      appId: 'app-1',
      version: '1.0.0',
      environmentId: 'demo'
    });

    assert.strictEqual(response.success, true);
    assert.strictEqual(response.status, 'demo');
    assert.strictEqual(response.message, 'Deploy to Demo Runtime');
    assert.strictEqual(response.runtimeUrl, '/runtime/demo/app-1?version=1.0.0');
    assert.ok(response.handoffToken);
  });

  test('returns synthetic state for synthetic app', async () => {
    const response = await resolveBuilderHandoff({
      appId: 'synth-app-1',
      version: '1.0.0',
      environmentId: 'prod'
    });

    assert.strictEqual(response.success, true);
    assert.strictEqual(response.status, 'synthetic');
    assert.strictEqual(response.message, 'Deploy to Synthetic Runtime');
    assert.strictEqual(response.runtimeUrl, '/runtime/synthetic/synth-app-1?version=1.0.0');
    assert.ok(response.handoffToken);
  });

  test('returns success state for real data', async () => {
    const response = await resolveBuilderHandoff({
      appId: 'app-1',
      version: '1.0.0',
      environmentId: 'prod'
    });

    assert.strictEqual(response.success, true);
    assert.strictEqual(response.status, 'success');
    assert.strictEqual(response.message, 'Deploying to Production Network');
    assert.strictEqual(response.runtimeUrl, '/runtime/app/app-1?version=1.0.0');
    assert.ok(response.handoffToken);
  });
});
