import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizeUnknownError } from "../../src/platform/errors/sanitizer";

test("sanitizeUnknownError: Basics", async (t) => {
  await t.test("Standard Error", () => {
    const err = new Error("failure");
    const result = sanitizeUnknownError(err);
    assert.equal(result.name, "Error");
    assert.equal(result.message, "failure");
    assert.equal((result as any).stack, undefined);
  });

  await t.test("TypeError", () => {
    const err = new TypeError("type failure");
    const result = sanitizeUnknownError(err);
    assert.equal(result.name, "TypeError");
    assert.equal(result.message, "type failure");
  });

  await t.test("String", () => {
    const result = sanitizeUnknownError("some error");
    assert.deepEqual(result, { message: "some error" });
  });

  await t.test("Number", () => {
    const result = sanitizeUnknownError(404);
    assert.deepEqual(result, { message: "404" });
  });

  await t.test("Boolean", () => {
    assert.deepEqual(sanitizeUnknownError(true), { message: "true" });
    assert.deepEqual(sanitizeUnknownError(false), { message: "false" });
  });

  await t.test("Null and Undefined", () => {
    assert.deepEqual(sanitizeUnknownError(null), { message: "null" });
    assert.deepEqual(sanitizeUnknownError(undefined), { message: "undefined" });
  });

  await t.test("BigInt", () => {
    assert.deepEqual(sanitizeUnknownError(123n), { message: "123" });
  });

  await t.test("Symbol", () => {
    assert.deepEqual(sanitizeUnknownError(Symbol("test")), { message: "test" });
    assert.deepEqual(sanitizeUnknownError(Symbol()), { message: "symbol" });
  });

  await t.test("Function", () => {
    function myFunc() {}
    assert.deepEqual(sanitizeUnknownError(myFunc), { message: "myFunc" });
    assert.deepEqual(sanitizeUnknownError(() => {}), { message: "function" });
  });

  await t.test("Simple object with message", () => {
    const obj = { message: "custom message" };
    assert.deepEqual(sanitizeUnknownError(obj), { message: "custom message" });
  });

  await t.test("Object with name and code", () => {
    const obj = { name: "MyError", code: "ERR_CODE" };
    assert.deepEqual(sanitizeUnknownError(obj), { name: "MyError", code: "ERR_CODE" });
  });
});

test("sanitizeUnknownError: Security", async (t) => {
  await t.test("stack is not included", () => {
    const err = new Error("fail");
    const result = sanitizeUnknownError(err);
    assert.equal(Object.keys(result).includes("stack"), false);
  });

  await t.test("redacts sensitive keys in metadata", () => {
    const obj = {
      message: "msg",
      metadata: {
        password: "secret-pass",
        token: "secret-token",
        authorization: "Bearer secret",
        cookie: "id=secret",
        apiKey: "key-123",
        other: "safe",
      },
    };
    const result = sanitizeUnknownError(obj);
    const metadata = result.metadata as any;
    assert.equal(metadata.password, "[REDACTED]");
    assert.equal(metadata.token, "[REDACTED]");
    assert.equal(metadata.authorization, "[REDACTED]");
    assert.equal(metadata.cookie, "[REDACTED]");
    assert.equal(metadata.apiKey, "[REDACTED]");
    assert.equal(metadata.other, "safe");
  });

  await t.test("redacts sensitive keys regardless of case", () => {
    const obj = {
      metadata: {
        PASSWORD: "123",
        Token: "abc",
      },
    };
    const result = sanitizeUnknownError(obj);
    const metadata = result.metadata as any;
    assert.equal(metadata.PASSWORD, "[REDACTED]");
    assert.equal(metadata.Token, "[REDACTED]");
  });

  await t.test("does not execute getters", () => {
    let executed = false;
    const obj = {
      get message() {
        executed = true;
        return "gotcha";
      },
    };
    const result = sanitizeUnknownError(obj);
    assert.equal(executed, false);
    // message will probably be a fallback or default
    assert.notEqual(result.message, "gotcha");
  });

  await t.test("getter that throws does not crash", () => {
    const obj = {
      get message() {
        throw new Error("boom");
      },
    };
    const result = sanitizeUnknownError(obj);
    assert.ok(result.message);
  });

  await t.test("Revoked Proxy does not crash", () => {
    const { proxy, revoke } = Proxy.revocable({}, {});
    revoke();
    const result = sanitizeUnknownError(proxy);
    assert.deepEqual(result, { message: "[UNREADABLE]" });
  });

  await t.test("Hostile toString does not crash", () => {
    const obj = {
      toString() {
        throw new Error("hostile");
      },
    };
    const result = sanitizeUnknownError(obj);
    assert.ok(result.message);
  });

  await t.test("Hostile Symbol.toPrimitive does not crash", () => {
    const obj = {
      [Symbol.toPrimitive]() {
        throw new Error("hostile");
      },
    };
    const result = sanitizeUnknownError(obj);
    assert.ok(result.message);
  });
});

