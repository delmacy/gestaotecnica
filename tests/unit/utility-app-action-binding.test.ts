import { test } from "node:test";
import assert from "node:assert/strict";
import { UtilityAppActionBindingSchema } from "../../src/platform/utility-apps/contracts/utility-app-action-binding";

test("UtilityAppActionBindingSchema - valid minimal definition", () => {
  const validBase = {
    actionDescriptorKey: "sys.my_action",
    mapping: {
      "inputField": "targetField"
    }
  };
  const result = UtilityAppActionBindingSchema.safeParse(validBase);
  assert.ok(result.success, "Should be valid without metadata");
});

test("UtilityAppActionBindingSchema - valid complete definition", () => {
  const complete = {
    actionDescriptorKey: "sys.my_action",
    mapping: {
      "inputField": "targetField"
    },
    metadata: {
      "someKey": "someValue"
    }
  };
  const result = UtilityAppActionBindingSchema.safeParse(complete);
  assert.ok(result.success, "Should be valid with safe metadata");
});

test("UtilityAppActionBindingSchema - invalid action descriptor key", () => {
  const invalid = {
    actionDescriptorKey: "invalidKey", // no dot
    mapping: {}
  };
  const result = UtilityAppActionBindingSchema.safeParse(invalid);
  assert.strictEqual(result.success, false, "Should reject invalid action descriptor key");
});

test("UtilityAppActionBindingSchema - metadata must be plain object", () => {
  const invalidMetadataTypes = [
    null,
    "string",
    123,
    true,
    []
  ];

  for (const metadata of invalidMetadataTypes) {
    const invalid = {
      actionDescriptorKey: "sys.my_action",
      mapping: {},
      metadata
    };
    const result = UtilityAppActionBindingSchema.safeParse(invalid);
    assert.strictEqual(result.success, false, `Should reject metadata of type ${metadata === null ? "null" : typeof metadata}`);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, "metadata must be a plain object");
    }
  }
});

test("UtilityAppActionBindingSchema - metadata rejects accessors", () => {
  const invalid = {
    actionDescriptorKey: "sys.my_action",
    mapping: {},
    metadata: {}
  };
  Object.defineProperty(invalid.metadata, "prop", {
    get() { return "value"; }
  });

  const result = UtilityAppActionBindingSchema.safeParse(invalid);
  assert.strictEqual(result.success, false, "Should reject metadata with getters");
  if (!result.success) {
    assert.ok(result.error.issues[0].message.includes("metadata is unsafe: ACCESSOR"));
  }
});

test("UtilityAppActionBindingSchema - metadata rejects functions", () => {
  const invalid = {
    actionDescriptorKey: "sys.my_action",
    mapping: {},
    metadata: {
      fn: () => {}
    }
  };

  const result = UtilityAppActionBindingSchema.safeParse(invalid);
  assert.strictEqual(result.success, false, "Should reject metadata with functions");
  if (!result.success) {
    assert.ok(result.error.issues[0].message.includes("metadata is unsafe: FUNCTION"));
  }
});
