import { test } from "node:test";
import assert from "node:assert";
import {
  ActionDescriptorSchema,
  ActionDescriptorKeySchema
} from "../../src/platform/actions/contracts/action-descriptor";
import { hasFunction } from "../../src/platform/actions/contracts/safe-traversal";

const validDescriptorBase = {
  key: "test.action",
  name: "Test Action",
  handlerKey: "testHandler",
  inputSchema: { type: "string" },
  outputSchema: { type: "boolean" },
};

test("Safe Traversal - should not execute getters", () => {
  let executed = false;
  const obj = {};
  Object.defineProperty(obj, "evil", {
    get: () => {
      executed = true;
      return () => "evil";
    },
    enumerable: true
  });

  const result = hasFunction(obj);
  assert.strictEqual(result, false, "Should be false because getter is not executed");
  assert.strictEqual(executed, false, "Getter MUST NOT be executed");
});

test("ActionDescriptorSchema - minimum valid descriptor using only evidence-backed fields", () => {
  const result = ActionDescriptorSchema.safeParse(validDescriptorBase);
  assert.strictEqual(result.success, true);
});

test("ActionDescriptorSchema - complete valid descriptor", () => {
  const completeDescriptor = {
    ...validDescriptorBase,
    description: "Detailed description",
    version: 1,
    status: "published",
    executionMode: "sync",
    sideEffect: "none",
    idempotent: true,
    timeoutMs: 5000,
    tags: ["tag1", "tag2"],
  };
  const result = ActionDescriptorSchema.safeParse(completeDescriptor);
  assert.strictEqual(result.success, true);
});

test("ActionDescriptorKeySchema - real action keys", () => {
  const realKeys = [
    "workspaces.update",
    "organizations.create",
    "schedules.create",
    "work_items.transition",
    "processes.get_definition"
  ];
  for (const key of realKeys) {
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
  const fields = ["key", "name", "inputSchema", "outputSchema", "handlerKey"];
  for (const field of fields) {
    const descriptor = { ...validDescriptorBase };
    // @ts-expect-error - testing missing field
    delete descriptor[field];
    assert.strictEqual(ActionDescriptorSchema.safeParse(descriptor).success, false, `Missing mandatory field: ${field}`);
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

test("ActionDescriptorSchema - own function rejection", () => {
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

test("ActionDescriptorSchema - prototype-inherited function ignored", () => {
  const proto = { inheritedFn: () => "evil" };
  const inputSchema = Object.create(proto);
  inputSchema.type = "string";

  const descriptor = {
    ...validDescriptorBase,
    inputSchema
  };

  const result = ActionDescriptorSchema.safeParse(descriptor);
  assert.strictEqual(result.success, true, "Inherited functions should be ignored by safe traversal");
});

test("ActionDescriptorSchema - cyclic input/output schema", () => {
  const inputSchema: any = { type: "object" };
  inputSchema.self = inputSchema;

  const descriptor = {
    ...validDescriptorBase,
    inputSchema
  };

  const result = ActionDescriptorSchema.safeParse(descriptor);
  assert.strictEqual(result.success, true, "Cycles should be handled safely");
});

test("ActionDescriptorSchema - nested getter (should not be executed)", () => {
  // Re-verify manually because of previous test failure confusion
  let executed = false;
  const inputSchema = {};
  Object.defineProperty(inputSchema, "evilGetter", {
    get: () => {
      executed = true;
      return () => "evil";
    },
    enumerable: true,
  });

  const result = hasFunction(inputSchema);
  assert.strictEqual(result, false);
  assert.strictEqual(executed, false);
});

test("ActionDescriptorSchema - revoked proxy rejection", () => {
  const revocable = Proxy.revocable({}, {});
  const proxy = revocable.proxy;
  revocable.revoke();

  const descriptor = {
    ...validDescriptorBase,
    inputSchema: {
      badProxy: proxy
    }
  };

  const result = ActionDescriptorSchema.safeParse(descriptor);
  assert.strictEqual(result.success, false, "Revoked proxy should cause rejection");
});

test("ActionDescriptorSchema - input immutability (not mutated by parse)", () => {
  const input = JSON.parse(JSON.stringify(validDescriptorBase));
  ActionDescriptorSchema.parse(input);
  assert.deepStrictEqual(input, validDescriptorBase);
});
