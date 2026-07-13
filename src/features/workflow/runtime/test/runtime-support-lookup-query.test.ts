import { describe, it } from "node:test";
import assert from "node:assert";
import { z } from "zod";
import { RuntimeSupportLookupQuerySchema } from "../envelopes/runtime-support-lookup-query";
import {
  VALID_RUNTIME_SUPPORT_LOOKUP_QUERY,
  INVALID_RUNTIME_SUPPORT_LOOKUP_QUERY_MISSING_WORKSPACE,
  INVALID_RUNTIME_SUPPORT_LOOKUP_QUERY_EXTRA_FIELDS,
} from "../../../../../tests/fixtures/features/workflow/runtime/runtime-support-lookup-query.fixtures";

describe("RuntimeSupportLookupQuerySchema", () => {
  it("should validate a valid support lookup query", () => {
    const result = RuntimeSupportLookupQuerySchema.safeParse(VALID_RUNTIME_SUPPORT_LOOKUP_QUERY);
    assert.strictEqual(result.success, true);
  });

  it("should fail validation if workspace is missing", () => {
    const result = RuntimeSupportLookupQuerySchema.safeParse(INVALID_RUNTIME_SUPPORT_LOOKUP_QUERY_MISSING_WORKSPACE);
    assert.strictEqual(result.success, false);
  });

  it("should fail validation if extra fields are present", () => {
    const result = RuntimeSupportLookupQuerySchema.safeParse(INVALID_RUNTIME_SUPPORT_LOOKUP_QUERY_EXTRA_FIELDS);
    assert.strictEqual(result.success, false);
  });

  it("should fail deterministically", () => {
    assert.throws(
      () => RuntimeSupportLookupQuerySchema.parse(INVALID_RUNTIME_SUPPORT_LOOKUP_QUERY_EXTRA_FIELDS),
      (err) => {
        assert(err instanceof z.ZodError);
        return true;
      }
    );
  });
});
