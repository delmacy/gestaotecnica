import assert from "node:assert";
import { test, describe } from "node:test";
import {
  toActionDescriptor,
  validateDescriptorAgainstDefinition,
  createActionCatalogSnapshot
} from "../../src/platform/actions/adapters/action-descriptor-registry-bridge";
import { ActionDefinition } from "../../src/platform/actions/action-types";
import { ActionDescriptor } from "../../src/platform/actions/contracts/action-descriptor";

describe("Action Descriptor Registry Bridge", () => {
  const minimalDefinition: ActionDefinition = {
    key: "test.minimal_action",
    moduleKey: "test",
    handler: async () => ({ success: true }),
  };

  test("should convert minimal definition to descriptor", () => {
    const descriptor = toActionDescriptor(minimalDefinition);

    assert.strictEqual(descriptor.key, minimalDefinition.key);
    assert.strictEqual(descriptor.handlerKey, minimalDefinition.key);
    assert.strictEqual(descriptor.name, minimalDefinition.key);
    assert.deepStrictEqual(descriptor.inputSchema, { type: "object", properties: {} });
    assert.deepStrictEqual(descriptor.outputSchema, { type: "object", properties: {} });
    // @ts-ignore - ensuring handler is not present in descriptor
    assert.strictEqual(descriptor.handler, undefined);
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
    // uiDescription should take precedence if we want, but here we just slice whatever we get.
    // In my implementation: (definition.description || definition.uiDescription)
    assert.strictEqual(descriptor.description, "Description from core");
  });

  test("should validate compatible descriptor and definition", () => {
    const descriptor = toActionDescriptor(minimalDefinition);
    const report = validateDescriptorAgainstDefinition(descriptor, minimalDefinition);

    assert.strictEqual(report.compatible, true);
    assert.strictEqual(report.issues.length, 0);
  });

  test("should report key mismatch", () => {
    const descriptor = toActionDescriptor(minimalDefinition);
    const wrongDefinition = { ...minimalDefinition, key: "other.key" };

    const report = validateDescriptorAgainstDefinition(descriptor, wrongDefinition);

    assert.strictEqual(report.compatible, false);
    assert.ok(report.issues.some(i => i.code === "KEY_MISMATCH"));
  });

  test("should report handlerKey mismatch", () => {
    const descriptor = toActionDescriptor(minimalDefinition);
    // Manually mutate descriptor to break policy
    const invalidDescriptor = { ...descriptor, handlerKey: "wrong_handler" };

    const report = validateDescriptorAgainstDefinition(invalidDescriptor, minimalDefinition);

    assert.strictEqual(report.compatible, false);
    assert.ok(report.issues.some(i => i.code === "HANDLER_KEY_MISMATCH"));
  });

  test("should report unsafe schemas", () => {
    const unsafeDefinition: ActionDefinition = {
      ...minimalDefinition,
      inputSchema: {
        type: "object",
        properties: {
          // @ts-ignore - injecting unsafe function
          evil: () => {}
        }
      } as any
    };

    // toActionDescriptor should throw because it runs safeParse which calls checkSafety
    assert.throws(() => toActionDescriptor(unsafeDefinition), /is unsafe: FUNCTION/);
  });

  test("should create deterministic snapshot", () => {
    const defA: ActionDefinition = { key: "a.action", moduleKey: "m", handler: async () => ({ success: true }) };
    const defB: ActionDefinition = { key: "b.action", moduleKey: "m", handler: async () => ({ success: true }) };
    const defC: ActionDefinition = { key: "c.action", moduleKey: "m", handler: async () => ({ success: true }) };

    const snapshot1 = createActionCatalogSnapshot([defC, defA, defB]);
    const snapshot2 = createActionCatalogSnapshot([defA, defC, defB]);

    assert.strictEqual(snapshot1[0].key, "a.action");
    assert.strictEqual(snapshot1[1].key, "b.action");
    assert.strictEqual(snapshot1[2].key, "c.action");
    assert.deepStrictEqual(snapshot1, snapshot2);
  });

  test("should not mutate input definition", () => {
    const original = JSON.parse(JSON.stringify(minimalDefinition));
    // Re-add handler as it's not stringifiable
    minimalDefinition.handler = async () => ({ success: true });

    toActionDescriptor(minimalDefinition);

    assert.strictEqual(minimalDefinition.key, original.key);
    assert.ok(typeof minimalDefinition.handler === "function");
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
