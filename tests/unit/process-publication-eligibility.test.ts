import test from "node:test";
import assert from "node:assert";
import { evaluateProcessPublicationEligibility } from "../../src/platform/workflows/governance/process-publication-eligibility";
import { ProcessDefinitionEnvelope } from "../../src/platform/workflows/contracts/process-definition";
import { ApprovalPolicy } from "../../src/platform/governance/contracts/approval-policy";
import { ApprovalDecision } from "../../src/platform/governance/contracts/approval-decision";

const WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

function createEnvelope(overrides: Partial<ProcessDefinitionEnvelope["version"]> = {}): ProcessDefinitionEnvelope {
  const envelope = {
    definition: {
      id: "def-1",
      workspaceId: WORKSPACE_ID,
      key: "process-key",
      name: "Process Name",
      status: "draft",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
      createdById: "user-1",
    },
    version: {
      id: "ver-1",
      workspaceId: WORKSPACE_ID,
      processDefinitionId: "def-1",
      version: 1,
      status: "draft",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
      createdById: "user-1",
      definition: {
        schemaVersion: "1.0",
        nodes: [
          { id: "n1", type: "start", name: "Start", metadata: {} },
          { id: "n2", type: "end", name: "End", metadata: {} },
        ],
        edges: [
          { id: "e1", sourceNodeId: "n1", targetNodeId: "n2", priority: 1 },
        ],
      },
      ...overrides,
    },
  };
  return envelope as unknown as ProcessDefinitionEnvelope;
}

