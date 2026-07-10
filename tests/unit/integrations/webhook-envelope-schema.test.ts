import { test } from "node:test";
import * as assert from "node:assert/strict";
import { IntegrationWebhookEnvelopeSchema } from "../../../src/platform/integrations/contracts/webhook-envelope";

test("IntegrationWebhookEnvelopeSchema validates valid envelope", () => {
  const data = {
    eventType: "my_event",
    payload: { foo: "bar" },
  };

  const result = IntegrationWebhookEnvelopeSchema.safeParse(data);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.eventType, "my_event");
    assert.equal(result.data.direction, "inbound");
    assert.equal(result.data.status, "received");
    assert.deepEqual(result.data.payload, { foo: "bar" });
  }
});

test("IntegrationWebhookEnvelopeSchema rejects missing eventType", () => {
  const data = {
    payload: { foo: "bar" },
  };

  const result = IntegrationWebhookEnvelopeSchema.safeParse(data);
  assert.equal(result.success, false);
});
