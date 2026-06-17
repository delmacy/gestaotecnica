import { test } from "node:test";
import assert from "node:assert";
import {
  ActionDescriptorSchema,
  ActionDescriptorKeySchema
} from "../../src/platform/actions/contracts/action-descriptor";

const validDescriptorBase = {
  key: "test.action",
  name: "Test Action",
  version: 1,
  status: "published",
  inputSchema: { type: "string" },
  outputSchema: { type: "boolean" },
  handlerKey: "testHandler",
  executionMode: "sync",
  sideEffect: "none",
  idempotent: true,
};

test("ActionDescriptorSchema - minimum valid descriptor", () => {
  const result = ActionDescriptorSchema.safeParse(validDescriptorBase);
  assert.strictEqual(result.success, true);
});

test("ActionDescriptorSchema - complete valid descriptor", () => {
  const completeDescriptor = {
    ...validDescriptorBase,
    description: "Detailed description",
    timeoutMs: 5000,
    tags: ["tag1", "tag2"],
  };
  const result = ActionDescriptorSchema.safeParse(completeDescriptor);
  assert.strictEqual(result.success, true);
});

test("ActionDescriptorKeySchema - valid keys", () => {
  const validKeys = ["workspaces.update", "crm.leads.convert", "system.v1.check"];
  for (const key of validKeys) {
    assert.strictEqual(ActionDescriptorKeySchema.safeParse(key).success, true, `Key should be valid: ${key}`);
  }
});

test("ActionDescriptorKeySchema - invalid keys", () => {
  const invalidKeys = ["action", "test.", ".test", "test..action", "Test.Action", "test.action!"];
  for (const key of invalidKeys) {
    assert.strictEqual(ActionDescriptorKeySchema.safeParse(key).success, false, `Key should be invalid: ${key}`);
  }
});

test("ActionDescriptorSchema - invalid version", () => {
  assert.strictEqual(ActionDescriptorSchema.safeParse({ ...validDescriptorBase, version: 0 }).success, false, "version zero");
  assert.strictEqual(ActionDescriptorSchema.safeParse({ ...validDescriptorBase, version: -1 }).success, false, "version negative");
  assert.strictEqual(ActionDescriptorSchema.safeParse({ ...validDescriptorBase, version: 1.5 }).success, false, "version decimal");
});

test("ActionDescriptorSchema - invalid status", () => {
  // @ts-expect-error - testing invalid status
  assert.strictEqual(ActionDescriptorSchema.safeParse({ ...validDescriptorBase, status: "invalid" }).success, false);
});

test("ActionDescriptorSchema - missing mandatory fields", () => {
  const fields = ["key", "name", "version", "status", "inputSchema", "outputSchema", "handlerKey", "executionMode", "sideEffect"];
  for (const field of fields) {
    const descriptor = { ...validDescriptorBase };
    // @ts-expect-error - testing missing field
    delete descriptor[field];
    assert.strictEqual(ActionDescriptorSchema.safeParse(descriptor).success, false, `Missing field: ${field}`);
  }
});

test("ActionDescriptorSchema - duplicate tags", () => {
  assert.strictEqual(ActionDescriptorSchema.safeParse({ ...validDescriptorBase, tags: ["a", "a"] }).success, false);
});

test("ActionDescriptorSchema - invalid timeout", () => {
  assert.strictEqual(ActionDescriptorSchema.safeParse({ ...validDescriptorBase, timeoutMs: 0 }).success, false, "timeout zero");
  assert.strictEqual(ActionDescriptorSchema.safeParse({ ...validDescriptorBase, timeoutMs: -100 }).success, false, "timeout negative");
});

test("ActionDescriptorSchema - unknown field rejection", () => {
  assert.strictEqual(ActionDescriptorSchema.safeParse({ ...validDescriptorBase, extra: "field" }).success, false);
});

test("ActionDescriptorSchema - function rejection in schemas", () => {
  const descriptorWithFunction = {
    ...validDescriptorBase,
    inputSchema: {
      fn: () => "evil"
    }
  };
  const result = ActionDescriptorSchema.safeParse(descriptorWithFunction);
  assert.strictEqual(result.success, false);
  if (!result.success) {
    assert.ok(result.error.issues.some(i => i.message.includes("must not contain functions")));
  }
});

test("ActionDescriptorSchema - deep function rejection in schemas", () => {
  const descriptorWithFunction = {
    ...validDescriptorBase,
    outputSchema: {
      nested: {
        deeply: {
          fn: () => "evil"
        }
      }
    }
  };
  const result = ActionDescriptorSchema.safeParse(descriptorWithFunction);
  assert.strictEqual(result.success, false);
});

test("ActionDescriptorSchema - input immutability (not mutated by parse)", () => {
  const input = JSON.parse(JSON.stringify(validDescriptorBase));
  ActionDescriptorSchema.parse(input);
  assert.deepStrictEqual(input, validDescriptorBase);
});
