import test from 'node:test';
import assert from 'node:assert';
import { BlueprintExportRequestSchema } from '../../../../src/platform/blueprints/contracts/blueprint-export-request';

test('BlueprintExportRequestSchema - valid request', () => {
  const result = BlueprintExportRequestSchema.safeParse({
    packageId: 'com.example.pkg',
    version: '1.0.0',
    requestedSections: ['workflows', 'forms'],
    redactionOptions: {
      redactSecrets: true
    }
  });
  assert.strictEqual(result.success, true);
});

test('BlueprintExportRequestSchema - requires packageId and version', () => {
  const result = BlueprintExportRequestSchema.safeParse({});
  assert.strictEqual(result.success, false);
  if (!result.success) {
    const errorCodes = result.error.issues.map(e => e.message);
    assert.ok(errorCodes.includes('MISSING_PACKAGE_ID'));
    assert.ok(errorCodes.includes('MISSING_PACKAGE_VERSION'));
  }
});
