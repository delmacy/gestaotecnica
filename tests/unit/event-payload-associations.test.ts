import { describe, it } from "node:test";
import assert from "node:assert";
import {
  CreateEventInputSchema,
  buildEventPayload,
} from "../../src/platform/events/create-event-contract";

const baseInput = {
  eventType: "inventory.asset.updated",
  entityType: "asset",
  entityId: "asset-1",
};

describe("Generic event payload associations", () => {
  it("retains assetId inside the event payload", () => {
    const payload = buildEventPayload({ assetId: "asset-42" });
    assert.strictEqual(payload.assetId, "asset-42");
  });

  it("retains serviceOrderId inside the event payload", () => {
    const payload = buildEventPayload({ serviceOrderId: "so-7" });
    assert.strictEqual(payload.serviceOrderId, "so-7");
  });

  it("retains multiple association fields inside the event payload", () => {
    const payload = buildEventPayload({
      assetId: "asset-42",
      serviceOrderId: "so-7",
      workItemId: "wi-9",
    });
    assert.deepStrictEqual(payload, {
      assetId: "asset-42",
      serviceOrderId: "so-7",
      workItemId: "wi-9",
    });
  });

  it("preserves other payload data alongside associations", () => {
    const payload = buildEventPayload({ assetId: "asset-42", notes: "replaced" });
    assert.strictEqual(payload.assetId, "asset-42");
    assert.strictEqual(payload.notes, "replaced");
  });

  it("normalizes a missing payload to an empty object", () => {
    assert.deepStrictEqual(buildEventPayload(undefined), {});
  });

  it("accepts association fields carried inside the generic payload", () => {
    const result = CreateEventInputSchema.safeParse({
      ...baseInput,
      payload: { assetId: "asset-42", serviceOrderId: "so-7" },
    });
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.deepStrictEqual(result.data.payload, {
        assetId: "asset-42",
        serviceOrderId: "so-7",
      });
    }
  });

  it("rejects association fields as top-level input properties", () => {
    const result = CreateEventInputSchema.safeParse({
      ...baseInput,
      assetId: "asset-42",
    });
    assert.strictEqual(result.success, false);
  });

  it("keeps the generic contract to only eventType, entityType, entityId and payload", () => {
    assert.deepStrictEqual(
      Object.keys(CreateEventInputSchema.shape).sort(),
      ["entityId", "entityType", "eventType", "payload"],
    );
  });
});
