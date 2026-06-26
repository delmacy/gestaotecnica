import { describe, it } from "node:test";
import assert from "node:assert";
import {
  CaseSchema,
  CreateCaseInputSchema,
  UpdateCaseInputSchema,
  ChangeCaseStatusInputSchema,
  AddCaseCommentInputSchema
} from "./contracts/case.schema";

describe("CaseManagementModule Contracts", () => {
  const validWorkspaceId = "550e8400-e29b-41d4-a716-446655440000";

  it("should validate a valid case", () => {
    const validCase = {
      workspaceId: validWorkspaceId,
      title: "Sample Case",
      description: "A description of the case",
      category: "Support",
      priority: "high",
      status: "open",
      origin: "manual",
      metadata: { key: "value" }
    };

    const result = CaseSchema.safeParse(validCase);
    if (!result.success) {
      console.error(JSON.stringify(result.error.issues, null, 2));
    }
    assert.strictEqual(result.success, true);
  });

  it("should fail validation if unknown fields are present (strict)", () => {
    const caseWithExtra = {
      workspaceId: validWorkspaceId,
      title: "Sample Case",
      category: "Support",
      extra: "not allowed"
    };

    const result = CaseSchema.safeParse(caseWithExtra);
    assert.strictEqual(result.success, false);
  });

  it("should validate create case input defaults", () => {
    const input = {
      workspaceId: validWorkspaceId,
      title: "New Case",
      category: "Generic"
    };

    const result = CreateCaseInputSchema.safeParse(input);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.priority, "medium");
      assert.strictEqual(result.data.origin, "manual");
    }
  });

  it("should validate change status input", () => {
    const input = {
      id: "550e8400-e29b-41d4-a716-446655440001",
      status: "resolved",
      reason: "Issue fixed"
    };

    const result = ChangeCaseStatusInputSchema.safeParse(input);
    assert.strictEqual(result.success, true);
  });

  it("should validate add comment input", () => {
    const input = {
      caseId: "550e8400-e29b-41d4-a716-446655440001",
      content: "This is a comment"
    };

    const result = AddCaseCommentInputSchema.safeParse(input);
    assert.strictEqual(result.success, true);
  });
});
