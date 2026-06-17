import { describe, it } from "node:test";
import assert from "node:assert";
import { ApprovalPolicySchema } from "../../src/platform/governance/contracts/approval-policy";

const validBasePolicy = {
  id: "policy-123",
  workspaceId: "00000000-0000-4000-a000-000000000001",
  key: "standard-publication-policy",
  name: "Standard Publication Policy",
  status: "active",
  scope: {
    subjectTypes: ["process_version"],
    operations: ["publish"],
  },
  requirement: {
    mode: "single",
  },
  createdAt: "2023-10-27T10:00:00Z",
  updatedAt: "2023-10-27T10:00:00Z",
};

describe("ApprovalPolicy Contract", () => {
  it("should validate a valid 'none' policy", () => {
    const policy = {
      ...validBasePolicy,
      requirement: {
        mode: "none",
      },
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, true);
  });

  it("should validate a valid 'single' policy", () => {
    const policy = {
      ...validBasePolicy,
      requirement: {
        mode: "single",
        minimumApprovals: 1,
      },
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, true);
  });

  it("should validate a valid 'quorum' policy", () => {
    const policy = {
      ...validBasePolicy,
      requirement: {
        mode: "quorum",
        minimumApprovals: 2,
        approverRoles: ["supervisor", "manager"],
      },
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, true);
  });

  it("should validate a valid 'unanimous' policy", () => {
    const policy = {
      ...validBasePolicy,
      requirement: {
        mode: "unanimous",
        approverRoles: ["admin", "expert"],
      },
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, true);
  });

  it("should reject 'none' mode with minimumApprovals", () => {
    const policy = {
      ...validBasePolicy,
      requirement: {
        mode: "none",
        minimumApprovals: 1,
      },
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.message === "minimumApprovals must be absent when mode is 'none'"));
    }
  });

  it("should reject 'single' mode with invalid minimumApprovals", () => {
    const policy = {
      ...validBasePolicy,
      requirement: {
        mode: "single",
        minimumApprovals: 2,
      },
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.message === "minimumApprovals must be 1 or absent when mode is 'single'"));
    }
  });

  it("should reject 'quorum' mode without minimumApprovals", () => {
    const policy = {
      ...validBasePolicy,
      requirement: {
        mode: "quorum",
      },
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.message === "minimumApprovals is mandatory when mode is 'quorum'"));
    }
  });

  it("should reject 'quorum' mode with zero minimumApprovals", () => {
    const policy = {
      ...validBasePolicy,
      requirement: {
        mode: "quorum",
        minimumApprovals: 0,
      },
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, false);
  });

  it("should reject 'unanimous' mode with minimumApprovals", () => {
    const policy = {
      ...validBasePolicy,
      requirement: {
        mode: "unanimous",
        minimumApprovals: 3,
      },
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(i => i.message === "minimumApprovals must be absent when mode is 'unanimous'"));
    }
  });

  it("should reject duplicate approverRoles", () => {
    const policy = {
      ...validBasePolicy,
      requirement: {
        mode: "unanimous",
        approverRoles: ["admin", "admin"],
      },
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, false);
  });

  it("should reject empty subjectTypes", () => {
    const policy = {
      ...validBasePolicy,
      scope: {
        subjectTypes: [],
        operations: ["publish"],
      },
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, false);
  });

  it("should reject duplicate subjectTypes", () => {
    const policy = {
      ...validBasePolicy,
      scope: {
        subjectTypes: ["process_version", "process_version"],
        operations: ["publish"],
      },
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, false);
  });

  it("should reject empty operations", () => {
    const policy = {
      ...validBasePolicy,
      scope: {
        subjectTypes: ["process_version"],
        operations: [],
      },
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, false);
  });

  it("should reject duplicate operations", () => {
    const policy = {
      ...validBasePolicy,
      scope: {
        subjectTypes: ["process_version"],
        operations: ["publish", "publish"],
      },
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, false);
  });

  it("should reject invalid status", () => {
    const policy = {
      ...validBasePolicy,
      status: "published", // Should be 'active' or 'draft' or 'archived'
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, false);
  });

  it("should reject invalid operation", () => {
    const policy = {
      ...validBasePolicy,
      scope: {
        subjectTypes: ["process_version"],
        operations: ["delete"], // Not in enum
      },
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, false);
  });

  it("should reject unknown fields", () => {
    const policy = {
      ...validBasePolicy,
      extraField: "not allowed",
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, false);
  });

  it("should reject invalid timestamp", () => {
    const policy = {
      ...validBasePolicy,
      createdAt: "2023-13-45T99:00:00Z",
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, false);
  });

  it("should not mutate input", () => {
    const policy = JSON.parse(JSON.stringify(validBasePolicy));
    Object.freeze(policy);
    Object.freeze(policy.scope);
    Object.freeze(policy.requirement);

    assert.doesNotThrow(() => {
      ApprovalPolicySchema.parse(policy);
    });
  });

  it("should reject invalid key format", () => {
    const policy = {
      ...validBasePolicy,
      key: "Invalid_Key",
    };
    const result = ApprovalPolicySchema.safeParse(policy);
    assert.strictEqual(result.success, false);
  });
});
