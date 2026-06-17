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

test("Utility App Action Adapter: should fail on unsafe metadata (SafeJsonRecordSchema)", () => {
  const invalid = {
    ...validBinding,
    metadata: { fn: () => {} }
  };
  assert.throws(() => validateUtilityAppActionBinding(invalid));
});

test("Utility App Action Adapter: should fail on non-object metadata", () => {
  const invalid = { ...validBinding, metadata: "not-an-object" };
  assert.throws(() => validateUtilityAppActionBinding(invalid));
});

test("Utility App Action Adapter: should fail on array metadata", () => {
  const invalid = { ...validBinding, metadata: [1, 2, 3] };
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

test("Utility App Action Adapter: should fail on mapping with accessors (SafeJsonRecordSchema check)", () => {
  const mapping = {};
  Object.defineProperty(mapping, "field", {
    get: () => "target",
    enumerable: true
  });
  const invalid = { ...validBinding, inputMapping: mapping };
  assert.throws(() => validateUtilityAppActionBinding(invalid));
});

test("Utility App Action Adapter: mapUtilityAppInput should map fields correctly", () => {
  const input = {
    u_field1: "value1",
    u_field2: 123,
    other: "ignored"
  };
  const result = mapUtilityAppInput(validBinding, input);
  assert.strictEqual(result.success, true);
  if (result.success) {
    assert.strictEqual(result.data.a_field1, "value1");
    assert.strictEqual(result.data.a_field2, 123);
    assert.strictEqual(Object.getPrototypeOf(result.data), null);
  }
});

test("Utility App Action Adapter: mapUtilityAppInput should handle missing fields", () => {
  const input = {
    u_field1: "value1"
  };
  const result = mapUtilityAppInput(validBinding, input);
  assert.strictEqual(result.success, true);
  if (result.success) {
    assert.strictEqual(result.data.a_field1, "value1");
    assert.strictEqual(Object.keys(result.data).length, 1);
  }
});

test("Utility App Action Adapter: mapActionOutput should map fields correctly", () => {
  const output = {
    a_result: "success",
    a_other: "ignored"
  };
  const result = mapActionOutput(validBinding, output);
  assert.strictEqual(result.success, true);
  if (result.success) {
    assert.strictEqual(result.data.u_result, "success");
    assert.strictEqual(Object.getPrototypeOf(result.data), null);
  }
});

test("Utility App Action Adapter: should prevent prototype pollution in mapping (validation)", () => {
  const mapping = JSON.parse('{"u_field": "__proto__"}') as Record<string, string>;
  const bindingWithPollution = {
    ...validBinding,
    inputMapping: mapping
  };
  assert.throws(() => validateUtilityAppActionBinding(bindingWithPollution));
});

test("Utility App Action Adapter: mapUtilityAppInput should not mutate original input", () => {
  const input = { u_field1: "value1" };
  Object.freeze(input);
  const result = mapUtilityAppInput(validBinding, input);
  assert.strictEqual(result.success, true);
});

test("Utility App Action Adapter: mapUtilityAppInput should handle hostile getters by not executing them if not in mapping", () => {
  let executed = false;
  const input = {};
  Object.defineProperty(input, "hostile", {
    get: () => { executed = true; return "bad"; },
    enumerable: true
  });

  const result = mapUtilityAppInput(validBinding, input as Record<string, unknown>);
  assert.strictEqual(result.success, true);
  assert.strictEqual(executed, false);
});

test("Utility App Action Adapter: mapUtilityAppInput should return error result if own mapped field is a getter", () => {
  let executed = false;
  const input = {};
  Object.defineProperty(input, "u_field1", {
    get: () => { executed = true; return "bad"; },
    enumerable: true
  });

  const result = mapUtilityAppInput(validBinding, input as Record<string, unknown>);
  assert.strictEqual(result.success, false);
  if (!result.success) {
    assert.strictEqual(result.issues[0].code, "ACCESSOR_DETECTED");
  }
  assert.strictEqual(executed, false);
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

test("Utility App Action Adapter: mapping proxy should be rejected in validation (SafeJsonRecordSchema)", () => {
  const proxy = new Proxy({}, { getPrototypeOf: () => ({}) });
  const invalid = { ...validBinding, inputMapping: proxy };
  assert.throws(() => validateUtilityAppActionBinding(invalid));
});

test("Utility App Action Adapter: should reject symbols in mapping keys", () => {
  const mapping = { [Symbol("test")]: "target" };
  const invalid = { ...validBinding, inputMapping: mapping };
  assert.throws(() => validateUtilityAppActionBinding(invalid));
});

test("Utility App Action Adapter: should fail if mapping target is a dangerous property", () => {
  const invalid = {
    ...validBinding,
    inputMapping: { "field": "constructor" }
  };
  assert.throws(() => validateUtilityAppActionBinding(invalid));
});

test("Utility App Action Adapter: result data should be prototype-safe", () => {
  const result = mapUtilityAppInput(validBinding, { u_field1: "val" });
  assert.strictEqual(result.success, true);
  if (result.success) {
    assert.strictEqual(Object.getPrototypeOf(result.data), null);
    assert.strictEqual((result.data as any).constructor, undefined);
    assert.strictEqual((result.data as any).__proto__, undefined);
  }
});

test("Utility App Action Adapter: should reject revoked proxy as input (Object.getOwnPropertyDescriptor throws)", () => {
  const { proxy, revoke } = Proxy.revocable({ u_field1: "val" }, {});
  revoke();

  assert.throws(() => mapUtilityAppInput(validBinding, proxy as Record<string, unknown>));
});
