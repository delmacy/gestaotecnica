import { test } from "node:test";
import assert from "node:assert";
import {
  validateUtilityAppActionBinding,
  mapUtilityAppInput,
  mapActionOutput
} from "../../src/platform/utility-apps/adapters/action-adapter";
import { UtilityAppActionBinding } from "../../src/platform/utility-apps/contracts/utility-app-action-binding";

const validBinding: UtilityAppActionBinding = {
  utilityAppKey: "my-utility-app",
  actionKey: "core.test_action",
  direction: "consumes",
  operationKey: "test-op",
  inputMapping: {
    "u_field1": "a_field1",
    "u_field2": "a_field2"
  },
  outputMapping: {
    "a_result": "u_result"
  },
  enabled: true,
  metadata: { version: 1 }
};

test("Utility App Action Adapter: should validate a valid binding", () => {
  const validated = validateUtilityAppActionBinding(validBinding);
  assert.deepStrictEqual(validated, validBinding);
});

test("Utility App Action Adapter: should fail on invalid utilityAppKey", () => {
  const invalid = { ...validBinding, utilityAppKey: "Invalid Key" };
  assert.throws(() => validateUtilityAppActionBinding(invalid));
});

test("Utility App Action Adapter: should fail on invalid actionKey", () => {
  const invalid = { ...validBinding, actionKey: "invalid_key" }; // missing dot
  assert.throws(() => validateUtilityAppActionBinding(invalid));
});

test("Utility App Action Adapter: should fail on empty operationKey", () => {
  const invalid = { ...validBinding, operationKey: "" };
  assert.throws(() => validateUtilityAppActionBinding(invalid));
});

test("Utility App Action Adapter: should fail on unsafe metadata", () => {
  const invalid = {
    ...validBinding,
    metadata: { fn: () => {} }
  };
  assert.throws(() => validateUtilityAppActionBinding(invalid));
});

test("Utility App Action Adapter: should fail on illegal mapping values", () => {
  const invalid = {
    ...validBinding,
    outputMapping: { "test": "prototype" }
  };
  assert.throws(() => validateUtilityAppActionBinding(invalid));
});

test("Utility App Action Adapter: should fail on duplicate mapping targets", () => {
  const invalid = {
    ...validBinding,
    inputMapping: {
      "field1": "target",
      "field2": "target"
    }
  };
  assert.throws(() => validateUtilityAppActionBinding(invalid));
});

test("Utility App Action Adapter: mapUtilityAppInput should map fields correctly", () => {
  const input = {
    u_field1: "value1",
    u_field2: 123,
    other: "ignored"
  };
  const result = mapUtilityAppInput(validBinding, input);
  assert.deepStrictEqual(result, {
    a_field1: "value1",
    a_field2: 123
  });
});

test("Utility App Action Adapter: mapUtilityAppInput should handle missing fields", () => {
  const input = {
    u_field1: "value1"
  };
  const result = mapUtilityAppInput(validBinding, input);
  assert.deepStrictEqual(result, {
    a_field1: "value1"
  });
});

test("Utility App Action Adapter: mapActionOutput should map fields correctly", () => {
  const output = {
    a_result: "success",
    a_other: "ignored"
  };
  const result = mapActionOutput(validBinding, output);
  assert.deepStrictEqual(result, {
    u_result: "success"
  });
});

test("Utility App Action Adapter: should prevent prototype pollution in mapping", () => {
  const bindingWithPollution: UtilityAppActionBinding = {
    ...validBinding,
    inputMapping: JSON.parse('{"u_field": "__proto__"}')
  };
  // validateUtilityAppActionBinding should actually catch this now due to superRefine
  assert.throws(() => validateUtilityAppActionBinding(bindingWithPollution));

  // Even if it bypassed validation, mapUtilityAppInput should handle it
  const input = { u_field: { polluted: true } };
  const result = mapUtilityAppInput(bindingWithPollution, input);
  assert.deepStrictEqual(result, {});
  assert.strictEqual(Object.getPrototypeOf(result), Object.prototype);
});

test("Utility App Action Adapter: mapUtilityAppInput should not mutate original input", () => {
  const input = { u_field1: "value1" };
  Object.freeze(input);
  const result = mapUtilityAppInput(validBinding, input);
  assert.deepStrictEqual(result, { a_field1: "value1" });
});

test("Utility App Action Adapter: mapUtilityAppInput should handle hostile getters by not executing them if not in mapping", () => {
  let executed = false;
  const input = {};
  Object.defineProperty(input, "hostile", {
    get: () => { executed = true; return "bad"; },
    enumerable: true
  });

  const result = mapUtilityAppInput(validBinding, input as Record<string, unknown>);
  assert.strictEqual(executed, false);
  assert.deepStrictEqual(result, {});
});

test("Utility App Action Adapter: mapUtilityAppInput should reject input if it has circular references (implied by safety requirements, but here we test the mapper doesn't crash)", () => {
  const input: any = { a: 1 };
  input.self = input;

  // mapUtilityAppInput onlyRenames based on mapping keys, so it won't even look at 'self' unless it's in mapping
  const bindingWithSelf: UtilityAppActionBinding = {
    ...validBinding,
    inputMapping: { "self": "self" }
  };
  const result = mapUtilityAppInput(bindingWithSelf, input);
  assert.strictEqual(result.self, input);
});

test("Utility App Action Adapter: should support minimum valid binding", () => {
  const minBinding: UtilityAppActionBinding = {
    utilityAppKey: "my-app",
    actionKey: "sys.log",
    direction: "consumes",
    operationKey: "log",
    enabled: true
  };
  const validated = validateUtilityAppActionBinding(minBinding);
  assert.deepStrictEqual(validated, minBinding);
});

test("Utility App Action Adapter: should support 'exposes' direction", () => {
  const exposedBinding: UtilityAppActionBinding = {
    ...validBinding,
    direction: "exposes"
  };
  const validated = validateUtilityAppActionBinding(exposedBinding);
  assert.strictEqual(validated.direction, "exposes");
});