test("sanitizeUnknownError: Structures", async (t) => {
  await t.test("array in metadata is sanitized", () => {
    const obj = {
      metadata: {
        list: [1, "two", { three: 3 }],
      },
    };
    const result = sanitizeUnknownError(obj);
    assert.deepEqual((result.metadata as any).list, [1, "two", { three: 3 }]);
  });

  await t.test("array truncation", () => {
    const longArray = Array(100).fill(0);
    const obj = { metadata: { list: longArray } };
    const result = sanitizeUnknownError(obj);
    const list = (result.metadata as any).list;
    assert.equal(list.length, 51);
    assert.equal(list[50], "[TRUNCATED]");
  });

  await t.test("object property truncation", () => {
    const manyProps: any = {};
    for (let i = 0; i < 100; i++) manyProps[`p${i}`] = i;
    const obj = { metadata: manyProps };
    const result = sanitizeUnknownError(obj);
    const metadata = result.metadata as any;
    // MAX_PROPS is 50. props are 0 to 49.
    assert.equal(Object.keys(metadata).length, 50);
  });

  await t.test("string truncation", () => {
    const longString = "a".repeat(3000);
    const obj = { message: longString };
    const result = sanitizeUnknownError(obj);
    assert.equal((result.message as string).length, 2011); // 2000 + "[TRUNCATED]".length
    assert.ok((result.message as string).endsWith("[TRUNCATED]"));
  });

  await t.test("depth truncation", () => {
    const input = {
      metadata: {
        a: {
          b: {
            c: {
              d: {
                e: {
                  f: "too deep",
                },
              },
            },
          },
        },
      },
    };
    const result = sanitizeUnknownError(input);

    assert.deepStrictEqual(result, {
      metadata: {
        a: {
          b: {
            c: {
              d: "[TRUNCATED]",
            },
          },
        },
      },
    });
  });

  await t.test("direct circular reference", () => {
    const obj: any = { message: "circular" };
    obj.cause = obj;
    const result = sanitizeUnknownError(obj);
    assert.equal(result.message, "circular");
    assert.equal(result.cause, "[CIRCULAR]");
  });

  await t.test("indirect circular reference", () => {
    const a: any = { name: "A" };
    const b: any = { name: "B" };
    a.cause = b;
    b.cause = a;
    const result = sanitizeUnknownError(a);
    assert.equal(result.name, "A");
    assert.equal((result.cause as any).name, "B");
    assert.equal((result.cause as any).cause, "[CIRCULAR]");
  });

  await t.test("shared reference without cycle", () => {
    const shared = { data: "shared" };
    const obj = {
      metadata: {
        ref1: shared,
        ref2: shared,
      },
    };
    const result = sanitizeUnknownError(obj);
    const meta = result.metadata as any;
    assert.deepEqual(meta.ref1, { data: "shared" });
    assert.deepEqual(meta.ref2, { data: "shared" });
  });

  await t.test("null prototype object", () => {
    const obj = Object.create(null);
    obj.message = "no proto";
    const result = sanitizeUnknownError(obj);
    assert.equal(result.message, "no proto");
  });

  await t.test("cause Error sanitized", () => {
    const err = new Error("parent");
    (err as any).cause = new Error("child");
    const result = sanitizeUnknownError(err);
    assert.equal(result.message, "parent");
    assert.equal((result.cause as any).message, "child");
  });
});

test("sanitizeUnknownError: Special Types", async (t) => {
  await t.test("Date valid", () => {
    const d = new Date("2023-01-01T00:00:00Z");
    const result = sanitizeUnknownError({ metadata: { d } });
    assert.equal((result.metadata as any).d, d.toISOString());
  });

  await t.test("Date invalid", () => {
    const d = new Date("invalid");
    const result = sanitizeUnknownError({ metadata: { d } });
    assert.equal((result.metadata as any).d, "Invalid Date");
  });

  await t.test("RegExp", () => {
    const re = /test/i;
    const result = sanitizeUnknownError({ metadata: { re } });
    assert.equal((result.metadata as any).re, "/test/i");
  });

  await t.test("URL", () => {
    const url = new URL("https://example.com");
    const result = sanitizeUnknownError({ metadata: { url } });
    assert.equal((result.metadata as any).url, "https://example.com/");
  });

  await t.test("Unsupported types", () => {
    const obj = {
      metadata: {
        map: new Map(),
        set: new Set(),
        buf: new ArrayBuffer(8),
        arr: new Uint8Array(8),
        promise: Promise.resolve(),
      },
    };
    const result = sanitizeUnknownError(obj);
    const meta = result.metadata as any;
    assert.equal(meta.map, "[UNSUPPORTED:Map]");
    assert.equal(meta.set, "[UNSUPPORTED:Set]");
    assert.equal(meta.buf, "[UNSUPPORTED:ArrayBuffer]");
    assert.equal(meta.arr, "[UNSUPPORTED:TypedArray]");
    assert.equal(meta.promise, "[UNSUPPORTED:Promise]");
  });

  await t.test("Custom class", () => {
    class Custom {
      id = 1;
      name = "custom";
      get secret() { return "don't see me"; }
    }
    const result = sanitizeUnknownError(new Custom());
    assert.equal(result.name, "custom");
    assert.equal((result as any).id, undefined); // id is not in root allowlist
  });
});

test("sanitizeUnknownError: Contract", async (t) => {
  await t.test("only allowlist on root", () => {
    const obj = {
      name: "n",
      message: "m",
      code: "c",
      category: "cat",
      status: "s",
      statusCode: 200,
      cause: "cau",
      issues: [],
      metadata: {},
      forbidden: "out",
    };
    const result = sanitizeUnknownError(obj);
    assert.ok(result.name);
    assert.ok(result.message);
    assert.ok(result.code);
    assert.ok(result.category);
    assert.ok(result.status);
    assert.ok(result.statusCode);
    assert.ok(result.cause);
    assert.ok(result.issues);
    assert.ok(result.metadata);
    assert.equal((result as any).forbidden, undefined);
  });

  await t.test("input not mutated", () => {
    const input: any = { message: "orig" };
    sanitizeUnknownError(input);
    assert.equal(input.message, "orig");
    assert.equal(Object.keys(input).length, 1);
  });

  await t.test("works with frozen objects", () => {
    const obj = Object.freeze({ message: "frozen" });
    const result = sanitizeUnknownError(obj);
    assert.equal(result.message, "frozen");
  });
});
