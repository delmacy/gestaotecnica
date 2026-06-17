import { test } from "node:test";
import assert from "node:assert";
import {
  validateProcessGraph,
  isProcessGraphValid
} from "../../src/platform/workflows/validation/process-graph-validation";
import { ProcessVersion } from "../../src/platform/workflows/contracts";

// Helper to create a base ProcessVersion
const createBaseVersion = (overrides: Partial<ProcessVersion["definition"]> = {}): ProcessVersion => {
  return {
    id: "ver-1",
    workspaceId: "00000000-0000-0000-0000-000000000000",
    processDefinitionId: "def-1",
    version: 1,
    status: "draft",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    createdById: "user-1",
    definition: {
      schemaVersion: "1.0.0",
      nodes: [],
      edges: [],
      ...overrides,
    },
  } as ProcessVersion;
};

test("validateProcessGraph - valid linear graph", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "start", key: "start", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} },
      { id: "end", key: "end", type: "end", name: "End", position: { x: 200, y: 0 }, config: {} },
    ],
    edges: [
      { id: "edge-1", sourceNodeId: "start", targetNodeId: "end", type: "default", priority: 0 },
    ],
  });

  const report = validateProcessGraph(version);
  assert.strictEqual(report.valid, true);
  assert.strictEqual(report.issues.length, 0);
  assert.strictEqual(isProcessGraphValid(version), true);
});

test("validateProcessGraph - NO_START_NODE", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "end", key: "end", type: "end", name: "End", position: { x: 200, y: 0 }, config: {} },
    ],
  });

  const report = validateProcessGraph(version);
  assert.strictEqual(report.valid, false);
  assert.ok(report.issues.some((i) => i.code === "NO_START_NODE"));
});

test("validateProcessGraph - MULTIPLE_START_NODES", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "start-1", key: "start-1", type: "start", name: "Start 1", position: { x: 0, y: 0 }, config: {} },
      { id: "start-2", key: "start-2", type: "start", name: "Start 2", position: { x: 0, y: 100 }, config: {} },
      { id: "end", key: "end", type: "end", name: "End", position: { x: 200, y: 0 }, config: {} },
    ],
  });

  const report = validateProcessGraph(version);
  assert.strictEqual(report.valid, false);
  assert.ok(report.issues.some((i) => i.code === "MULTIPLE_START_NODES"));
});

test("validateProcessGraph - NO_END_NODE", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "start", key: "start", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} },
    ],
  });

  const report = validateProcessGraph(version);
  assert.strictEqual(report.valid, false);
  assert.ok(report.issues.some((i) => i.code === "NO_END_NODE"));
});

test("validateProcessGraph - START_HAS_INCOMING_EDGE", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "start", key: "start", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} },
      { id: "end", key: "end", type: "end", name: "End", position: { x: 200, y: 0 }, config: {} },
    ],
    edges: [
      { id: "edge-1", sourceNodeId: "end", targetNodeId: "start", type: "default", priority: 0 },
    ],
  });

  const report = validateProcessGraph(version);
  assert.strictEqual(report.valid, false);
  assert.ok(report.issues.some((i) => i.code === "START_HAS_INCOMING_EDGE"));
});

test("validateProcessGraph - END_HAS_OUTGOING_EDGE", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "start", key: "start", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} },
      { id: "end", key: "end", type: "end", name: "End", position: { x: 200, y: 0 }, config: {} },
    ],
    edges: [
      { id: "edge-1", sourceNodeId: "start", targetNodeId: "end", type: "default", priority: 0 },
      { id: "edge-2", sourceNodeId: "end", targetNodeId: "start", type: "default", priority: 0 },
    ],
  });

  const report = validateProcessGraph(version);
  assert.ok(report.issues.some((i) => i.code === "END_HAS_OUTGOING_EDGE"));
});

test("validateProcessGraph - DEAD_END_NON_TERMINAL_NODE", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "start", key: "start", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} },
      { id: "action", key: "action", type: "action", name: "Action", position: { x: 100, y: 0 }, config: {}, actionKey: "test" },
      { id: "end", key: "end", type: "end", name: "End", position: { x: 200, y: 0 }, config: {} },
    ],
    edges: [
      { id: "edge-1", sourceNodeId: "start", targetNodeId: "action", type: "default", priority: 0 },
    ],
  });

  const report = validateProcessGraph(version);
  assert.strictEqual(report.valid, false);
  assert.ok(report.issues.some((i) => i.code === "DEAD_END_NON_TERMINAL_NODE" && i.nodeId === "action"));
});

test("validateProcessGraph - UNREACHABLE_NODE", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "start", key: "start", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} },
      { id: "action-1", key: "action-1", type: "action", name: "Action 1", position: { x: 100, y: 0 }, config: {}, actionKey: "test" },
      { id: "action-2", key: "action-2", type: "action", name: "Action 2", position: { x: 100, y: 100 }, config: {}, actionKey: "test" },
      { id: "end", key: "end", type: "end", name: "End", position: { x: 200, y: 0 }, config: {} },
    ],
    edges: [
      { id: "edge-1", sourceNodeId: "start", targetNodeId: "action-1", type: "default", priority: 0 },
      { id: "edge-2", sourceNodeId: "action-1", targetNodeId: "end", type: "default", priority: 0 },
    ],
  });

  const report = validateProcessGraph(version);
  assert.strictEqual(report.valid, false);
  assert.ok(report.issues.some((i) => i.code === "UNREACHABLE_NODE" && i.nodeId === "action-2"));
});

