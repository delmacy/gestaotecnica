import test from "node:test";
import assert from "node:assert";
import { checkSafeJsonValue, SafeJsonValueSchema, SafeJsonRecordSchema } from "@/platform/contracts/safe-json";

test("Safe JSON Contract - Primitives", async (t) => {
  await t.test("Allows null", () => {
    assert.deepStrictEqual(checkSafeJsonValue(null), { safe: true });
  });

  await t.test("Allows strings", () => {
    assert.deepStrictEqual(checkSafeJsonValue("hello"), { safe: true });
  });

  await t.test("Allows booleans", () => {
    assert.deepStrictEqual(checkSafeJsonValue(true), { safe: true });
    assert.deepStrictEqual(checkSafeJsonValue(false), { safe: true });
  });

  await t.test("Allows finite numbers", () => {
    assert.deepStrictEqual(checkSafeJsonValue(123), { safe: true });
    assert.deepStrictEqual(checkSafeJsonValue(1.23), { safe: true });
    assert.deepStrictEqual(checkSafeJsonValue(0), { safe: true });
  });

  await t.test("Rejects NaN", () => {
    assert.deepStrictEqual(checkSafeJsonValue(NaN), { safe: false, reason: "NON_FINITE_NUMBER", path: [] });
  });

  await t.test("Rejects Infinity", () => {
    assert.deepStrictEqual(checkSafeJsonValue(Infinity), { safe: false, reason: "NON_FINITE_NUMBER", path: [] });
    assert.deepStrictEqual(checkSafeJsonValue(-Infinity), { safe: false, reason: "NON_FINITE_NUMBER", path: [] });
  });

  await t.test("Rejects undefined", () => {
    assert.deepStrictEqual(checkSafeJsonValue(undefined), { safe: false, reason: "UNSUPPORTED_TYPE", path: [] });
  });

  await t.test("Rejects bigint", () => {
    assert.deepStrictEqual(checkSafeJsonValue(100n), { safe: false, reason: "UNSUPPORTED_TYPE", path: [] });
  });
});

test("Safe JSON Contract - Objects and Arrays", async (t) => {
  await t.test("Allows plain objects", () => {
    assert.deepStrictEqual(checkSafeJsonValue({ a: 1, b: "2" }), { safe: true });
  });

  await t.test("Allows Object.create(null)", () => {
    const obj = Object.create(null);
    obj.a = 1;
    assert.deepStrictEqual(checkSafeJsonValue(obj), { safe: true });
  });

  await t.test("Allows arrays", () => {
    assert.deepStrictEqual(checkSafeJsonValue([1, "2", null]), { safe: true });
  });

  await t.test("Allows nested structures", () => {
    assert.deepStrictEqual(checkSafeJsonValue({ a: [1, { b: 2 }] }), { safe: true });
  });

  await t.test("Rejects custom classes", () => {
    class MyClass { a = 1; }
    assert.deepStrictEqual(checkSafeJsonValue(new MyClass()), { safe: false, reason: "UNSUPPORTED_PROTOTYPE", path: [] });
  });

  await t.test("Rejects built-ins (Date, Map, Set)", () => {
    assert.deepStrictEqual(checkSafeJsonValue(new Date()), { safe: false, reason: "UNSUPPORTED_PROTOTYPE", path: [] });
    assert.deepStrictEqual(checkSafeJsonValue(new Map()), { safe: false, reason: "UNSUPPORTED_PROTOTYPE", path: [] });
    assert.deepStrictEqual(checkSafeJsonValue(new Set()), { safe: false, reason: "UNSUPPORTED_PROTOTYPE", path: [] });
  });

  await t.test("Rejects arrays with altered prototype", () => {
    const arr = [];
    Object.setPrototypeOf(arr, { ...Array.prototype });
    assert.deepStrictEqual(checkSafeJsonValue(arr), { safe: false, reason: "UNSUPPORTED_PROTOTYPE", path: [] });
  });
});

