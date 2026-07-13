import test from "node:test";
import assert from "node:assert";
import { z } from "zod";
import { RuntimeSupportLookupQuerySchema } from "../envelopes/runtime-support-lookup-query";
import { randomUUID } from "node:crypto";

test("RuntimeSupportLookupQuerySchema", async (t) => {
  await t.test("should validate a valid query", () => {
    const valid = {
      workspaceId: randomUUID(),
      correlationId: "corr-123",
    };
    const result = RuntimeSupportLookupQuerySchema.safeParse(valid);
    assert.strictEqual(result.success, true);
  });

  await t.test("should fail if extra fields are provided (strict)", () => {
    const invalid = {
      workspaceId: randomUUID(),
      correlationId: "corr-123",
      extra: "should fail",
    };
    const result = RuntimeSupportLookupQuerySchema.safeParse(invalid);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].code, z.ZodIssueCode.unrecognized_keys);
    }
  });
});
