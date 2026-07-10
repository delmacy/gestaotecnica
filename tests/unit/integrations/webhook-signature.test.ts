import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import * as crypto from 'node:crypto';
import { verifyWebhookSignature } from '../../../src/platform/integrations/contracts/webhook-signature';

describe('Webhook Signature Contract', () => {
  const payload = JSON.stringify({ event: 'test.event', data: { id: 123 } });
  const secret = 'super-secret-key';

  // Calculate a valid signature for the default sha256 algorithm
  const validSignatureSha256 = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  it('should return true for a valid signature with the default algorithm (sha256)', () => {
    const isValid = verifyWebhookSignature(payload, validSignatureSha256, secret);
    assert.equal(isValid, true);
  });

  it('should return false for an invalid signature', () => {
    const invalidSignature = 'a'.repeat(64); // Valid length, wrong content
    const isValid = verifyWebhookSignature(payload, invalidSignature, secret);
    assert.equal(isValid, false);
  });

  it('should return false if the provided signature has an incorrect length', () => {
    const shortSignature = 'invalid';
    const isValid = verifyWebhookSignature(payload, shortSignature, secret);
    assert.equal(isValid, false);
  });

  it('should return false if payload is missing or empty', () => {
    assert.equal(verifyWebhookSignature('', validSignatureSha256, secret), false);
    // @ts-expect-error Testing invalid input
    assert.equal(verifyWebhookSignature(undefined, validSignatureSha256, secret), false);
  });

  it('should return false if signature is missing or empty', () => {
    assert.equal(verifyWebhookSignature(payload, '', secret), false);
    // @ts-expect-error Testing invalid input
    assert.equal(verifyWebhookSignature(payload, undefined, secret), false);
  });

  it('should return false if secret is missing or empty', () => {
    assert.equal(verifyWebhookSignature(payload, validSignatureSha256, ''), false);
    // @ts-expect-error Testing invalid input
    assert.equal(verifyWebhookSignature(payload, validSignatureSha256, undefined), false);
  });

  it('should support alternative algorithms', () => {
    const sha512Signature = crypto
      .createHmac('sha512', secret)
      .update(payload)
      .digest('hex');

    const isValid = verifyWebhookSignature(payload, sha512Signature, secret, 'sha512');
    assert.equal(isValid, true);
  });

  it('should handle unsupported algorithms gracefully by returning false', () => {
    // This will throw in crypto.createHmac, and our catch block should return false
    const isValid = verifyWebhookSignature(payload, validSignatureSha256, secret, 'invalid-alg');
    assert.equal(isValid, false);
  });
});
