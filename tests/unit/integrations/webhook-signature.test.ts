import { test } from "node:test";
import * as assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifyWebhookSignature } from "../../../src/platform/integrations/contracts/webhook-signature";

test("verifyWebhookSignature correctly validates valid signature", () => {
  const payload = JSON.stringify({ foo: "bar" });
  const secret = "my_super_secret_key";

  // Generate a valid signature
  const hmac = createHmac("sha256", secret);
  hmac.update(payload, "utf8");
  const signature = hmac.digest("hex");

  const result = verifyWebhookSignature({
    payload,
    signature,
    secret,
  });

  assert.equal(result, true);
});

test("verifyWebhookSignature rejects invalid signature", () => {
  const payload = JSON.stringify({ foo: "bar" });
  const secret = "my_super_secret_key";
  const signature = "invalid_signature_hex";

  const result = verifyWebhookSignature({
    payload,
    signature,
    secret,
  });

  assert.equal(result, false);
});

test("verifyWebhookSignature rejects empty parameters", () => {
  assert.equal(verifyWebhookSignature({ payload: "", signature: "sig", secret: "sec" }), false);
  assert.equal(verifyWebhookSignature({ payload: "pay", signature: "", secret: "sec" }), false);
  assert.equal(verifyWebhookSignature({ payload: "pay", signature: "sig", secret: "" }), false);
});

test("verifyWebhookSignature supports sha1, sha256, sha512", () => {
  const payload = "some_data";
  const secret = "secret_key";

  // SHA-1
  const hmacSha1 = createHmac("sha1", secret);
  hmacSha1.update(payload, "utf8");
  assert.equal(
    verifyWebhookSignature({
      payload,
      signature: hmacSha1.digest("hex"),
      secret,
      algorithm: "sha1",
    }),
    true
  );

  // SHA-256 (default)
  const hmacSha256 = createHmac("sha256", secret);
  hmacSha256.update(payload, "utf8");
  assert.equal(
    verifyWebhookSignature({
      payload,
      signature: hmacSha256.digest("hex"),
      secret,
      algorithm: "sha256",
    }),
    true
  );

  // SHA-512
  const hmacSha512 = createHmac("sha512", secret);
  hmacSha512.update(payload, "utf8");
  assert.equal(
    verifyWebhookSignature({
      payload,
      signature: hmacSha512.digest("hex"),
      secret,
      algorithm: "sha512",
    }),
    true
  );
});
