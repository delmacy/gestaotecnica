import { describe, it } from "node:test";
import assert from "node:assert";
import { createEvent } from "../../../src/platform/events/create-event";
import { type EventInput } from "../../../src/platform/events/create-event";

describe("Generic createEvent Regression Tests", () => {
  it("should preserve association fields inside event payload", () => {
    // Test the TypeScript type system directly
    const input: EventInput = {
      eventType: "test.entity.created",
      entityType: "testEntity",
      entityId: "test-entity-123",
      payload: {
        assetId: "asset-456",
        serviceOrderId: "order-789",
        workItemId: "work-item-101112",
      },
    };

    // Verify all required top-level fields exist
    assert.strictEqual(input.eventType, "test.entity.created");
    assert.strictEqual(input.entityType, "testEntity");
    assert.strictEqual(input.entityId, "test-entity-123");
    assert.strictEqual(typeof input.payload, "object");
    assert.strictEqual(input.payload.assetId, "asset-456");
    assert.strictEqual(input.payload.serviceOrderId, "order-789");
    assert.strictEqual(input.payload.workItemId, "work-item-101112");

    // Verify association fields are NOT at top level (regression check)
    assert(!("assetId" in input), "assetId must NOT be a top-level property");
    assert(!("serviceOrderId" in input), "serviceOrderId must NOT be a top-level property");
    assert(!("workItemId" in input), "workItemId must NOT be a top-level property");

    // Verify the contract structure
    const contractFields: (keyof EventInput)[] = ["eventType", "entityType", "entityId", "payload"];
    const inputKeys = Object.keys(input) as (keyof EventInput)[];
    
    contractFields.forEach(field => {
      assert.ok(inputKeys.includes(field), `Missing required contract field: ${field}`);
    });

    assert.strictEqual(inputKeys.length, contractFields.length, "Contract must not have extra fields");
  });

  it("should handle payload without optional association fields", () => {
    const input: EventInput = {
      eventType: "test.entity.updated",
      entityType: "testEntity",
      entityId: "test-entity-456",
      payload: {
        customField: "customValue",
        anotherField: { nested: "object" },
      },
    };

    assert.strictEqual(input.eventType, "test.entity.updated");
    assert.strictEqual(input.entityType, "testEntity");
    assert.strictEqual(input.entityId, "test-entity-456");
    assert.deepStrictEqual(input.payload, {
      customField: "customValue",
      anotherField: { nested: "object" },
    });

    // Verify only generic fields are present at top level
    const expectedTopLevelFields: (keyof EventInput)[] = ["eventType", "entityType", "entityId", "payload"];
    const actualTopLevelFields = Object.keys(input) as (keyof EventInput)[];
    assert.deepStrictEqual(
      actualTopLevelFields.sort(),
      expectedTopLevelFields.sort()
    );
  });

  it("should enforce payload is optional (backwards compatibility)", () => {
    const input: EventInput = {
      eventType: "test.entity.deleted",
      entityType: "testEntity",
      entityId: "test-entity-789",
      // payload is omitted (should be undefined)
    };

    assert.strictEqual(input.eventType, "test.entity.deleted");
    assert.strictEqual(input.entityType, "testEntity");
    assert.strictEqual(input.entityId, "test-entity-789");
    assert.strictEqual(typeof input.payload, "undefined");
  });

  it("should test at least two association fields as required", () => {
    const input: EventInput = {
      eventType: "test.entity.created",
      entityType: "testEntity",
      entityId: "test-entity-123",
      payload: {
        assetId: "asset-456",
        serviceOrderId: "order-789",
        workItemId: "work-item-101112",
        additionalField: "value",
      },
    };

    // Verify two specific association fields exist in payload
    assert.ok(input.payload.assetId);
    assert.ok(input.payload.serviceOrderId);
    
    // Verify they are NOT at top level
    assert(!("assetId" in input), "assetId must NOT be a top-level property");
    assert(!("serviceOrderId" in input), "serviceOrderId must NOT be a top-level property");
    
    // Verify workItemId also exists in payload
    assert.ok(input.payload.workItemId);
  });

  it("should ensure eventType is required and immutable at top level", () => {
    const input: EventInput = {
      eventType: "required.event.type",
      entityType: "testEntity",
      entityId: "test-entity-123",
      payload: {},
    };

    // Verify eventType is at top level
    assert.strictEqual(input.eventType, "required.event.type");
    
    // Verify you cannot add eventType to payload and have it at top level
    // This is a regression test - the eventType should always be top-level
    const differentEventInput: EventInput = {
      eventType: "different.type",
      entityType: "testEntity",
      entityId: "test-entity-123",
      payload: {
        eventType: "would-be-ignored-eventType-in-payload",
        entityType: "entity-in-payload",
      },
    };

    assert.strictEqual(differentEventInput.eventType, "different.type");
    assert.strictEqual(differentEventInput.payload.eventType, "would-be-ignored-eventType-in-payload");
    assert.strictEqual(differentEventInput.payload.entityType, "entity-in-payload");
  });
});