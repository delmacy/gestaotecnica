import { test } from "node:test";
import assert from "node:assert/strict";
import { canonicalizeTraceValue } from "../../src/platform/documents/traceability/canonicalization";

test("canonicalizeTraceValue", async (t) => {
  await t.test("should canonicalize simple objects", () => {
    const input = { a: 1, b: "test", c: true, d: null };
    const expected = '{"a":1,"b":"test","c":true,"d":null}';
    assert.strictEqual(canonicalizeTraceValue(input), expected);
  });

  await t.test("should sort keys lexicographically", () => {
    const input1 = { b: 2, a: 1 };
    const input2 = { a: 1, b: 2 };
    const expected = '{"a":1,"b":2}';
    assert.strictEqual(canonicalizeTraceValue(input1), expected);
    assert.strictEqual(canonicalizeTraceValue(input2), expected);
  });

  await t.test("should handle nested objects", () => {
    const input = { b: { d: 4, c: 3 }, a: 1 };
    const expected = '{"a":1,"b":{"c":3,"d":4}}';
    assert.strictEqual(canonicalizeTraceValue(input), expected);
  });

  await t.test("should handle nested arrays", () => {
    const input = { a: [3, 2, 1], b: [{ z: 1 }, { y: 2 }] };
    const expected = '{"a":[3,2,1],"b":[{"z":1},{"y":2}]}';
    assert.strictEqual(canonicalizeTraceValue(input), expected);
  });

  await t.test("should preserve array order", () => {
    const input = [1, 2, 3];
    const expected = '[1,2,3]';
    assert.strictEqual(canonicalizeTraceValue(input), expected);
  });

  await t.test("should omit undefined in objects", () => {
    const input = { a: 1, b: undefined };
    const expected = '{"a":1}';
    assert.strictEqual(canonicalizeTraceValue(input), expected);
  });

  await t.test("should convert undefined in array to null", () => {
    const input = [1, undefined, 3];
    const expected = '[1,null,3]';
    assert.strictEqual(canonicalizeTraceValue(input), expected);
  });

  await t.test("should handle Unicode characters", () => {
    const input = { emoji: "🚀", latin: "áéíóú" };
    const expected = '{"emoji":"🚀","latin":"áéíóú"}';
    assert.strictEqual(canonicalizeTraceValue(input), expected);
  });

  await t.test("should handle objects with null prototype", () => {
    const input = Object.create(null);
    input.a = 1;
    const expected = '{"a":1}';
    assert.strictEqual(canonicalizeTraceValue(input), expected);
  });

  await t.test("should handle shared references (not circular)", () => {
    const shared = { x: 1 };
    const input = { a: shared, b: shared };
    const expected = '{"a":{"x":1},"b":{"x":1}}';
    assert.strictEqual(canonicalizeTraceValue(input), expected);
  });

  await t.test("should handle shared references in arrays", () => {
    const shared = { x: 1 };
    const input = [shared, shared];
    const expected = '[{"x":1},{"x":1}]';
    assert.strictEqual(canonicalizeTraceValue(input), expected);
  });

  await t.test("should reject direct circular references", () => {
    const input: Record<string, unknown> = {};
    input.self = input;
    assert.throws(() => canonicalizeTraceValue(input), { message: "NON_CANONICAL_CIRCULAR_REFERENCE" });
  });

  await t.test("should reject indirect circular references", () => {
    const a: Record<string, unknown> = {};
    const b: Record<string, unknown> = { a };
    a.b = b;
    assert.throws(() => canonicalizeTraceValue(a), { message: "NON_CANONICAL_CIRCULAR_REFERENCE" });
  });

  await t.test("should reject BigInt", () => {
    assert.throws(() => canonicalizeTraceValue({ val: BigInt(123) }), { message: "NON_CANONICAL_BIGINT" });
  });

  await t.test("should reject function", () => {
    assert.throws(() => canonicalizeTraceValue({ val: () => {} }), { message: "NON_CANONICAL_FUNCTION" });
  });

  await t.test("should reject symbol", () => {
    assert.throws(() => canonicalizeTraceValue({ val: Symbol("test") }), { message: "NON_CANONICAL_SYMBOL" });
  });

  await t.test("should reject NaN", () => {
    assert.throws(() => canonicalizeTraceValue({ val: NaN }), { message: "NON_CANONICAL_NON_FINITE_NUMBER" });
  });

  await t.test("should reject Infinity", () => {
    assert.throws(() => canonicalizeTraceValue({ val: Infinity }), { message: "NON_CANONICAL_NON_FINITE_NUMBER" });
  });

  await t.test("should reject Date object", () => {
    assert.throws(() => canonicalizeTraceValue({ val: new Date() }), { message: "NON_CANONICAL_OBJECT_TYPE" });
  });

  await t.test("should reject Map", () => {
    assert.throws(() => canonicalizeTraceValue(new Map()), { message: "NON_CANONICAL_OBJECT_TYPE" });
  });

  await t.test("should reject Set", () => {
    assert.throws(() => canonicalizeTraceValue(new Set()), { message: "NON_CANONICAL_OBJECT_TYPE" });
  });

  await t.test("should reject custom classes", () => {
    class MyClass { a = 1; }
    assert.throws(() => canonicalizeTraceValue(new MyClass()), { message: "NON_CANONICAL_OBJECT_TYPE" });
  });

  await t.test("should reject getters without executing them", () => {
    let executed = false;
    const input = {
      get foo() {
        executed = true;
        return "bar";
      }
    };
    assert.throws(() => canonicalizeTraceValue(input), { message: "NON_CANONICAL_ACCESSOR_PROPERTY" });
    assert.strictEqual(executed, false, "Getter should not have been executed");
  });

  await t.test("should handle hostile Proxy on Object.keys", () => {
    const target = {};
    const proxy = new Proxy(target, {
      ownKeys() {
        throw new Error("Proxy error");
      }
    });
    assert.throws(() => canonicalizeTraceValue(proxy), { message: "NON_CANONICAL_PROPERTY_ACCESS" });
  });

  await t.test("should handle frozen inputs", () => {
    const input = Object.freeze({ a: 1, b: Object.freeze([2, 3]) });
    const expected = '{"a":1,"b":[2,3]}';
    assert.strictEqual(canonicalizeTraceValue(input), expected);
  });

  await t.test("should not mutate input", () => {
    const input = { b: 2, a: 1 };
    const originalKeys = Object.keys(input);
    canonicalizeTraceValue(input);
    assert.deepStrictEqual(Object.keys(input), originalKeys);
  });

  await t.test("should reject undefined at root", () => {
    assert.throws(() => canonicalizeTraceValue(undefined), { message: "NON_CANONICAL_OBJECT_TYPE" });
  });

  await t.test("should reject accessor on array index without execution", () => {
    let getterExecuted = false;
    const input: unknown[] = [];
    Object.defineProperty(input, "0", {
      enumerable: true,
      configurable: true,
      get() {
        getterExecuted = true;
        return "unsafe";
      },
    });
    input.length = 1;

    assert.throws(() => canonicalizeTraceValue(input), { message: "NON_CANONICAL_ACCESSOR_PROPERTY" });
    assert.strictEqual(getterExecuted, false, "Array index getter should not have been executed");
  });

  await t.test("should handle hostile Proxy on Object.getPrototypeOf", () => {
    const target = {};
    const proxy = new Proxy(target, {
      getPrototypeOf() {
        throw new Error("Proxy error");
      }
    });
    assert.throws(() => canonicalizeTraceValue(proxy), { message: "NON_CANONICAL_PROPERTY_ACCESS" });
  });

  await t.test("should handle hostile Proxy on Object.getOwnPropertyDescriptor", () => {
    const target = { a: 1 };
    const proxy = new Proxy(target, {
      getOwnPropertyDescriptor() {
        throw new Error("Proxy error");
      }
    });
    assert.throws(() => canonicalizeTraceValue(proxy), { message: "NON_CANONICAL_PROPERTY_ACCESS" });
  });
});
