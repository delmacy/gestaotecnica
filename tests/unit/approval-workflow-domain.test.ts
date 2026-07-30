import { describe, it } from "node:test";
import assert from "node:assert";
import { resolveApprovalDecision, ApprovalWorkflowError } from "../../src/modules/approvals/approval-workflow-domain";
import type { WorkspaceContext } from "../../src/platform/workspace";

describe("Approval Workflow Domain", () => {
  const baseContext: WorkspaceContext = {
    workspaceId: "ws-1",
    workspaceKey: "ws-key",
    actor: {
      type: "user",
      id: "user-1",
    },
    source: "ui",
    environmentMode: "real",
    enabledModules: [],
    scopes: [],
    correlationId: "corr-1",
  };

  it("should approve a waiting_review OS correctly", () => {
    const result = resolveApprovalDecision("waiting_review", "approve", baseContext);

    assert.strictEqual(result.status, "approved");
    assert.ok(result.approvedAt instanceof Date);
    assert.strictEqual(result.approvedById, "user-1");
    assert.ok(result.updatedAt instanceof Date);
  });

  it("should reject a waiting_review OS correctly", () => {
    const result = resolveApprovalDecision("waiting_review", "reject", baseContext);

    assert.strictEqual(result.status, "open");
    assert.strictEqual(result.approvedAt, undefined);
    assert.strictEqual(result.approvedById, undefined);
    assert.ok(result.updatedAt instanceof Date);
  });

  it("should throw an error if the current status is not waiting_review", () => {
    assert.throws(
      () => resolveApprovalDecision("open", "approve", baseContext),
      (err: unknown) => err instanceof ApprovalWorkflowError && err.code === "INVALID_STATE"
    );
  });

  it("should throw an error if the decision is invalid", () => {
    assert.throws(
      () => resolveApprovalDecision("waiting_review", "maybe", baseContext),
      (err: unknown) => err instanceof ApprovalWorkflowError && err.code === "INVALID_STATE"
    );
  });

  it("should handle system actor approval correctly", () => {
    const systemContext: WorkspaceContext = {
      ...baseContext,
      actor: {
        type: "system",
      },
    };

    const result = resolveApprovalDecision("waiting_review", "approve", systemContext);

    assert.strictEqual(result.status, "approved");
    assert.ok(result.approvedAt instanceof Date);
    assert.strictEqual(result.approvedById, undefined); // System actor has no ID by default in this domain logic
  });
});
