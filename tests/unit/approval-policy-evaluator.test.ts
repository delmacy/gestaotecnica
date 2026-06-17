import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateApprovalPolicy } from "../../src/platform/governance/application/policy-evaluator";
import {
  ApprovalPolicy,
  ApprovalRequirementMode,
  ApprovalOperation,
} from "../../src/platform/governance/contracts/approval-policy";
import {
  ApprovalDecision,
  ApprovalDecisionValue,
  ApprovalSubjectReference,
} from "../../src/platform/governance/contracts/approval-decision";

const WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";
const OTHER_WORKSPACE_ID = "00000000-0000-0000-0000-000000000002";

const SUBJECT: ApprovalSubjectReference = {
  type: "process_version",
  id: "process-1",
  version: "1.0.0",
};

const OPERATION: ApprovalOperation = "publish";

function createPolicy(overrides: Partial<ApprovalPolicy> = {}): ApprovalPolicy {
  return {
    id: "policy-1",
    workspaceId: WORKSPACE_ID,
    key: "test-policy",
    name: "Test Policy",
    status: "active",
    scope: {
      subjectTypes: ["process_version"],
      operations: ["publish"],
    },
    requirement: {
      mode: "single",
    },
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    ...overrides,
  };
}

function createDecision(
  id: string,
  actorId: string,
  value: ApprovalDecisionValue = "approved",
  overrides: Partial<ApprovalDecision> = {}
): ApprovalDecision {
  return {
    id,
    workspaceId: WORKSPACE_ID,
    subject: SUBJECT,
    decision: value,
    actor: { type: "human", id: actorId },
    policyId: "policy-1", // Default to the main policy ID
    decidedAt: "2023-01-01T10:00:00Z",
    ...overrides,
  };
}

