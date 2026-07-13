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

test("ConnectorRequestSchema assigns default timeout", () => {
  const payloadWithoutTimeout = {
    destination: "some-destination",
    method: "POST",
    idempotencyKey: "123-abc",
    payload: { key: "value" },
  };
  const result = ConnectorRequestSchema.parse(payloadWithoutTimeout);
  assert.strictEqual(result.timeout, 30000);
});

test("ConnectorRequestSchema rejects timeout below minimum", () => {
  const payload = {
    destination: "some-destination",
    method: "POST",
    idempotencyKey: "123-abc",
    payload: { key: "value" },
    timeout: 999,
  };
  assert.throws(() => ConnectorRequestSchema.parse(payload), (err) => {
    assert(err instanceof z.ZodError);
    return true;
  });
});

test("ConnectorRequestSchema rejects timeout above maximum", () => {
  const payload = {
    destination: "some-destination",
    method: "POST",
    idempotencyKey: "123-abc",
    payload: { key: "value" },
    timeout: 300001,
  };
  assert.throws(() => ConnectorRequestSchema.parse(payload), (err) => {
    assert(err instanceof z.ZodError);
    return true;
  });
});

test("ConnectorRequestSchema rejects negative timeout", () => {
  const payload = {
    destination: "some-destination",
    method: "POST",
    idempotencyKey: "123-abc",
    payload: { key: "value" },
    timeout: -100,
  };
  assert.throws(() => ConnectorRequestSchema.parse(payload), (err) => {
    assert(err instanceof z.ZodError);
    return true;
  });
});

test("ConnectorRequestSchema exports CONNECTOR_TIMEOUT_DEFAULT", async () => {
  const m = await import("@/platform/integrations/contracts/connector-request");
  assert.strictEqual(m.CONNECTOR_TIMEOUT_DEFAULT, 30000);
});

test("ConnectorRequestSchema validates payload with redactedFields", () => {
  const payload = {
    destination: "some-destination",
    method: "POST",
    idempotencyKey: "123-abc",
    payload: { key: "value" },
    timeout: 5000,
    redactedFields: ["payload.password"]
  };
  const result = ConnectorRequestSchema.parse(payload);
  assert.deepStrictEqual(result.redactedFields, ["payload.password"]);
});
