import { describe, it } from "node:test";
import assert from "node:assert";
import {
  WorkItemSchema,
  CreateWorkItemInputSchema,
  TransitionWorkItemInputSchema,
} from "./contracts/work-item.schema";

describe("WorkItemsModule Contracts", () => {
  it("should validate a valid create input", () => {
    const input = {
      title: "Test Request",
      description: "Needs attention",
      type: "solicitacao",
      priority: "medium",
      autoCreateServiceOrder: true,
    };

    const result = CreateWorkItemInputSchema.safeParse(input);
    if (!result.success) {
      console.error(JSON.stringify(result.error.issues, null, 2));
    }
    assert.strictEqual(result.success, true);
  });

  it("should transform fallback values for invalid enums in create input", () => {
    const input = {
      title: "Test Request",
      type: "invalid_type",
      priority: "invalid_priority",
    };

    const result = CreateWorkItemInputSchema.safeParse(input);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.type, "solicitacao");
      assert.strictEqual(result.data.priority, "medium");
    }
  });

  it("should reject create input without title", () => {
    const input = {
      description: "Needs attention",
    };

    const result = CreateWorkItemInputSchema.safeParse(input);
    assert.strictEqual(result.success, false);
  });

  it("should validate a valid transition input", () => {
    const input = {
      workItemId: "550e8400-e29b-41d4-a716-446655440000",
      status: "in_progress",
      note: "Started working on it",
    };

    const result = TransitionWorkItemInputSchema.safeParse(input);
    assert.strictEqual(result.success, true);
  });

  it("should transform fallback values for invalid enums in transition input", () => {
    const input = {
      workItemId: "550e8400-e29b-41d4-a716-446655440000",
      status: "invalid_status",
    };

    const result = TransitionWorkItemInputSchema.safeParse(input);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.status, "triaged");
    }
  });

  it("should validate full work item schema", () => {
    const item = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      title: "Test Request",
      description: null,
      status: "open",
      type: "solicitacao",
      priority: "medium",
      requesterName: null,
      requesterContact: null,
      assetId: null,
      assignedTeamId: null,
      createdById: null,
      payload: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = WorkItemSchema.safeParse(item);
    if (!result.success) {
      console.error(JSON.stringify(result.error.issues, null, 2));
    }
    assert.strictEqual(result.success, true);
  });
});
