import assert from "node:assert";
import { test, describe } from "node:test";
import {
  toActionDescriptor,
  validateDescriptorAgainstDefinition,
  createActionCatalogSnapshot
} from "../../src/platform/actions/adapters/action-descriptor-registry-bridge";
import { ActionDefinition, ActionJsonSchema } from "../../src/platform/actions/action-types";

describe("Action Descriptor Registry Bridge", () => {
  const emptySchema: ActionJsonSchema = { type: "object", properties: {} };

  const minimalDefinition: ActionDefinition = {
    key: "test.minimal_action",
    moduleKey: "test",
    inputSchema: emptySchema,
    outputSchema: emptySchema,
    handler: async () => ({ success: true }),
  };

  test("should convert minimal definition to descriptor", () => {
    const descriptor = toActionDescriptor(minimalDefinition);

    assert.strictEqual(descriptor.key, minimalDefinition.key);
    assert.strictEqual(descriptor.handlerKey, minimalDefinition.key);
    assert.strictEqual(descriptor.name, minimalDefinition.key);
    assert.deepStrictEqual(descriptor.inputSchema, emptySchema);
    assert.deepStrictEqual(descriptor.outputSchema, emptySchema);
  });

  test("should throw if schemas are missing", () => {
    const incompleteDefinition = {
        key: "test.incomplete",
        moduleKey: "test",
        handler: async () => ({ success: true }),
    } as ActionDefinition;

    assert.throws(() => toActionDescriptor(incompleteDefinition), /missing or invalid inputSchema/);
  });

  test("should map labels and descriptions correctly", () => {
    const richDefinition: ActionDefinition = {
      ...minimalDefinition,
      uiLabel: "Rich Action",
      uiDescription: "Description from UI",
      description: "Description from core",
    };

    const descriptor = toActionDescriptor(richDefinition);
    assert.strictEqual(descriptor.name, "Rich Action");
    assert.strictEqual(descriptor.description, "Description from core");
  });

  test("should validate key compatibility (with comparison warning)", () => {
    const descriptor = toActionDescriptor(minimalDefinition);
    const report = validateDescriptorAgainstDefinition(descriptor, minimalDefinition);

    assert.strictEqual(report.compatible, false); // false because of SCHEMA_COMPARISON_UNSUPPORTED
    assert.ok(report.issues.some(i => i.code === "SCHEMA_COMPARISON_UNSUPPORTED"));
  });

  test("should report key mismatch", () => {
    const descriptor = toActionDescriptor(minimalDefinition);
    const wrongDefinition = { ...minimalDefinition, key: "other.key" };

    const report = validateDescriptorAgainstDefinition(descriptor, wrongDefinition);

    assert.strictEqual(report.compatible, false);
    assert.ok(report.issues.some(i => i.code === "KEY_MISMATCH"));
  });

  test("should report unsafe schemas", () => {
    const unsafeSchema: ActionJsonSchema = {
        type: "object",
        properties: {}
    };
    Object.defineProperty(unsafeSchema, "evil", {
        get: () => { throw new Error("Executed!"); },
        enumerable: true
    });

    const unsafeDefinition: ActionDefinition = {
      ...minimalDefinition,
      inputSchema: unsafeSchema
    };

    assert.throws(() => toActionDescriptor(unsafeDefinition), /is unsafe: ACCESSOR/);
  });

  test("should report cyclic schemas", () => {
    const cyclicSchema: any = { type: "object", properties: {} };
    cyclicSchema.properties.self = cyclicSchema;

    const cyclicDefinition: ActionDefinition = {
      ...minimalDefinition,
      inputSchema: cyclicSchema
    };

    assert.throws(() => toActionDescriptor(cyclicDefinition), /is unsafe: CYCLE/);
  });

  test("should not execute hostile getters on definition", () => {
    const hostileDefinition = {
        moduleKey: "test",
        inputSchema: emptySchema,
        outputSchema: emptySchema,
        handler: async () => ({ success: true }),
    } as ActionDefinition;

    let executed = false;
    Object.defineProperty(hostileDefinition, "key", {
        get: () => {
            executed = true;
            return "hostile.key";
        },
        enumerable: true,
        configurable: true
    });

    // Should throw because key is not found via getOwnPropertyDescriptor (or it's a getter)
    assert.throws(() => toActionDescriptor(hostileDefinition), /must have a string 'key' data property/);
    assert.strictEqual(executed, false, "Hostile getter was executed");
  });

  test("should create deterministic snapshot", () => {
    const defA: ActionDefinition = { ...minimalDefinition, key: "a.action" };
    const defB: ActionDefinition = { ...minimalDefinition, key: "b.action" };
    const defC: ActionDefinition = { ...minimalDefinition, key: "c.action" };

    const snapshot1 = createActionCatalogSnapshot([defC, defA, defB]);
    const snapshot2 = createActionCatalogSnapshot([defA, defC, defB]);

    assert.strictEqual(snapshot1[0].key, "a.action");
    assert.strictEqual(snapshot1[1].key, "b.action");
    assert.strictEqual(snapshot1[2].key, "c.action");
    assert.deepStrictEqual(snapshot1, snapshot2);
  });

  test("should never execute handler during conversion or validation", async () => {
    let executed = false;
    const tracingDefinition: ActionDefinition = {
      ...minimalDefinition,
      handler: async () => {
        executed = true;
        return { success: true };
      }
    };

    const descriptor = toActionDescriptor(tracingDefinition);
    validateDescriptorAgainstDefinition(descriptor, tracingDefinition);
    createActionCatalogSnapshot([tracingDefinition]);

    assert.strictEqual(executed, false, "Handler should not have been executed");
  });

  test("should handle frozen definitions", () => {
    const frozenDef = Object.freeze({ ...minimalDefinition });
    assert.doesNotThrow(() => toActionDescriptor(frozenDef));
  });
});