test("Safe JSON Contract - Security Constraints", async (t) => {
  await t.test("Rejects getters", () => {
    const obj = {
      get a() { return 1; }
    };
    assert.deepStrictEqual(checkSafeJsonValue(obj), { safe: false, reason: "ACCESSOR", path: ["a"] });
  });

  await t.test("Rejects setters", () => {
    const obj = {
      set a(val: any) {}
    };
    assert.deepStrictEqual(checkSafeJsonValue(obj), { safe: false, reason: "ACCESSOR", path: ["a"] });
  });

  await t.test("Rejects functions", () => {
    assert.deepStrictEqual(checkSafeJsonValue(() => {}), { safe: false, reason: "UNSUPPORTED_TYPE", path: [] });
    assert.deepStrictEqual(checkSafeJsonValue({ a: () => {} }), { safe: false, reason: "UNSUPPORTED_TYPE", path: ["a"] });
  });

  await t.test("Rejects symbol keys", () => {
    const sym = Symbol("test");
    const obj = { [sym]: 1 };
    assert.deepStrictEqual(checkSafeJsonValue(obj), { safe: false, reason: "SYMBOL_KEY", path: [] });
  });

  await t.test("Rejects self-cycles", () => {
    const obj: any = {};
    obj.self = obj;
    assert.deepStrictEqual(checkSafeJsonValue(obj), { safe: false, reason: "CYCLE", path: ["self"] });
  });

  await t.test("Rejects mutual cycles", () => {
    const a: any = {};
    const b: any = { a };
    a.b = b;
    assert.deepStrictEqual(checkSafeJsonValue(a), { safe: false, reason: "CYCLE", path: ["b", "a"] });
  });

  await t.test("Allows shared references (DAGs)", () => {
    const shared = { x: 1 };
    const obj = { a: shared, b: shared };
    assert.deepStrictEqual(checkSafeJsonValue(obj), { safe: true });
  });

  await t.test("Rejects sparse arrays", () => {
      const arr = new Array(3);
      arr[0] = 1;
      // arr[1] is a hole
      arr[2] = 2;
      assert.deepStrictEqual(checkSafeJsonValue(arr), { safe: false, reason: "HOSTILE_OBJECT", path: [1] });
  });
});

test("Safe JSON Contract - Proxies", async (t) => {
  await t.test("Rejects revoked proxies", () => {
    const { proxy, revoke } = Proxy.revocable({}, {});
    revoke();
    assert.deepStrictEqual(checkSafeJsonValue(proxy), { safe: false, reason: "HOSTILE_OBJECT", path: [] });
  });

  await t.test("Handles hostile proxies in getOwnPropertyDescriptor", () => {
    const proxy = new Proxy({ a: 1 }, {
        getOwnPropertyDescriptor() {
            throw new Error("Hostile!");
        }
    });
    assert.deepStrictEqual(checkSafeJsonValue(proxy), { safe: false, reason: "HOSTILE_OBJECT", path: [] });
  });

  await t.test("Handles hostile proxies in ownKeys", () => {
      const proxy = new Proxy({}, {
          ownKeys() {
              throw new Error("Hostile!");
          }
      });
      assert.deepStrictEqual(checkSafeJsonValue(proxy), { safe: false, reason: "HOSTILE_OBJECT", path: [] });
  });
});

test("Safe JSON Contract - Zod Integration", async (t) => {
  await t.test("SafeJsonValueSchema accepts valid value", () => {
    const val = { a: 1, b: [2, 3] };
    const result = SafeJsonValueSchema.safeParse(val);
    assert.strictEqual(result.success, true);
    if (result.success) {
        assert.deepStrictEqual(result.data, val);
    }
  });

  await t.test("SafeJsonValueSchema rejects invalid value", () => {
    const val = { a: () => {} };
    const result = SafeJsonValueSchema.safeParse(val);
    assert.strictEqual(result.success, false);
    if (!result.success) {
        assert.ok(result.error.issues[0].message.includes("UNSUPPORTED_TYPE"));
        assert.ok(result.error.issues[0].message.includes("a"));
    }
  });

  await t.test("SafeJsonRecordSchema accepts valid record", () => {
    const val = { a: 1 };
    const result = SafeJsonRecordSchema.safeParse(val);
    assert.strictEqual(result.success, true);
  });

  await t.test("SafeJsonRecordSchema rejects array", () => {
    const val = [1, 2];
    const result = SafeJsonRecordSchema.safeParse(val);
    assert.strictEqual(result.success, false);
  });

  await t.test("SafeJsonValueSchema does not mutate input", () => {
    const val = { a: 1 };
    const frozen = Object.freeze({ a: 1 });
    const result = SafeJsonValueSchema.safeParse(frozen);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.data, frozen);
  });
});
