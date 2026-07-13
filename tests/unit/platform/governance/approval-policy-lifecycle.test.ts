import { describe, it } from "node:test";
import assert from "node:assert";
import { canTransitionApprovalPolicyStatus } from "../../../../src/platform/governance/domain/approval-policy-lifecycle";

describe("Approval Policy Lifecycle Transitions", () => {
  it("should allow draft -> active", () => {
    assert.strictEqual(canTransitionApprovalPolicyStatus("draft", "active"), true);
  });

  it("should allow draft -> archived", () => {
    assert.strictEqual(canTransitionApprovalPolicyStatus("draft", "archived"), true);
  });

  it("should allow active -> archived", () => {
    assert.strictEqual(canTransitionApprovalPolicyStatus("active", "archived"), true);
  });

  it("should reject archived -> active", () => {
    assert.strictEqual(canTransitionApprovalPolicyStatus("archived", "active"), false);
  });

  it("should reject active -> draft", () => {
    assert.strictEqual(canTransitionApprovalPolicyStatus("active", "draft"), false);
  });

  it("should reject self-transitions", () => {
    assert.strictEqual(canTransitionApprovalPolicyStatus("draft", "draft"), false);
    assert.strictEqual(canTransitionApprovalPolicyStatus("active", "active"), false);
    assert.strictEqual(canTransitionApprovalPolicyStatus("archived", "archived"), false);
  });
});
