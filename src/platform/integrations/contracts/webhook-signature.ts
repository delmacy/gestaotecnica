import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

export const WebhookSignatureVerificationOptionsSchema = z.object({
  payload: z.string().min(1),
  signature: z.string().min(1),
  secret: z.string().min(1),
  algorithm: z.enum(["sha1", "sha256", "sha512"]).default("sha256"),
});

export type WebhookSignatureVerificationOptions = z.infer<typeof WebhookSignatureVerificationOptionsSchema>;

/**
 * Verifies a webhook signature using HMAC.
 * This is a pure helper boundary for webhook payloads without real provider coupling.
 *
 * @param options The verification options
 * @returns boolean True if the signature is valid, false otherwise
 */
export function verifyWebhookSignature(options: WebhookSignatureVerificationOptions): boolean {
  const result = WebhookSignatureVerificationOptionsSchema.safeParse(options);
  if (!result.success) {
    return false;
  }

  const { payload, signature, secret, algorithm } = result.data;

  try {
    const hmac = createHmac(algorithm, secret);
    hmac.update(payload, "utf8");
    const expectedSignature = hmac.digest("hex");

    // Prevent timing attacks by using timingSafeEqual
    const signatureBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch (_err) {
    // Catch any issues with Buffer conversion or crypto operations
    return false;
  }
}