test("validateProcessGraph - CYCLE_DETECTED as warning", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "start", key: "start", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} },
      { id: "action", key: "action", type: "action", name: "Action", position: { x: 100, y: 0 }, config: {}, actionKey: "test" },
      { id: "end", key: "end", type: "end", name: "End", position: { x: 200, y: 0 }, config: {} },
    ],
    edges: [
      { id: "edge-1", sourceNodeId: "start", targetNodeId: "action", type: "default", priority: 0 },
      { id: "edge-2", sourceNodeId: "action", targetNodeId: "action", type: "default", priority: 0 },
      { id: "edge-3", sourceNodeId: "action", targetNodeId: "end", type: "default", priority: 1 },
    ],
  });

  const report = validateProcessGraph(version);
  assert.strictEqual(report.valid, true); // Cycles are warnings
  assert.ok(report.issues.some((i) => i.code === "CYCLE_DETECTED" && i.severity === "warning"));
});

test("validateProcessGraph - DECISION_WITHOUT_BRANCHES", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "start", key: "start", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} },
      { id: "decision", key: "decision", type: "decision", name: "Decision", position: { x: 100, y: 0 }, config: {} },
      { id: "end", key: "end", type: "end", name: "End", position: { x: 200, y: 0 }, config: {} },
    ],
    edges: [
      { id: "edge-1", sourceNodeId: "start", targetNodeId: "decision", type: "default", priority: 0 },
    ],
  });

  const report = validateProcessGraph(version);
  assert.strictEqual(report.valid, false);
  assert.ok(report.issues.some((i) => i.code === "DECISION_WITHOUT_BRANCHES" && i.nodeId === "decision"));
});

test("validateProcessGraph - DUPLICATE_DECISION_PRIORITY", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "start", key: "start", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} },
      { id: "decision", key: "decision", type: "decision", name: "Decision", position: { x: 100, y: 0 }, config: {} },
      { id: "end-1", key: "end-1", type: "end", name: "End 1", position: { x: 200, y: 0 }, config: {} },
      { id: "end-2", key: "end-2", type: "end", name: "End 2", position: { x: 200, y: 100 }, config: {} },
    ],
    edges: [
      { id: "edge-1", sourceNodeId: "start", targetNodeId: "decision", type: "default", priority: 0 },
      { id: "edge-2", sourceNodeId: "decision", targetNodeId: "end-1", type: "default", priority: 1 },
      { id: "edge-3", sourceNodeId: "decision", targetNodeId: "end-2", type: "default", priority: 1 },
    ],
  });

  const report = validateProcessGraph(version);
  assert.strictEqual(report.valid, false);
  assert.ok(report.issues.some((i) => i.code === "DUPLICATE_DECISION_PRIORITY" && i.nodeId === "decision"));
});

test("validateProcessGraph - issue determinism", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "start", key: "start", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} },
      { id: "node-z", key: "node-z", type: "action", name: "Node Z", position: { x: 100, y: 0 }, config: {}, actionKey: "test" },
      { id: "node-a", key: "node-a", type: "action", name: "Node A", position: { x: 100, y: 100 }, config: {}, actionKey: "test" },
      { id: "end", key: "end", type: "end", name: "End", position: { x: 200, y: 0 }, config: {} },
    ],
    edges: [
      { id: "edge-start-z", sourceNodeId: "start", targetNodeId: "node-z", type: "default", priority: 0 },
      { id: "edge-start-a", sourceNodeId: "start", targetNodeId: "node-a", type: "default", priority: 0 },
    ],
  });

  const report = validateProcessGraph(version);
  const deadEndIssues = report.issues.filter(i => i.code === "DEAD_END_NON_TERMINAL_NODE");

  assert.strictEqual(deadEndIssues.length, 2);
  assert.strictEqual(deadEndIssues[0].nodeId, "node-a");
  assert.strictEqual(deadEndIssues[1].nodeId, "node-z");
});

test("validateProcessGraph - input immutability", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "start", key: "start", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} },
      { id: "end", key: "end", type: "end", name: "End", position: { x: 200, y: 0 }, config: {} },
    ],
    edges: [
      { id: "edge-1", sourceNodeId: "start", targetNodeId: "end", type: "default", priority: 0 },
    ],
  });

  Object.freeze(version);
  Object.freeze(version.definition);
  Object.freeze(version.definition.nodes);
  Object.freeze(version.definition.edges);

  assert.doesNotThrow(() => validateProcessGraph(version));
});

