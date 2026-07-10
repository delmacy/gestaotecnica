import * as crypto from 'node:crypto';

/**
 * Pure, provider-agnostic helper for verifying webhook signatures.
 * Safely compares the provided signature against a calculated HMAC signature
 * using timing-safe buffer comparison to prevent side-channel timing attacks.
 *
 * @param payload - The raw string body of the webhook request
 * @param signature - The provided signature to verify against (e.g. from header)
 * @param secret - The shared secret used to sign the payload
 * @param algorithm - The hashing algorithm to use (defaults to 'sha256')
 * @returns boolean indicating if the signature is valid
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
  algorithm: string = 'sha256'
): boolean {
  if (!payload || !signature || !secret) {
    return false;
  }

  try {
    const calculatedSignature = crypto
      .createHmac(algorithm, secret)
      .update(payload)
      .digest('hex');

    const expectedBuffer = Buffer.from(calculatedSignature);
    const actualBuffer = Buffer.from(signature);

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch (_error) {
    return false;
  }
}
