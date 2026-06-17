import { test } from "node:test";
import assert from "node:assert";
import {
  ActionDescriptorSchema,
  ActionDescriptorKeySchema
} from "../../src/platform/actions/contracts/action-descriptor";
import { checkSafety } from "../../src/platform/actions/contracts/safe-traversal";

const validDescriptorBase = {
  key: "test.action",
  name: "Test Action",
  handlerKey: "testHandler",
  inputSchema: { type: "string" },
  outputSchema: { type: "boolean" },
};

test("checkSafety - should reject functions", () => {
  const result = checkSafety(() => {});
  assert.strictEqual(result.isSafe, false);
  if (!result.isSafe) assert.strictEqual(result.reason, "FUNCTION");
});

test("checkSafety - should reject accessors (getters)", () => {
  let executed = false;
  const obj = {};
  Object.defineProperty(obj, "evil", {
    get: () => {
      executed = true;
      return "evil";
    },
    enumerable: true
  });

  const result = checkSafety(obj);
  assert.strictEqual(result.isSafe, false);
  if (!result.isSafe) assert.strictEqual(result.reason, "ACCESSOR");
  assert.strictEqual(executed, false, "Getter MUST NOT be executed");
});

test("checkSafety - should reject accessors (setters)", () => {
  const obj = {};
  Object.defineProperty(obj, "evil", {
    set: () => {},
    enumerable: true
  });

  const result = checkSafety(obj);
  assert.strictEqual(result.isSafe, false);
  if (!result.isSafe) assert.strictEqual(result.reason, "ACCESSOR");
});

test("checkSafety - should reject cycles", () => {
  const obj: any = {};
  obj.self = obj;

  const result = checkSafety(obj);
  assert.strictEqual(result.isSafe, false);
  if (!result.isSafe) assert.strictEqual(result.reason, "CYCLE");
});

test("checkSafety - should ignore prototype-inherited functions", () => {
  const proto = { inheritedFn: () => {} };
  const obj = Object.create(proto);
  obj.type = "string";

  const result = checkSafety(obj);
  assert.strictEqual(result.isSafe, true);
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

test("ActionDescriptorSchema - missing mandatory fields", () => {
  const fields = ["key", "name", "inputSchema", "outputSchema", "handlerKey"];
  for (const field of fields) {
    const descriptor = { ...validDescriptorBase };
    // @ts-expect-error - testing missing field
    delete descriptor[field as keyof typeof validDescriptorBase];
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

test("ActionDescriptorSchema - cyclic inputSchema rejection", () => {
  const inputSchema: any = { type: "object" };
  inputSchema.self = inputSchema;

  const descriptor = {
    ...validDescriptorBase,
    inputSchema
  };

  const result = ActionDescriptorSchema.safeParse(descriptor);
  assert.strictEqual(result.success, false, "Should reject cycles in inputSchema");
});

test("ActionDescriptorSchema - cyclic outputSchema rejection", () => {
  const outputSchema: any = { type: "object" };
  outputSchema.self = outputSchema;

  const descriptor = {
    ...validDescriptorBase,
    outputSchema
  };

  const result = ActionDescriptorSchema.safeParse(descriptor);
  assert.strictEqual(result.success, false, "Should reject cycles in outputSchema");
});

test("ActionDescriptorSchema - nested getter rejection", () => {
  let executed = false;
  const inputSchema = {};
  Object.defineProperty(inputSchema, "evilGetter", {
    get: () => {
      executed = true;
      return "evil";
    },
    enumerable: true,
  });

  const descriptor = {
    ...validDescriptorBase,
    inputSchema
  };

  const result = ActionDescriptorSchema.safeParse(descriptor);
  assert.strictEqual(result.success, false, "Should reject getters in inputSchema");
  assert.strictEqual(executed, false, "Getter was executed!");
});

test("ActionDescriptorSchema - setter-only property rejection", () => {
  const inputSchema = {};
  Object.defineProperty(inputSchema, "evilSetter", {
    set: () => {},
    enumerable: true,
  });

  const descriptor = {
    ...validDescriptorBase,
    inputSchema
  };

  const result = ActionDescriptorSchema.safeParse(descriptor);
  assert.strictEqual(result.success, false, "Should reject setters in inputSchema");
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
