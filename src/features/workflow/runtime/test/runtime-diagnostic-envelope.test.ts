import * as assert from "node:assert";
import { describe, it } from "node:test";
import { z } from "zod";
import { RuntimeDiagnosticEnvelopeSchema } from "../envelopes/runtime-diagnostic-envelope";

describe("RuntimeDiagnosticEnvelopeSchema", () => {
  it("should validate a correct envelope", () => {
    const valid = {
      correlationId: "corr-123",
      processId: "proc-123",
      actionId: "act-123",
      redactionClass: "RESTRICTED",
    };
    const result = RuntimeDiagnosticEnvelopeSchema.safeParse(valid);
    assert.strictEqual(result.success, true);
  });

  it("should exclude raw sensitive payload by default (strict mode)", () => {
    const invalidWithPayload = {
      correlationId: "corr-123",
      processId: "proc-123",
      actionId: "act-123",
      redactionClass: "RESTRICTED",
      payload: { sensitive: "data" },
    };
    assert.throws(() => RuntimeDiagnosticEnvelopeSchema.parse(invalidWithPayload), (err: unknown) => {
      assert.ok(err instanceof z.ZodError);
      const issues = err.issues;
      assert.strictEqual(issues[0].code, z.ZodIssueCode.unrecognized_keys);
      return true;
    });
  });

  it("invalid correlation id produces stable validation failure", () => {
    const invalidWithEmptyCorrelation = {
      correlationId: "",
      processId: "proc-123",
      actionId: "act-123",
      redactionClass: "RESTRICTED",
    };
    assert.throws(() => RuntimeDiagnosticEnvelopeSchema.parse(invalidWithEmptyCorrelation), (err: unknown) => {
      assert.ok(err instanceof z.ZodError);
      const issues = err.issues;
      assert.strictEqual(issues[0].code, z.ZodIssueCode.too_small);
      assert.strictEqual(issues[0].path[0], "correlationId");
      return true;
    });
  });
});
