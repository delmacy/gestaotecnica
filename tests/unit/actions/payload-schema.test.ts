import { test, describe } from "node:test";
import assert from "node:assert";
import { z } from "zod";
import { createPayloadSchema } from "../../../src/platform/actions/contracts/payload-schema";

describe("Action Payload Schema Generator", () => {
  test("accepts valid primitive and nested definitions", () => {
    const schema = createPayloadSchema({
      id: z.string(),
      count: z.number(),
      nested: z.object({
        flag: z.boolean(),
      }).optional(),
    });

    const result = schema.safeParse({ id: "123", count: 42, nested: { flag: true } });
    assert.strictEqual(result.success, true);
  });

  test("enforces required fields", () => {
    const schema = createPayloadSchema({
      id: z.string(),
    });

    const result = schema.safeParse({});
    assert.strictEqual(result.success, false);
  });

  test("rejects unknown fields (strict)", () => {
    const schema = createPayloadSchema({
      id: z.string(),
    });

    const result = schema.safeParse({ id: "123", unknownField: "bad" });
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].code, "unrecognized_keys");
    }
  });

  test("rejects unsafe values (functions)", () => {
    const schema = createPayloadSchema({
      fn: z.unknown().optional(),
    });

    const result = schema.safeParse({ fn: () => {} });
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.match(result.error.issues[0].message, /Unsafe payload: FUNCTION/);
    }
  });

  test("rejects executable code / getters (accessors)", () => {
    const schema = createPayloadSchema({
      obj: z.unknown(),
    });

    const maliciousObj = {};
    Object.defineProperty(maliciousObj, "prop", {
      get: () => "evil",
      enumerable: true,
    });

    const result = schema.safeParse({ obj: maliciousObj });
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.match(result.error.issues[0].message, /Unsafe payload: ACCESSOR/);
    }
  });

  test("rejects unsafe prototype-bearing values (classes)", () => {
    class CustomClass {
      prop = "value";
    }

    const schema = createPayloadSchema({
      instance: z.unknown(),
    });

    const result = schema.safeParse({ instance: new CustomClass() });
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.match(result.error.issues[0].message, /Unsafe payload: UNSUPPORTED_BUILTIN/);
    }
  });
});