test("validateProcessGraph - empty graph", () => {
  const version = createBaseVersion({
    nodes: [],
    edges: [],
  });

  const report = validateProcessGraph(version);
  assert.strictEqual(report.valid, false);
  assert.ok(report.issues.some((i) => i.code === "NO_START_NODE"));
  assert.ok(report.issues.some((i) => i.code === "NO_END_NODE"));
});

test("validateProcessGraph - cycle in unreachable component", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "start", key: "start", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} },
      { id: "end", key: "end", type: "end", name: "End", position: { x: 200, y: 0 }, config: {} },
      { id: "unreachable-1", key: "unreachable-1", type: "action", name: "U1", position: { x: 0, y: 100 }, config: {}, actionKey: "test" },
      { id: "unreachable-2", key: "unreachable-2", type: "action", name: "U2", position: { x: 100, y: 100 }, config: {}, actionKey: "test" },
    ],
    edges: [
      { id: "edge-1", sourceNodeId: "start", targetNodeId: "end", type: "default", priority: 0 },
      { id: "edge-u1", sourceNodeId: "unreachable-1", targetNodeId: "unreachable-2", type: "default", priority: 0 },
      { id: "edge-u2", sourceNodeId: "unreachable-2", targetNodeId: "unreachable-1", type: "default", priority: 0 },
    ],
  });

  const report = validateProcessGraph(version);
  assert.ok(report.issues.some((i) => i.code === "CYCLE_DETECTED" && i.severity === "warning"));
  assert.ok(report.issues.some((i) => i.code === "UNREACHABLE_NODE" && i.nodeId === "unreachable-1"));
});

test("validateProcessGraph - cycle with no start node", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "action-1", key: "action-1", type: "action", name: "A1", position: { x: 0, y: 0 }, config: {}, actionKey: "test" },
      { id: "action-2", key: "action-2", type: "action", name: "A2", position: { x: 100, y: 0 }, config: {}, actionKey: "test" },
      { id: "end", key: "end", type: "end", name: "End", position: { x: 200, y: 0 }, config: {} },
    ],
    edges: [
      { id: "edge-1", sourceNodeId: "action-1", targetNodeId: "action-2", type: "default", priority: 0 },
      { id: "edge-2", sourceNodeId: "action-2", targetNodeId: "action-1", type: "default", priority: 0 },
      { id: "edge-3", sourceNodeId: "action-2", targetNodeId: "end", type: "default", priority: 1 },
    ],
  });

  const report = validateProcessGraph(version);
  assert.ok(report.issues.some((i) => i.code === "CYCLE_DETECTED" && i.severity === "warning"));
  assert.ok(report.issues.some((i) => i.code === "NO_START_NODE"));
});

test("validateProcessGraph - cycle with multiple start nodes", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "start-1", key: "start-1", type: "start", name: "S1", position: { x: 0, y: 0 }, config: {} },
      { id: "start-2", key: "start-2", type: "start", name: "S2", position: { x: 0, y: 100 }, config: {} },
      { id: "end", key: "end", type: "end", name: "End", position: { x: 200, y: 0 }, config: {} },
    ],
    edges: [
      { id: "edge-1", sourceNodeId: "start-1", targetNodeId: "start-1", type: "default", priority: 0 },
      { id: "edge-2", sourceNodeId: "start-1", targetNodeId: "end", type: "default", priority: 1 },
      { id: "edge-3", sourceNodeId: "start-2", targetNodeId: "end", type: "default", priority: 0 },
    ],
  });

  const report = validateProcessGraph(version);
  assert.ok(report.issues.some((i) => i.code === "CYCLE_DETECTED" && i.severity === "warning"));
  assert.ok(report.issues.some((i) => i.code === "MULTIPLE_START_NODES"));
});

test("validateProcessGraph - multiple disconnected cycles with deterministic reporting", () => {
  const version = createBaseVersion({
    nodes: [
      { id: "start", key: "start", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} },
      { id: "end", key: "end", type: "end", name: "End", position: { x: 200, y: 0 }, config: {} },
      { id: "cycle-a", key: "cycle-a", type: "action", name: "CA", position: { x: 0, y: 100 }, config: {}, actionKey: "test" },
      { id: "cycle-b", key: "cycle-b", type: "action", name: "CB", position: { x: 0, y: 200 }, config: {}, actionKey: "test" },
    ],
    edges: [
      { id: "edge-start", sourceNodeId: "start", targetNodeId: "end", type: "default", priority: 0 },
      { id: "edge-a", sourceNodeId: "cycle-a", targetNodeId: "cycle-a", type: "default", priority: 0 },
      { id: "edge-b", sourceNodeId: "cycle-b", targetNodeId: "cycle-b", type: "default", priority: 0 },
    ],
  });

  const report = validateProcessGraph(version);
  const cycleIssues = report.issues.filter(i => i.code === "CYCLE_DETECTED");
  assert.strictEqual(cycleIssues.length, 2);
  // Deterministic order by nodeId
  assert.strictEqual(cycleIssues[0].nodeId, "cycle-a");
  assert.strictEqual(cycleIssues[1].nodeId, "cycle-b");
});
