import { test, describe } from "node:test";
import assert from "node:assert";
import { ApprovalDecisionSchema } from "../../src/platform/governance/contracts/approval-decision";

const VALID_WORKSPACE_ID = "00000000-0000-4000-a000-000000000000";
const VALID_ISO_DATE = "2023-01-01T10:00:00Z";

describe("ApprovalDecision Contract", () => {
  const validMinimalApproved = {
    id: "dec-1",
    workspaceId: VALID_WORKSPACE_ID,
    subject: {
      type: "process_version",
      id: "proc-1",
    },
    decision: "approved",
    actor: {
      type: "human",
      id: "user-1",
    },
    decidedAt: VALID_ISO_DATE,
  };

  test("should validate minimal valid approved decision", () => {
    const result = ApprovalDecisionSchema.parse(validMinimalApproved);
    assert.strictEqual(result.id, "dec-1");
    assert.strictEqual(result.decision, "approved");
  });

  test("should validate complete valid decision with hash", () => {
    const completeDecision = {
      ...validMinimalApproved,
      subject: {
        ...validMinimalApproved.subject,
        version: 1,
      },
      policyId: "pol-1",
      justification: "This looks great and meets all requirements.",
      approvedContentHash: {
        algorithm: "sha256",
        scope: "receipt",
        value: "a".repeat(64),
      },
      metadata: { key: "value" },
    };
    const result = ApprovalDecisionSchema.parse(completeDecision);
    assert.strictEqual(result.justification, "This looks great and meets all requirements.");
    assert.strictEqual(result.approvedContentHash?.algorithm, "sha256");
    assert.strictEqual(result.subject.version, 1);
  });

  test("should allow approved without justification", () => {
    const result = ApprovalDecisionSchema.parse(validMinimalApproved);
    assert.strictEqual(result.justification, undefined);
  });

  test("should validate rejected with justification", () => {
    const rejected = {
      ...validMinimalApproved,
      decision: "rejected",
      justification: "Missing security review in the process definition.",
    };
    const result = ApprovalDecisionSchema.parse(rejected);
    assert.strictEqual(result.decision, "rejected");
  });

  test("should reject rejected without justification", () => {
    const rejected = {
      ...validMinimalApproved,
      decision: "rejected",
    };
    assert.throws(() => ApprovalDecisionSchema.parse(rejected), /Justification is mandatory/);
  });

  test("should validate changes_requested with justification", () => {
    const changes = {
      ...validMinimalApproved,
      decision: "changes_requested",
      justification: "Please update the timeout values for node A.",
    };
    const result = ApprovalDecisionSchema.parse(changes);
    assert.strictEqual(result.decision, "changes_requested");
  });

  test("should reject changes_requested without justification", () => {
    const changes = {
      ...validMinimalApproved,
      decision: "changes_requested",
    };
    assert.throws(() => ApprovalDecisionSchema.parse(changes), /Justification is mandatory/);
  });

  test("should reject justification with only spaces", () => {
    const rejected = {
      ...validMinimalApproved,
      decision: "rejected",
      justification: "          ",
    };
    assert.throws(() => ApprovalDecisionSchema.parse(rejected), /Justification must have at least 10 useful characters/);
  });

  test("should reject too short justification", () => {
    const rejected = {
      ...validMinimalApproved,
      decision: "rejected",
      justification: "Too short",
    };
    assert.throws(() => ApprovalDecisionSchema.parse(rejected), /Justification must have at least 10 useful characters/);
  });

  test("should reject unknown decision", () => {
    const invalid = {
      ...validMinimalApproved,
      decision: "pending",
    };
    assert.throws(() => ApprovalDecisionSchema.parse(invalid));
  });

  test("should reject unknown subject type", () => {
    const invalid = {
      ...validMinimalApproved,
      subject: {
        type: "unknown_asset",
        id: "id-1",
      },
    };
    assert.throws(() => ApprovalDecisionSchema.parse(invalid));
  });

  test("should reject invalid actor", () => {
    const invalid = {
      ...validMinimalApproved,
      actor: {
        type: "invalid_type",
        id: "id-1",
      },
    };
    assert.throws(() => ApprovalDecisionSchema.parse(invalid));
  });

  test("should reject invalid datetime", () => {
    const invalid = {
      ...validMinimalApproved,
      decidedAt: "2023-01-01", // Not ISO datetime
    };
    assert.throws(() => ApprovalDecisionSchema.parse(invalid));
  });

  test("should validate sha512 hash", () => {
    const withHash = {
      ...validMinimalApproved,
      approvedContentHash: {
        algorithm: "sha512",
        scope: "receipt",
        value: "a".repeat(128),
      },
    };
    const result = ApprovalDecisionSchema.parse(withHash);
    assert.strictEqual(result.approvedContentHash?.algorithm, "sha512");
  });

  test("should reject unknown hash algorithm", () => {
    const invalid = {
      ...validMinimalApproved,
      approvedContentHash: {
        algorithm: "md5",
        scope: "receipt",
        value: "a".repeat(32),
      },
    };
    assert.throws(() => ApprovalDecisionSchema.parse(invalid));
  });

  test("should reject malformed hash value", () => {
    const invalid = {
      ...validMinimalApproved,
      approvedContentHash: {
        algorithm: "sha256",
        scope: "receipt",
        value: "NOT-A-HASH",
      },
    };
    assert.throws(() => ApprovalDecisionSchema.parse(invalid));
  });

  test("should reject unknown fields (strict)", () => {
    const invalid = {
      ...validMinimalApproved,
      unknownField: "value",
    };
    assert.throws(() => ApprovalDecisionSchema.parse(invalid));
  });

  test("should freeze output", () => {
    const result = ApprovalDecisionSchema.parse(validMinimalApproved);
    assert.ok(Object.isFrozen(result));
    assert.ok(Object.isFrozen(result.subject));
    assert.ok(Object.isFrozen(result.actor));
  });

  test("should not mutate input", () => {
    const input = { ...validMinimalApproved, justification: "   Needs more info.   " };
    const result = ApprovalDecisionSchema.parse(input);
    assert.strictEqual(result.justification, "Needs more info.");
    assert.strictEqual(input.justification, "   Needs more info.   ");
  });
});
