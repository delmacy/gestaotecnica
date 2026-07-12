import { test } from "node:test";
import assert from "node:assert/strict";
import type { DraftSaveEnvelope } from "@/features/builder/draft-save/draft-save-envelope.types";

test("DraftSaveEnvelope type narrowing and construction", async (t) => {
  await t.test("success variant narrows correctly", () => {
    const successResult: DraftSaveEnvelope<{ id: string }> = {
      ok: true,
      data: { id: "123" },
    };

    if (successResult.ok) {
      assert.equal(successResult.data.id, "123");
    } else {
      assert.fail("Should have narrowed to success branch");
    }
  });

  await t.test("validation_failure variant narrows correctly", () => {
    const validationFailureResult: DraftSaveEnvelope<{ id: string }> = {
      ok: false,
      error: {
        type: "validation_failure",
        errors: [{ code: "REQUIRED", message: "Field is required", severity: "error" }],
      },
    };

    if (!validationFailureResult.ok) {
      if (validationFailureResult.error.type === "validation_failure") {
        assert.equal(validationFailureResult.error.errors.length, 1);
        assert.equal(validationFailureResult.error.errors[0]?.code, "REQUIRED");
      } else {
        assert.fail("Should have narrowed to validation_failure branch");
      }
    } else {
      assert.fail("Should have narrowed to failure branch");
    }
  });

  await t.test("conflict_failure variant narrows correctly", () => {
    const conflictFailureResult: DraftSaveEnvelope<{ id: string }> = {
      ok: false,
      error: {
        type: "conflict_failure",
        message: "Version mismatch",
        baseVersion: "2.1.0",
      },
    };

    if (!conflictFailureResult.ok) {
      if (conflictFailureResult.error.type === "conflict_failure") {
        assert.equal(conflictFailureResult.error.message, "Version mismatch");
        assert.equal(conflictFailureResult.error.baseVersion, "2.1.0");
      } else {
        assert.fail("Should have narrowed to conflict_failure branch");
      }
    } else {
      assert.fail("Should have narrowed to failure branch");
    }
  });
});
