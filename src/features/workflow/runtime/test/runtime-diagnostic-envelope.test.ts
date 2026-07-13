import * as assert from "node:assert";
import { describe, it } from "node:test";
import { z } from "zod";
import { RuntimeDiagnosticEnvelopeSchema } from "../envelopes/runtime-diagnostic-envelope";
import {
  VALID_RUNTIME_DIAGNOSTIC_ENVELOPE,
  INVALID_RUNTIME_DIAGNOSTIC_ENVELOPE_WITH_PAYLOAD,
  INVALID_RUNTIME_DIAGNOSTIC_ENVELOPE_EMPTY_CORRELATION,
} from "../../../../../tests/fixtures/features/workflow/runtime/runtime-diagnostic-envelope.fixtures";

describe("RuntimeDiagnosticEnvelopeSchema", () => {
  it("should validate a correct envelope", () => {
    const result = RuntimeDiagnosticEnvelopeSchema.safeParse(VALID_RUNTIME_DIAGNOSTIC_ENVELOPE);
    assert.strictEqual(result.success, true);
  });

  it("should exclude raw sensitive payload by default (strict mode)", () => {
    assert.throws(() => RuntimeDiagnosticEnvelopeSchema.parse(INVALID_RUNTIME_DIAGNOSTIC_ENVELOPE_WITH_PAYLOAD), (err: unknown) => {
      assert.ok(err instanceof z.ZodError);
      const issues = err.issues;
      assert.strictEqual(issues[0].code, z.ZodIssueCode.unrecognized_keys);
      return true;
    });
  });

  it("invalid correlation id produces stable validation failure", () => {
    assert.throws(() => RuntimeDiagnosticEnvelopeSchema.parse(INVALID_RUNTIME_DIAGNOSTIC_ENVELOPE_EMPTY_CORRELATION), (err: unknown) => {
      assert.ok(err instanceof z.ZodError);
      const issues = err.issues;
      assert.strictEqual(issues[0].code, z.ZodIssueCode.too_small);
      assert.strictEqual(issues[0].path[0], "correlationId");
      return true;
    });
  });
});