test("evaluateApprovalPolicy - Applicability", async (t) => {
  await t.test("should be applicable when all criteria match", () => {
    const policy = createPolicy();
    const result = evaluateApprovalPolicy({
      policy,
      decisions: [],
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    assert.strictEqual(result.applicable, true);
  });

  await t.test("should not be applicable if workspace mismatch", () => {
    const policy = createPolicy();
    const result = evaluateApprovalPolicy({
      policy,
      decisions: [],
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: OTHER_WORKSPACE_ID,
    });
    assert.strictEqual(result.applicable, false);
    assert.ok(result.reasons.some((r) => r.code === "WORKSPACE_MISMATCH"));
  });

  await t.test("should not be applicable if subject type mismatch", () => {
    const policy = createPolicy({ scope: { subjectTypes: ["form_definition"], operations: ["publish"] } });
    const result = evaluateApprovalPolicy({
      policy,
      decisions: [],
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    assert.strictEqual(result.applicable, false);
    assert.ok(result.reasons.some((r) => r.code === "SUBJECT_TYPE_MISMATCH"));
  });

  await t.test("should not be applicable if operation mismatch", () => {
    const policy = createPolicy({ scope: { subjectTypes: ["process_version"], operations: ["archive"] } });
    const result = evaluateApprovalPolicy({
      policy,
      decisions: [],
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    assert.strictEqual(result.applicable, false);
    assert.ok(result.reasons.some((r) => r.code === "OPERATION_MISMATCH"));
  });

  await t.test("should not be applicable if status is not active", () => {
    const policy = createPolicy({ status: "draft" });
    const result = evaluateApprovalPolicy({
      policy,
      decisions: [],
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    assert.strictEqual(result.applicable, false);
    assert.ok(result.reasons.some((r) => r.code === "POLICY_INACTIVE"));
  });

  await t.test("non-applicable mode none is not satisfied", () => {
    const policy = createPolicy({ status: "draft", requirement: { mode: "none" } });
    const result = evaluateApprovalPolicy({
      policy,
      decisions: [],
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    assert.strictEqual(result.applicable, false);
    assert.strictEqual(result.satisfied, false, "PR feedback: non-applicable policy should not be reported as satisfied");
  });
});

test("evaluateApprovalPolicy - Mode: none", () => {
  const policy = createPolicy({ requirement: { mode: "none" } });
  const result = evaluateApprovalPolicy({
    policy,
    decisions: [],
    subject: SUBJECT,
    operation: OPERATION,
    workspaceId: WORKSPACE_ID,
  });
  assert.strictEqual(result.satisfied, true);
  assert.strictEqual(result.receivedApprovals, 0);
});

test("evaluateApprovalPolicy - Mode: single", async (t) => {
  const policy = createPolicy({ requirement: { mode: "single" } });

  await t.test("should not be satisfied with zero approvals", () => {
    const result = evaluateApprovalPolicy({
      policy,
      decisions: [],
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    assert.strictEqual(result.satisfied, false);
    assert.strictEqual(result.receivedApprovals, 0);
  });

  await t.test("should be satisfied with one valid approval", () => {
    const decisions = [createDecision("d1", "user1")];
    const result = evaluateApprovalPolicy({
      policy,
      decisions,
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    assert.strictEqual(result.satisfied, true);
    assert.strictEqual(result.receivedApprovals, 1);
    assert.deepStrictEqual(result.countedDecisionIds, ["d1"]);
  });
});

test("evaluateApprovalPolicy - Mode: quorum", async (t) => {
  const policy = createPolicy({ requirement: { mode: "quorum", minimumApprovals: 2 } });

  await t.test("should not be satisfied with less than minimum", () => {
    const decisions = [createDecision("d1", "user1")];
    const result = evaluateApprovalPolicy({
      policy,
      decisions,
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    assert.strictEqual(result.satisfied, false);
    assert.strictEqual(result.receivedApprovals, 1);
  });

  await t.test("should be satisfied with minimum approvals", () => {
    const decisions = [createDecision("d1", "user1"), createDecision("d2", "user2")];
    const result = evaluateApprovalPolicy({
      policy,
      decisions,
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    assert.strictEqual(result.satisfied, true);
    assert.strictEqual(result.receivedApprovals, 2);
  });
});

test("evaluateApprovalPolicy - Mode: unanimous", async (t) => {
  await t.test("should not be satisfied if some roles are missing", () => {
    const policy = createPolicy({
      requirement: {
        mode: "unanimous",
        approverRoles: ["manager", "security"],
      },
    });
    const decisions = [createDecision("d1", "user1")];
    const actorRolesByActorId = { user1: ["manager"] };
    const result = evaluateApprovalPolicy({
      policy,
      decisions,
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
      actorRolesByActorId,
    });
    assert.strictEqual(result.satisfied, false);
    assert.strictEqual(result.receivedApprovals, 1);
  });

  await t.test("should be satisfied if all roles have at least one approval", () => {
    const policy = createPolicy({
      requirement: {
        mode: "unanimous",
        approverRoles: ["manager", "security"],
      },
    });
    const decisions = [createDecision("d1", "user1"), createDecision("d2", "user2")];
    const actorRolesByActorId = {
      user1: ["manager"],
      user2: ["security"],
    };
    const result = evaluateApprovalPolicy({
      policy,
      decisions,
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
      actorRolesByActorId,
    });
    assert.strictEqual(result.satisfied, true);
    assert.strictEqual(result.receivedApprovals, 2);
  });

  await t.test("unanimous without roles returns explicit unsatisfied reason", () => {
    const policy = createPolicy({
      requirement: {
        mode: "unanimous",
        approverRoles: [], // Empty or missing
      },
    });
    const decisions = [createDecision("d1", "user1")];
    const result = evaluateApprovalPolicy({
      policy,
      decisions,
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    assert.strictEqual(result.satisfied, false);
    assert.ok(result.reasons.some((r) => r.code === "UNANIMOUS_ROLES_UNDEFINED"));
  });
});

test("evaluateApprovalPolicy - Filtering", async (t) => {
  const policy = createPolicy();

  await t.test("should ignore decisions for different version", () => {
    const decisions = [
      createDecision("d1", "user1", "approved", { subject: { ...SUBJECT, version: "2.0.0" } }),
    ];
    const result = evaluateApprovalPolicy({
      policy,
      decisions,
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    assert.strictEqual(result.receivedApprovals, 0);
    assert.ok(result.ignoredDecisionIds.includes("d1"));
  });

  await t.test("should ignore rejected/changes_requested decisions", () => {
    const decisions = [
      createDecision("d1", "user1", "rejected"),
      createDecision("d2", "user2", "changes_requested"),
    ];
    const result = evaluateApprovalPolicy({
      policy,
      decisions,
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    assert.strictEqual(result.receivedApprovals, 0);
    assert.ok(result.ignoredDecisionIds.includes("d1"));
    assert.ok(result.ignoredDecisionIds.includes("d2"));
  });

  await t.test("decision without policyId ignored", () => {
    const decisions = [
      createDecision("d1", "user1", "approved", { policyId: undefined }),
    ];
    const result = evaluateApprovalPolicy({
      policy,
      decisions,
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    assert.strictEqual(result.receivedApprovals, 0);
    assert.ok(result.ignoredDecisionIds.includes("d1"));
  });

  await t.test("decision with another policyId ignored", () => {
    const decisions = [
      createDecision("d1", "user1", "approved", { policyId: "other-policy" }),
    ];
    const result = evaluateApprovalPolicy({
      policy,
      decisions,
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    assert.strictEqual(result.receivedApprovals, 0);
    assert.ok(result.ignoredDecisionIds.includes("d1"));
  });
});

test("evaluateApprovalPolicy - Deduplication and Most Recent Wins", async (t) => {
  const policy = createPolicy({ requirement: { mode: "single" } });

  await t.test("latest rejected decision overrides earlier approved decision", () => {
    const decisions = [
      createDecision("d1", "user1", "approved", { decidedAt: "2023-01-01T10:00:00Z" }),
      createDecision("d2", "user1", "rejected", { decidedAt: "2023-01-01T11:00:00Z" }),
    ];
    const result = evaluateApprovalPolicy({
      policy,
      decisions,
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    assert.strictEqual(result.receivedApprovals, 0);
    assert.strictEqual(result.satisfied, false);
  });

  await t.test("latest changes_requested overrides earlier approved decision", () => {
    const decisions = [
      createDecision("d1", "user1", "approved", { decidedAt: "2023-01-01T10:00:00Z" }),
      createDecision("d2", "user1", "changes_requested", { decidedAt: "2023-01-01T11:00:00Z" }),
    ];
    const result = evaluateApprovalPolicy({
      policy,
      decisions,
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    assert.strictEqual(result.receivedApprovals, 0);
    assert.strictEqual(result.satisfied, false);
  });

  await t.test("should take the most recent decision from the same actor (by id if date equal)", () => {
    const decisions = [
      createDecision("d1", "user1", "rejected", { decidedAt: "2023-01-01T10:00:00Z" }),
      createDecision("d2", "user1", "approved", { decidedAt: "2023-01-01T10:00:00Z" }),
    ];
    const result = evaluateApprovalPolicy({
      policy,
      decisions,
      subject: SUBJECT,
      operation: OPERATION,
      workspaceId: WORKSPACE_ID,
    });
    // Most recent is d2 (approved) because "d2" > "d1"
    assert.strictEqual(result.receivedApprovals, 1);
    assert.strictEqual(result.satisfied, true);
    assert.deepStrictEqual(result.countedDecisionIds, ["d2"]);
  });
});

test("evaluateApprovalPolicy - Determinism", () => {
  const policy = createPolicy({ requirement: { mode: "quorum", minimumApprovals: 2 } });
  const decisions = [
    createDecision("d1", "user1"),
    createDecision("d2", "user2"),
    createDecision("d3", "user3", "rejected"),
    createDecision("d0", "user0", "approved", { workspaceId: OTHER_WORKSPACE_ID }),
  ];

  const shuffled = [...decisions].sort(() => Math.random() - 0.5);

  const result1 = evaluateApprovalPolicy({
    policy,
    decisions,
    subject: SUBJECT,
    operation: OPERATION,
    workspaceId: WORKSPACE_ID,
  });

  const result2 = evaluateApprovalPolicy({
    policy,
    decisions: shuffled,
    subject: SUBJECT,
    operation: OPERATION,
    workspaceId: WORKSPACE_ID,
  });

  assert.deepStrictEqual(result1.countedDecisionIds, result2.countedDecisionIds, "counted IDs deterministic across shuffled input");
  assert.deepStrictEqual(result1.ignoredDecisionIds, result2.ignoredDecisionIds, "ignored IDs deterministic across shuffled input");
  assert.deepStrictEqual(result1.reasons, result2.reasons, "reasons deterministic across shuffled input");

  // Verify sort
  assert.deepStrictEqual([...result1.countedDecisionIds].sort(), result1.countedDecisionIds);
  assert.deepStrictEqual([...result1.ignoredDecisionIds].sort(), result1.ignoredDecisionIds);
});

test("evaluateApprovalPolicy - Purity and Immutability", () => {
  const policy = createPolicy();
  const decisions = [createDecision("d1", "user1")];
  const decisionsCopy = JSON.parse(JSON.stringify(decisions));
  const policyCopy = JSON.parse(JSON.stringify(policy));

  evaluateApprovalPolicy({
    policy,
    decisions,
    subject: SUBJECT,
    operation: OPERATION,
    workspaceId: WORKSPACE_ID,
  });

  assert.deepStrictEqual(decisions, decisionsCopy, "decisions array should not be mutated");
  assert.deepStrictEqual(policy, policyCopy, "policy object should not be mutated");
});
