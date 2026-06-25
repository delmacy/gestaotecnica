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
  const obj: MutableRecord = { type: "object" };
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

test("checkSafety - should reject custom class instances", () => {
  class Custom {}
  assert.strictEqual(checkSafety(new Custom()).isSafe, false);
});

test("checkSafety - should accept Object.create(null)", () => {
  const obj = Object.create(null);
  obj.type = "string";
  assert.strictEqual(checkSafety(obj).isSafe, true);
});

test("checkSafety - should reject hostile Symbol.toStringTag getter", () => {
  let executed = false;
  const obj: MutableRecord = {};
  Object.defineProperty(obj, Symbol.toStringTag, {
    get: () => {
      executed = true;
      return "Hostile";
    },
    enumerable: true,
  });

  const result = checkSafety(obj);
  assert.strictEqual(result.isSafe, false);
  if (!result.isSafe) assert.strictEqual(result.reason, "ACCESSOR");
  assert.strictEqual(executed, false, "toStringTag getter MUST NOT be executed");
});

test("checkSafety - should handle revoked proxy passed directly", () => {
  const revocable = Proxy.revocable({}, {});
  const proxy = revocable.proxy;
  revocable.revoke();

  const result = checkSafety(proxy);
  assert.strictEqual(result.isSafe, false);
  if (!result.isSafe) assert.strictEqual(result.reason, "REVOKED_PROXY");
});

test("ActionDescriptorSchema - minimum valid descriptor using only evidence-backed fields", () => {
  const result = ActionDescriptorSchema.safeParse(validDescriptorBase);
  assert.strictEqual(result.success, true);
});

test("ActionDescriptorSchema - nested arrays in schemas should be accepted", () => {
  const descriptor = {
    ...validDescriptorBase,
    inputSchema: {
      type: "object",
      properties: {
        list: ["a", "b"]
      }
    }
  };
  assert.strictEqual(ActionDescriptorSchema.safeParse(descriptor).success, true);
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

test("ActionDescriptorSchema - missing mandatory fields", () => {
  const fields = ["key", "name", "inputSchema", "outputSchema", "handlerKey"];
  for (const field of fields) {
    const descriptor = { ...validDescriptorBase };
    delete descriptor[field as keyof typeof validDescriptorBase];
    assert.strictEqual(ActionDescriptorSchema.safeParse(descriptor).success, false, `Missing mandatory field: ${field}`);
  }
});

test("ActionDescriptorSchema - deterministic rejection of invalid identifiers", () => {
  const invalidKeys = [
    "NoDots",
    "trailing.dot.",
    ".leading.dot",
    "spaces in.key",
    "UpperCase.Key",
    "special@chars.key"
  ];
  for (const key of invalidKeys) {
    assert.strictEqual(ActionDescriptorKeySchema.safeParse(key).success, false, `Key should be invalid: ${key}`);
  }
});

test("ActionDescriptorSchema - deterministic rejection of invalid versions", () => {
  const invalidVersions = [
    -1, // negative
    0,  // zero
    1.5 // not an integer
  ];
  for (const version of invalidVersions) {
    const descriptor = { ...validDescriptorBase, version };
    assert.strictEqual(ActionDescriptorSchema.safeParse(descriptor).success, false, `Version should be invalid: ${version}`);
  }
});

test("ActionDescriptorSchema - primitive schemas rejection", () => {
  assert.strictEqual(ActionDescriptorSchema.safeParse({ ...validDescriptorBase, inputSchema: "string" }).success, false, "string schema");
});

test("ActionDescriptorSchema - array schemas rejection at top level", () => {
  assert.strictEqual(ActionDescriptorSchema.safeParse({ ...validDescriptorBase, inputSchema: [] }).success, false, "array schema");
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

import { validateActionDescriptor } from "../../src/platform/actions/contracts/action-descriptor";
import { ZodError } from "zod";

test("validateActionDescriptor - wraps schema parsing correctly", () => {
  const valid = validateActionDescriptor(validDescriptorBase);
  assert.deepStrictEqual(valid, validDescriptorBase);

  assert.throws(
    () => {
      validateActionDescriptor({ ...validDescriptorBase, key: "invalid" });
    },
    (err: unknown) => err instanceof ZodError,
    "Should throw ZodError on invalid descriptor"
  );
});
