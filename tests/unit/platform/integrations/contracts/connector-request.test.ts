import { test } from "node:test";
import assert from "node:assert";
import { z } from "zod";
import { ConnectorRequestSchema } from "@/platform/integrations/contracts/connector-request";

test("ConnectorRequestSchema validates valid payload", () => {
  const validPayload = {
    destination: "some-destination",
    method: "POST",
    idempotencyKey: "123-abc",
    payload: { key: "value" },
    timeout: 5000,
  };
  const result = ConnectorRequestSchema.parse(validPayload);
  assert.strictEqual(result.destination, "some-destination");
});

test("ConnectorRequestSchema rejects missing payload", () => {
  const invalidPayload = {
    destination: "some-destination",
    method: "POST",
    idempotencyKey: "123-abc",
    timeout: 5000,
  };
  assert.throws(() => ConnectorRequestSchema.parse(invalidPayload), (err) => {
    assert(err instanceof z.ZodError);
    return true;
  });
});
