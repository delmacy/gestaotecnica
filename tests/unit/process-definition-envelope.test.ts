import { describe, it } from "node:test";
import assert from "node:assert";
import {
  ProcessDefinitionSchema,
  ProcessVersionSchema,
  ProcessDefinitionEnvelopeSchema,
} from "../../src/platform/workflows/contracts/process-definition";

const VALID_ID = "123e4567-e89b-12d3-a456-426614174000";
const VALID_WORKSPACE = "123e4567-e89b-12d3-a456-426614174001";
const VALID_DATE = "2023-10-27T10:00:00Z";

const baseDefinition = {
  id: VALID_ID,
  workspaceId: VALID_WORKSPACE,
  key: "my-process",
  name: "My Process",
  status: "draft" as const,
  createdAt: VALID_DATE,
  updatedAt: VALID_DATE,
  createdById: VALID_ID,
};

const baseVersion = {
  id: "123e4567-e89b-12d3-a456-426614174002",
  workspaceId: VALID_WORKSPACE,
  processDefinitionId: VALID_ID,
  version: 1,
  status: "draft" as const,
  createdAt: VALID_DATE,
  updatedAt: VALID_DATE,
  createdById: VALID_ID,
  schemaVersion: "1.0.0",
  nodes: [],
  edges: [],
};

describe("ProcessVersionSchema - Integrated Graph", () => {
  it("should accept valid version with nodes and edges", () => {
    const node1 = {
      id: "node-1",
      key: "start-node",
      type: "start",
      name: "Start",
      position: { x: 0, y: 0 },
      config: {},
    };
    const node2 = {
      id: "node-2",
      key: "end-node",
      type: "end",
      name: "End",
      position: { x: 100, y: 0 },
      config: {},
    };
    const edge = {
      id: "edge-1",
      fromNodeId: "node-1",
      toNodeId: "node-2",
      type: "default",
      priority: 1,
    };

    const version = {
      ...baseVersion,
      nodes: [node1, node2],
      edges: [edge],
    };

    const result = ProcessVersionSchema.safeParse(version);
    assert.strictEqual(result.success, true);
  });

  it("should reject duplicate node IDs", () => {
    const node = {
      id: "node-1",
      key: "node-1",
      type: "start",
      name: "Start",
      position: { x: 0, y: 0 },
      config: {},
    };
    const version = {
      ...baseVersion,
      nodes: [node, { ...node, key: "another" }],
    };

    const result = ProcessVersionSchema.safeParse(version);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some((i) => i.message.includes("Duplicate node ID")));
    }
  });

  it("should reject duplicate edge IDs", () => {
    const node1 = { id: "n1", key: "node-1", type: "start", name: "n1", position: { x: 0, y: 0 }, config: {} };
    const node2 = { id: "n2", key: "node-2", type: "end", name: "n2", position: { x: 0, y: 0 }, config: {} };
    const edge = { id: "e1", fromNodeId: "n1", toNodeId: "n2", type: "default", priority: 1 };

    const version = {
      ...baseVersion,
      nodes: [node1, node2],
      edges: [edge, edge],
    };

    const result = ProcessVersionSchema.safeParse(version);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some((i) => i.message.includes("Duplicate edge ID")));
    }
  });

  it("should reject edges with non-existent fromNodeId", () => {
    const node = { id: "n1", key: "node-1", type: "start", name: "n1", position: { x: 0, y: 0 }, config: {} };
    const edge = { id: "e1", fromNodeId: "NON_EXISTENT", toNodeId: "n1", type: "default", priority: 1 };

    const version = {
      ...baseVersion,
      nodes: [node],
      edges: [edge],
    };

    const result = ProcessVersionSchema.safeParse(version);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some((i) => i.message.includes("Edge source node not found")));
    }
  });

  it("should reject edges with non-existent toNodeId", () => {
    const node = { id: "n1", key: "node-1", type: "start", name: "n1", position: { x: 0, y: 0 }, config: {} };
    const edge = { id: "e1", fromNodeId: "n1", toNodeId: "NON_EXISTENT", type: "default", priority: 1 };

    const version = {
      ...baseVersion,
      nodes: [node],
      edges: [edge],
    };

    const result = ProcessVersionSchema.safeParse(version);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some((i) => i.message.includes("Edge target node not found")));
    }
  });

  it("should return frozen object", () => {
    const result = ProcessVersionSchema.parse(baseVersion);
    assert.ok(Object.isFrozen(result));
    assert.throws(() => {
      // @ts-ignore
      result.version = 2;
    });
  });
});

describe("ProcessDefinitionEnvelopeSchema", () => {
  it("should accept valid envelope", () => {
    const node = { id: "n1", key: "node-1", type: "start", name: "n1", position: { x: 0, y: 0 }, config: {} };
    const version = { ...baseVersion, nodes: [node] };

    const envelope = {
      definition: baseDefinition,
      version: version,
      nodes: [node],
      edges: [],
    };

    const result = ProcessDefinitionEnvelopeSchema.safeParse(envelope);
    if (!result.success) {
      console.log(JSON.stringify(result.error.issues, null, 2));
    }
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.ok(Object.isFrozen(result.data));
    }
  });

  it("should reject envelope if nodes don't match version nodes", () => {
    const node1 = { id: "n1", key: "node-1", type: "start", name: "n1", position: { x: 0, y: 0 }, config: {} };
    const node2 = { id: "n2", key: "node-2", type: "end", name: "n2", position: { x: 0, y: 0 }, config: {} };

    const envelope = {
      definition: baseDefinition,
      version: { ...baseVersion, nodes: [node1] },
      nodes: [node2],
      edges: [],
    };

    const result = ProcessDefinitionEnvelopeSchema.safeParse(envelope);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some((i) => i.message.includes("Envelope nodes must match version nodes")));
    }
  });

  it("should reject unknown fields in envelope", () => {
    const envelope = {
      definition: baseDefinition,
      version: baseVersion,
      nodes: [],
      edges: [],
      extra: "bad",
    };

    const result = ProcessDefinitionEnvelopeSchema.safeParse(envelope);
    assert.strictEqual(result.success, false);
  });
});
