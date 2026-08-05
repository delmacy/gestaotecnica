import test from "node:test";
import assert from "node:assert/strict";
import proxyquire from "proxyquire";

let getRuntimeDbCalled = false;
let resolveWorkspaceContextCalled = false;
let passedEventInput: unknown = null;

const eventModule = proxyquire("../../src/platform/events/create-event", {
  "@/db": {
    getRuntimeDb: () => {
      getRuntimeDbCalled = true;
      return {
        insert: (table: unknown) => {
          return {
            values: (values: unknown) => {
              passedEventInput = values;
              return {
                returning: () => Promise.resolve([{ id: "mock-event-id-123" }])
              };
            }
          };
        }
      };
    }
  },
  "@/platform/workspace": {
    resolveWorkspaceContext: async () => {
      resolveWorkspaceContextCalled = true;
      return {
        workspaceId: "test-workspace-123",
        workspaceKey: "test-key",
        actor: { type: "system", id: "system-123" },
        source: "unit-test",
        enabledModules: [],
        scopes: [],
        correlationId: "test-correlation",
        environmentMode: "real"
      };
    }
  }
});

const createEvent = eventModule.createEvent;

test("Generic createEvent contract - regression tests for payload associations", async (t) => {
  t.beforeEach(() => {
    getRuntimeDbCalled = false;
    resolveWorkspaceContextCalled = false;
    passedEventInput = null;
  });

  await t.test("should not allow module-specific association fields to become top-level properties", async () => {
    const associationFields = {
      assetId: "asset-456",
      serviceOrderId: "order-789",
      workItemId: "work-abc"
    };

    const input = {
      eventType: "test.event",
      entityType: "test.entity",
      entityId: "entity-123",
      payload: associationFields
    };

    const result = await createEvent(input);
    
    assert.ok(getRuntimeDbCalled);
    assert.ok(resolveWorkspaceContextCalled);
    const passed = passedEventInput as Record<string, unknown>;
    assert.deepStrictEqual(passed, {
      eventType: "test.event",
      entityType: "test.entity",
      entityId: "entity-123",
      payload: associationFields,
      workspaceId: "test-workspace-123"
    });
    assert.deepStrictEqual(result, { id: "mock-event-id-123" });
  });

  await t.test("should retain all association fields within the payload", async () => {
    const input = {
      eventType: "test.event",
      entityType: "test.entity", 
      entityId: "entity-456",
      payload: {
        assetId: "asset-def",
        serviceOrderId: "order-ghi",
        workItemId: "work-xyz",
        metadata: { created: "2024-01-01" }
      }
    };

    const result = await createEvent(input);
    
    const passed = passedEventInput as Record<string, unknown>;
    assert.deepStrictEqual(passed.payload, input.payload);
    assert.deepStrictEqual(result, { id: "mock-event-id-123" });
  });

  await t.test("should not create top-level association properties from payload", async () => {
    const payloadWithAssociation = {
      assetId: "specific-asset-id",
      extraField: "some-value",
      nested: { relatedId: "nested-id" }
    };

    const input = {
      eventType: "test.event",
      entityType: "test.entity",
      entityId: "entity-789",
      payload: payloadWithAssociation
    };

    const result = await createEvent(input);
    
    const passed = passedEventInput as Record<string, unknown>;
    assert.deepStrictEqual(passed.payload, input.payload);
    assert.strictEqual(passed.eventType, "test.event");
    assert.strictEqual(passed.entityType, "test.entity");
    assert.strictEqual(passed.entityId, "entity-789");
    assert.deepStrictEqual(result, { id: "mock-event-id-123" });
  });

  await t.test("should handle payload without associations", async () => {
    const input = {
      eventType: "test.event",
      entityType: "test.entity",
      entityId: "entity-999",
      payload: {}
    };

    const result = await createEvent(input);
    
    const passed = passedEventInput as Record<string, unknown>;
    assert.deepStrictEqual(passed.payload, {});
    assert.deepStrictEqual(result, { id: "mock-event-id-123" });
  });
});