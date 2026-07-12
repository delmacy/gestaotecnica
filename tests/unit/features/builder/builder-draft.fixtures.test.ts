import { describe, it } from "node:test";
import assert from "node:assert";
import { BuilderDraftValidationSchema } from "../../../../src/features/builder/process-editor/builder-draft.schema";
import {
  VALID_MINIMAL_DRAFT,
  VALID_FULL_DRAFT,
  INVALID_DRAFT_MISSING_NAME,
  INVALID_DRAFT_ARRAY_PAYLOAD
} from "../../../fixtures/builder/builder-draft.fixtures";

describe("Builder Draft Fixtures", () => {
  it("should validate a minimal draft", () => {
    const result = BuilderDraftValidationSchema.safeParse(VALID_MINIMAL_DRAFT);
    assert.strictEqual(result.success, true);
  });

  it("should validate a full draft", () => {
    const result = BuilderDraftValidationSchema.safeParse(VALID_FULL_DRAFT);
    assert.strictEqual(result.success, true);
  });

  it("should invalidate a draft with missing name", () => {
    const result = BuilderDraftValidationSchema.safeParse(INVALID_DRAFT_MISSING_NAME);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues.some((i) => i.path.includes("name")), true);
    }
  });

  it("should invalidate a draft with array payload", () => {
    const result = BuilderDraftValidationSchema.safeParse(INVALID_DRAFT_ARRAY_PAYLOAD);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues.some((i) => i.path.includes("payload")), true);
    }
  });
});
