import { test } from "node:test";
import assert from "node:assert";
import {
  ActionDescriptorSchema,
  ActionDescriptorKeySchema
} from "../../src/platform/actions/contracts/action-descriptor";
import { checkSafety } from "../../src/platform/actions/contracts/safe-traversal";

type MutableRecord = Record<string, unknown>;

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
  const obj: MutableRecord = {};
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
  const obj: MutableRecord = {};
  Object.defineProperty(obj, "evil", {
    set: () => {},
    enumerable: true
  });

  const result = checkSafety(obj);
  assert.strictEqual(result.isSafe, false);
  if (!result.isSafe) assert.strictEqual(result.reason, "ACCESSOR");
});

test("checkSafety - should reject cycles", () => {
  const obj: MutableRecord = {};
  obj.self = obj;

  const result = checkSafety(obj);
  assert.strictEqual(result.isSafe, false);
  if (!result.isSafe) assert.strictEqual(result.reason, "CYCLE");
});

test("checkSafety - should allow shared references (DAG)", () => {
  const shared: MutableRecord = { detail: "shared" };
  const obj: MutableRecord = {
    a: shared,
    b: shared
  };

  const result = checkSafety(obj);
  assert.strictEqual(result.isSafe, true, "Shared references should be allowed if acyclic");
});

test("checkSafety - should reject non-plain built-ins", () => {
  assert.strictEqual(checkSafety(new Date()).isSafe, false, "Date");
  assert.strictEqual(checkSafety(new Map()).isSafe, false, "Map");
  assert.strictEqual(checkSafety(new Set()).isSafe, false, "Set");
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

test("ActionDescriptorSchema - primitive schemas rejection", () => {
  assert.strictEqual(ActionDescriptorSchema.safeParse({ ...validDescriptorBase, inputSchema: "string" }).success, false, "string schema");
  assert.strictEqual(ActionDescriptorSchema.safeParse({ ...validDescriptorBase, inputSchema: 123 }).success, false, "number schema");
  assert.strictEqual(ActionDescriptorSchema.safeParse({ ...validDescriptorBase, inputSchema: true }).success, false, "boolean schema");
});

test("ActionDescriptorSchema - array schemas rejection", () => {
  assert.strictEqual(ActionDescriptorSchema.safeParse({ ...validDescriptorBase, inputSchema: [] }).success, false, "array schema");
});

test("ActionDescriptorSchema - cyclic schemas rejection", () => {
  const inputSchema: MutableRecord = { type: "object" };
  inputSchema.self = inputSchema;

  const result = ActionDescriptorSchema.safeParse({ ...validDescriptorBase, inputSchema });
  assert.strictEqual(result.success, false, "Should reject cycles");
  if (!result.success) {
    assert.ok(result.error.issues.some(i => i.message.includes("CYCLE")));
  }
});

test("ActionDescriptorSchema - nested getter rejection", () => {
  let executed = false;
  const inputSchema: MutableRecord = {};
  Object.defineProperty(inputSchema, "evilGetter", {
    get: () => {
      executed = true;
      return "evil";
    },
    enumerable: true,
  });

  const result = ActionDescriptorSchema.safeParse({ ...validDescriptorBase, inputSchema });
  assert.strictEqual(result.success, false, "Should reject getters");
  assert.strictEqual(executed, false, "Getter was executed!");
});

test("ActionDescriptorSchema - setter-only property rejection", () => {
  const inputSchema: MutableRecord = {};
  Object.defineProperty(inputSchema, "evilSetter", {
    set: () => {},
    enumerable: true,
  });

  const result = ActionDescriptorSchema.safeParse({ ...validDescriptorBase, inputSchema });
  assert.strictEqual(result.success, false, "Should reject setters");
});

test("ActionDescriptorSchema - revoked proxy rejection", () => {
  const revocable = Proxy.revocable({}, {});
  const proxy = revocable.proxy;
  revocable.revoke();

  const result = ActionDescriptorSchema.safeParse({
    ...validDescriptorBase,
    inputSchema: { badProxy: proxy }
  });

  assert.strictEqual(result.success, false, "Revoked proxy should cause rejection");
});

test("ActionDescriptorSchema - input immutability (not mutated by parse)", () => {
  const input = JSON.parse(JSON.stringify(validDescriptorBase));
  ActionDescriptorSchema.parse(input);
  assert.deepStrictEqual(input, validDescriptorBase);
});
