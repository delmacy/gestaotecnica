import { test, describe } from "node:test";
import assert from "node:assert";
import { RedactionClassSchema } from "../../../../../src/platform/documents/traceability/audit-receipt";
import { z } from "zod";

describe("Audit Receipt Redaction Class Validation", () => {
  test("valid redaction classes parse successfully", () => {
    assert.doesNotThrow(() => RedactionClassSchema.parse("PUBLIC"));
    assert.doesNotThrow(() => RedactionClassSchema.parse("INTERNAL"));
    assert.doesNotThrow(() => RedactionClassSchema.parse("RESTRICTED"));
  });

  test("unknown redaction classes fail deterministically", () => {
    assert.throws(() => RedactionClassSchema.parse("UNKNOWN"), (err: unknown) => {
        assert(err instanceof z.ZodError);
        return true;
    });
    assert.throws(() => RedactionClassSchema.parse(""), (err: unknown) => {
        assert(err instanceof z.ZodError);
        return true;
    });
    assert.throws(() => RedactionClassSchema.parse("public"), (err: unknown) => {
        assert(err instanceof z.ZodError);
        return true;
    });
  });
});
