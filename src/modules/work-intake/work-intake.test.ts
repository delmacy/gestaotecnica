import { describe, it } from "node:test";
import assert from "node:assert";
import {
  IntakeRequestSchema,
  CreateIntakeInputSchema,
} from "./contracts/intake.schema";

describe("WorkIntakeModule Contracts", () => {
  const validWorkspaceId = "550e8400-e29b-41d4-a716-446655440000";

  it("should validate a valid intake request", () => {
    const validRequest = {
      workspaceId: validWorkspaceId,
      title: "Test Request",
      category: "Test",
      requester: {
        name: "Jules",
        contact: "jules@example.com",
        department: "Engineering"
      },
      priority: "medium",
      source: "manual",
      status: "new",
      metadata: {}
    };

    const result = IntakeRequestSchema.safeParse(validRequest);
    if (!result.success) {
      console.error(JSON.stringify(result.error.issues, null, 2));
    }
    assert.strictEqual(result.success, true);
  });

  it("should fail validation if required fields are missing", () => {
    const invalidRequest = {
      title: "Missing fields"
    };

    const result = IntakeRequestSchema.safeParse(invalidRequest);
    assert.strictEqual(result.success, false);
  });

  it("should fail validation if unknown fields are present (strict)", () => {
    const requestWithUnknown = {
      workspaceId: validWorkspaceId,
      title: "Test Request",
      category: "Test",
      requester: {
        name: "Jules"
      },
      unknownField: "I should not be here"
    };

    const result = IntakeRequestSchema.safeParse(requestWithUnknown);
    assert.strictEqual(result.success, false);
  });

  it("should use default priority if not provided", () => {
    const input = {
      workspaceId: validWorkspaceId,
      title: "Test Request",
      category: "Test",
      requester: {
        name: "Jules"
      },
      source: "manual"
    };

    const result = CreateIntakeInputSchema.safeParse(input);
    if (!result.success) {
      console.error(JSON.stringify(result.error.issues, null, 2));
    }
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.priority, "medium");
    }
  });
});