function createPolicy(overrides: Partial<ApprovalPolicy> = {}): ApprovalPolicy {
  return {
    id: "policy-1",
    workspaceId: WORKSPACE_ID,
    key: "publish-policy",
    name: "Publish Policy",
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

function createDecision(id: string, actorId: string, decision: ApprovalDecision["decision"] = "approved"): ApprovalDecision {
  return {
    id,
    workspaceId: WORKSPACE_ID,
    subject: { type: "process_version", id: "ver-1", version: 1 },
    decision,
    actor: { type: "user", id: actorId },
    policyId: "policy-1",
    decidedAt: "2023-01-01T12:00:00Z",
  };
}

test("evaluateProcessPublicationEligibility - Basic Success", () => {
  const envelope = createEnvelope();
  const result = evaluateProcessPublicationEligibility({ envelope });

  assert.strictEqual(result.eligible, true);
  assert.strictEqual(result.graphValid, true);
  assert.strictEqual(result.approvalSatisfied, true);
  assert.strictEqual(result.reasons.length, 0);
});

test("evaluateProcessPublicationEligibility - Version Status", () => {
  const envelope = createEnvelope({ status: "published", publishedAt: "2023-01-01T12:00:00Z", publishedById: "user-1" });
  const result = evaluateProcessPublicationEligibility({ envelope });

  assert.strictEqual(result.eligible, false);
  assert.ok(result.reasons.some(r => r.code === "VERSION_STATUS_NOT_PUBLISHABLE"));
});

test("evaluateProcessPublicationEligibility - Graph Errors", () => {
  const envelope = createEnvelope();
  // Remove nodes to cause error (NO_START_NODE)
  const version = envelope.version;
  version.definition.nodes = [];
  version.definition.edges = [];

  const result = evaluateProcessPublicationEligibility({ envelope });

  assert.strictEqual(result.eligible, false);
  assert.strictEqual(result.graphValid, false);
  assert.ok(result.reasons.some(r => r.source === "graph" && r.code === "NO_START_NODE"));
});

test("evaluateProcessPublicationEligibility - Graph Warnings (Cycle)", () => {
  const envelope = createEnvelope();
  // Add cycle: n1 (start) -> n3 (task) -> n2 (end)
  // Cycle: n3 -> n3
  const version = envelope.version;
  version.definition.nodes.push({ id: "n3", type: "task", name: "Task", metadata: {} });
  // Replace e1: n1 -> n2 with n1 -> n3
  version.definition.edges = [
    { id: "e1", sourceNodeId: "n1", targetNodeId: "n3", priority: 1 },
    { id: "e2", sourceNodeId: "n3", targetNodeId: "n2", priority: 1 },
    { id: "e3", sourceNodeId: "n3", targetNodeId: "n3", priority: 2 },
  ];

  const result = evaluateProcessPublicationEligibility({ envelope });

  // Warnings don't block eligibility
  assert.strictEqual(result.eligible, true);
  assert.strictEqual(result.graphValid, true);
  // Cycle warning should not be in reasons because only errors are included in reasons array for publication gate
  assert.strictEqual(result.reasons.filter(r => r.source === "graph").length, 0);
});

test("evaluateProcessPublicationEligibility - Approval Policy Applied & Satisfied", () => {
  const envelope = createEnvelope();
  const policy = createPolicy();
  const decisions = [createDecision("d1", "user-1")];

  const result = evaluateProcessPublicationEligibility({ envelope, policy, decisions });

  assert.strictEqual(result.eligible, true);
  assert.strictEqual(result.approvalApplicable, true);
  assert.strictEqual(result.approvalSatisfied, true);
  assert.deepStrictEqual(result.countedDecisionIds, ["d1"]);
});

test("evaluateProcessPublicationEligibility - Approval Policy Applied & NOT Satisfied", () => {
  const envelope = createEnvelope();
  const policy = createPolicy();

  const result = evaluateProcessPublicationEligibility({ envelope, policy, decisions: [] });

  assert.strictEqual(result.eligible, false);
  assert.strictEqual(result.approvalApplicable, true);
  assert.strictEqual(result.approvalSatisfied, false);
  assert.ok(result.reasons.some(r => r.source === "approval" && r.code === "INSUFFICIENT_APPROVALS"));
});

test("evaluateProcessPublicationEligibility - Approval Policy Not Applicable", () => {
  const envelope = createEnvelope();
  const policy = createPolicy({ workspaceId: "other-workspace" });

  const result = evaluateProcessPublicationEligibility({ envelope, policy, decisions: [] });

  // Policy provided but not applicable should NOT block publication
  assert.strictEqual(result.eligible, true);
  assert.strictEqual(result.approvalApplicable, false);
  assert.strictEqual(result.approvalSatisfied, true);
});

test("evaluateProcessPublicationEligibility - Multi-error Sorting & Determinism", () => {
  const envelope = createEnvelope({ status: "archived" });
  const version = envelope.version;
  version.definition.nodes = []; // Errors: NO_START_NODE, NO_END_NODE

  const policy = createPolicy(); // Error: INSUFFICIENT_APPROVALS

  const result = evaluateProcessPublicationEligibility({ envelope, policy, decisions: [] });

  assert.strictEqual(result.eligible, false);
  // Errors expected:
  // 1. INSUFFICIENT_APPROVALS (source: approval)
  // 2. NO_END_NODE (source: graph)
  // 3. NO_START_NODE (source: graph)
  // 4. VERSION_STATUS_NOT_PUBLISHABLE (source: version)
  assert.strictEqual(result.reasons.length, 4);

  // Sorted by source: approval, graph, version
  assert.strictEqual(result.reasons[0].source, "approval");
  assert.strictEqual(result.reasons[1].source, "graph");
  assert.strictEqual(result.reasons[2].source, "graph");
  assert.strictEqual(result.reasons[3].source, "version");
});

test("evaluateProcessPublicationEligibility - Purity: No mutation", () => {
  const envelope = createEnvelope();
  const policy = createPolicy();
  const decisions = [createDecision("d1", "user-1")];

  const envelopeJson = JSON.stringify(envelope);
  const policyJson = JSON.stringify(policy);
  const decisionsJson = JSON.stringify(decisions);

  evaluateProcessPublicationEligibility({ envelope, policy, decisions });

  assert.strictEqual(JSON.stringify(envelope), envelopeJson);
  assert.strictEqual(JSON.stringify(policy), policyJson);
  assert.strictEqual(JSON.stringify(decisions), decisionsJson);
});
