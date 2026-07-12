import { test, suite } from "node:test";
import assert from "node:assert/strict";
import { DraftSaveResultEnvelopeSchema } from "@/platform/workflows/contracts/process-definition";

suite("DraftSaveResultEnvelopeSchema", () => {
  test("should parse a valid success envelope", () => {
    const successPayload = {
      ok: true,
      data: {
        processDefinitionId: "def-123",
        processVersionId: "ver-123",
        version: 1,
        savedAt: "2024-05-10T10:00:00.000Z",
      },
    };

    const result = DraftSaveResultEnvelopeSchema.safeParse(successPayload);
    assert.ok(result.success, "Failed to parse valid success envelope");
    if (result.success) {
      assert.equal(result.data.ok, true);
      assert.equal(result.data.data.version, 1);
    }
  });

  test("should parse a valid validation failure envelope", () => {
    const failurePayload = {
      ok: false,
      error: {
        type: "validation_failure",
        code: "INVALID_DATA",
        message: "Data is missing required fields",
        issues: [{ path: ["name"], message: "Required" }],
      },
    };

    const result = DraftSaveResultEnvelopeSchema.safeParse(failurePayload);
    assert.ok(result.success, "Failed to parse valid validation failure envelope");
    if (result.success) {
      assert.equal(result.data.ok, false);
      assert.equal(result.data.error.type, "validation_failure");
    }
  });

  test("should parse a valid conflict failure envelope", () => {
    const conflictPayload = {
      ok: false,
      error: {
        type: "conflict_failure",
        code: "VERSION_CONFLICT",
        message: "A newer version exists",
      },
    };

    const result = DraftSaveResultEnvelopeSchema.safeParse(conflictPayload);
    assert.ok(result.success, "Failed to parse valid conflict failure envelope");
    if (result.success) {
      assert.equal(result.data.ok, false);
      assert.equal(result.data.error.type, "conflict_failure");
    }
  });

  test("should fail on missing fields in success envelope", () => {
    const badSuccessPayload = {
      ok: true,
      data: {
        processDefinitionId: "def-123",
      }, // Missing other required fields
    };

    const result = DraftSaveResultEnvelopeSchema.safeParse(badSuccessPayload);
    assert.ok(!result.success, "Should have failed to parse missing fields");
  });

  test("should fail on invalid error type", () => {
    const badErrorPayload = {
      ok: false,
      error: {
        type: "unknown_failure",
        code: "ERR",
        message: "Bad",
      },
    };

    const result = DraftSaveResultEnvelopeSchema.safeParse(badErrorPayload);
    assert.ok(!result.success, "Should have failed to parse invalid error type");
  });
});
