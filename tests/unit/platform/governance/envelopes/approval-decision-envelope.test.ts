import { test, describe } from "node:test";
import assert from "node:assert";
import { ApprovalDecisionEnvelopeSchema } from "../../../../../src/platform/governance/envelopes/approval-decision-envelope";

describe("ApprovalDecisionEnvelope Schema", () => {
  const validMinimalApprove = {
    decision: "approve",
    actor: {
      type: "user",
      id: "user-123"
    },
    timestamp: "2023-01-01T12:00:00Z",
    target: {
      type: "process_version",
      id: "proc-1",
      version: 1
    }
  };

  test("should validate minimal valid approve decision envelope", () => {
    const result = ApprovalDecisionEnvelopeSchema.parse(validMinimalApprove);
    assert.strictEqual(result.decision, "approve");
  });

  test("should validate valid reject decision envelope with reason", () => {
    const payload = {
      ...validMinimalApprove,
      decision: "reject",
      reason: "Missing fields"
    };
    const result = ApprovalDecisionEnvelopeSchema.parse(payload);
    assert.strictEqual(result.decision, "reject");
    assert.strictEqual(result.reason, "Missing fields");
  });

  test("should reject missing target", () => {
    const { target, ...rest } = validMinimalApprove;
    assert.throws(() => ApprovalDecisionEnvelopeSchema.parse(rest));
  });
});
