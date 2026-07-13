import { test } from "node:test";
import assert from "node:assert";
import { z } from "zod";
import { ConnectorRetryPolicySchema } from "@/platform/integrations/contracts/connector-retry-policy";

test("ConnectorRetryPolicySchema validates valid payload", () => {
  const validPayload = {
    maxAttempts: 3,
    backoff: 1000,
    retryableErrorClasses: ["NetworkError", "TimeoutError"],
  };
  const result = ConnectorRetryPolicySchema.parse(validPayload);
  assert.strictEqual(result.maxAttempts, 3);
  assert.strictEqual(result.backoff, 1000);
  assert.deepStrictEqual(result.retryableErrorClasses, ["NetworkError", "TimeoutError"]);
});

test("ConnectorRetryPolicySchema rejects invalid payload (negative maxAttempts)", () => {
  const invalidPayload = {
    maxAttempts: -1,
    backoff: 1000,
    retryableErrorClasses: ["NetworkError"],
  };
  assert.throws(() => ConnectorRetryPolicySchema.parse(invalidPayload), (err) => {
    assert(err instanceof z.ZodError);
    return true;
  });
});

test("ConnectorRetryPolicySchema rejects invalid payload (negative backoff)", () => {
  const invalidPayload = {
    maxAttempts: 3,
    backoff: -1000,
    retryableErrorClasses: ["NetworkError"],
  };
  assert.throws(() => ConnectorRetryPolicySchema.parse(invalidPayload), (err) => {
    assert(err instanceof z.ZodError);
    return true;
  });
});

test("ConnectorRetryPolicySchema rejects invalid payload (missing fields)", () => {
  const invalidPayload = {
    maxAttempts: 3,
    // backoff is missing
    retryableErrorClasses: ["NetworkError"],
  };
  assert.throws(() => ConnectorRetryPolicySchema.parse(invalidPayload), (err) => {
    assert(err instanceof z.ZodError);
    return true;
  });
});
