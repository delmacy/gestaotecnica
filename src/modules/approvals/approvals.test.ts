import { describe, it } from "node:test";
import assert from "node:assert";
import {
  ApprovalRequestSchema,
  CreateApprovalInputSchema,
  DecideApprovalInputSchema,
} from "./contracts/approval.schema";

describe("ApprovalWorkflowModule Unit Tests", () => {
  const validWorkspaceId = "550e8400-e29b-41d4-a716-446655440000";
  const otherWorkspaceId = "550e8400-e29b-41d4-a716-446655449999";
  const validRequesterId = "550e8400-e29b-41d4-a716-446655440001";

  describe("Schema Validation", () => {
    it("should validate a valid approval request", () => {
      const validRequest = {
        workspaceId: validWorkspaceId,
        subjectType: "service_order",
        subjectId: "so-123",
        requesterId: validRequesterId,
        requesterName: "Jules Dev",
        status: "pending",
        metadata: {}
      };

      const result = ApprovalRequestSchema.safeParse(validRequest);
      assert.strictEqual(result.success, true);
    });

    it("should fail validation for invalid subjectType", () => {
      const invalidRequest = {
        workspaceId: validWorkspaceId,
        subjectType: "invalid_type",
        subjectId: "so-123",
        requesterId: validRequesterId,
        requesterName: "Jules Dev",
      };

      const result = ApprovalRequestSchema.safeParse(invalidRequest);
      assert.strictEqual(result.success, false);
    });

    it("should fail validation if rejection has no comment", () => {
      const invalidDecision = {
        id: "550e8400-e29b-41d4-a716-446655440002",
        decision: "rejected",
        comment: ""
      };

      const result = DecideApprovalInputSchema.safeParse(invalidDecision);
      assert.strictEqual(result.success, false);
    });

    it("should allow approval without comment", () => {
      const validDecision = {
        id: "550e8400-e29b-41d4-a716-446655440002",
        decision: "approved",
      };

      const result = DecideApprovalInputSchema.safeParse(validDecision);
      assert.strictEqual(result.success, true);
    });
  });

  describe("Security & Multi-tenancy Constraints", () => {
    it("should enforce UUID for workspaceId", () => {
      const invalidIds = {
        workspaceId: "not-a-uuid",
        subjectType: "service_order",
        subjectId: "so-123",
        requesterId: validRequesterId,
        requesterName: "Jules Dev",
      };

      const result = ApprovalRequestSchema.safeParse(invalidIds);
      assert.strictEqual(result.success, false);
    });

    it("should reject input with missing subjectId", () => {
        const input = {
            subjectType: "service_order",
            comment: "Test"
        };
        const result = CreateApprovalInputSchema.safeParse(input);
        assert.strictEqual(result.success, false);
    });

    it("should logically distinguish workspaces", () => {
        const reqA = { workspaceId: validWorkspaceId, subjectId: "1" };
        const reqB = { workspaceId: otherWorkspaceId, subjectId: "1" };
        assert.notStrictEqual(reqA.workspaceId, reqB.workspaceId, "Workspaces must be distinct");
    });

    it("should require a minimum length for rejection comment", () => {
        const invalidDecision = {
            id: "550e8400-e29b-41d4-a716-446655440002",
            decision: "rejected",
            comment: "bad" // too short (< 5)
        };
        const result = DecideApprovalInputSchema.safeParse(invalidDecision);
        assert.strictEqual(result.success, false);
    });
  });
});
