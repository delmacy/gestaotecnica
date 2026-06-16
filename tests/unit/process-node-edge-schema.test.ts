import { describe, it } from "node:test";
import assert from "node:assert";
import {
  ProcessNodeSchema,
  ProcessEdgeSchema,
  ProcessEdgeConditionSchema,
  ProcessNodePositionSchema,
  ProcessNodeTypeSchema
} from "../../src/platform/workflows/contracts/process-node-edge";

const VALID_ID = "123e4567-e89b-12d3-a456-426614174000";

describe("ProcessNodeTypeSchema", () => {
  it("should accept all valid types", () => {
    const validTypes = ["start", "action", "decision", "form", "wait", "subprocess", "end"];
    validTypes.forEach(type => {
      assert.doesNotThrow(() => ProcessNodeTypeSchema.parse(type));
    });
  });

  it("should reject invalid types", () => {
    assert.throws(() => ProcessNodeTypeSchema.parse("invalid"));
  });
});

describe("ProcessNodePositionSchema", () => {
  it("should accept valid positions", () => {
    assert.doesNotThrow(() => ProcessNodePositionSchema.parse({ x: 10, y: 20 }));
    assert.doesNotThrow(() => ProcessNodePositionSchema.parse({ x: -10, y: -20 }));
    assert.doesNotThrow(() => ProcessNodePositionSchema.parse({ x: 0, y: 0 }));
  });

  it("should reject NaN and Infinity", () => {
    assert.throws(() => ProcessNodePositionSchema.parse({ x: NaN, y: 0 }));
    assert.throws(() => ProcessNodePositionSchema.parse({ x: Infinity, y: 0 }));
  });

  it("should reject unknown fields", () => {
    assert.throws(() => ProcessNodePositionSchema.parse({ x: 0, y: 0, z: 0 }));
  });
});

describe("ProcessNodeSchema", () => {
  const baseNode = {
    id: VALID_ID,
    key: "valid-key",
    name: "Valid Node",
    position: { x: 0, y: 0 },
    config: {}
  };

  it("should accept valid start node", () => {
    assert.doesNotThrow(() => ProcessNodeSchema.parse({ ...baseNode, type: "start" }));
  });

  it("should accept valid action node with actionKey", () => {
    assert.doesNotThrow(() => ProcessNodeSchema.parse({ ...baseNode, type: "action", actionKey: "some-action" }));
  });

  it("should reject action node without actionKey", () => {
    assert.throws(() => ProcessNodeSchema.parse({ ...baseNode, type: "action" }));
  });

  it("should accept valid form node with formKey", () => {
    assert.doesNotThrow(() => ProcessNodeSchema.parse({ ...baseNode, type: "form", formKey: "some-form" }));
  });

  it("should reject form node without formKey", () => {
    assert.throws(() => ProcessNodeSchema.parse({ ...baseNode, type: "form" }));
  });

  it("should accept valid subprocess node with subprocessDefinitionKey", () => {
    assert.doesNotThrow(() => ProcessNodeSchema.parse({ ...baseNode, type: "subprocess", subprocessDefinitionKey: "sub-key" }));
  });

  it("should reject subprocess node without subprocessDefinitionKey", () => {
    assert.throws(() => ProcessNodeSchema.parse({ ...baseNode, type: "subprocess" }));
  });

  it("should accept other types without special keys", () => {
    assert.doesNotThrow(() => ProcessNodeSchema.parse({ ...baseNode, type: "decision" }));
    assert.doesNotThrow(() => ProcessNodeSchema.parse({ ...baseNode, type: "wait" }));
    assert.doesNotThrow(() => ProcessNodeSchema.parse({ ...baseNode, type: "end" }));
  });

  it("should reject invalid key", () => {
    assert.throws(() => ProcessNodeSchema.parse({ ...baseNode, type: "start", key: "Invalid Key" }));
  });

  it("should reject empty name", () => {
    assert.throws(() => ProcessNodeSchema.parse({ ...baseNode, type: "start", name: "" }));
  });

  it("should reject description above limit", () => {
    assert.throws(() => ProcessNodeSchema.parse({ ...baseNode, type: "start", description: "a".repeat(2001) }));
  });

  it("should require config", () => {
    const { config, ...nodeWithoutConfig } = baseNode;
    assert.throws(() => ProcessNodeSchema.parse({ ...nodeWithoutConfig, type: "start" }));
  });

  it("should accept metadata", () => {
    assert.doesNotThrow(() => ProcessNodeSchema.parse({ ...baseNode, type: "start", metadata: { foo: "bar" } }));
  });

  it("should reject unknown fields", () => {
    assert.throws(() => ProcessNodeSchema.parse({ ...baseNode, type: "start", extra: "field" }));
  });
});

describe("ProcessEdgeConditionSchema", () => {
  it("should accept valid conditions", () => {
    assert.doesNotThrow(() => ProcessEdgeConditionSchema.parse({ expression: "1 == 1", language: "expression" }));
    assert.doesNotThrow(() => ProcessEdgeConditionSchema.parse({ expression: "{}", language: "json_logic" }));
  });

  it("should reject invalid language", () => {
    assert.throws(() => ProcessEdgeConditionSchema.parse({ expression: "1 == 1", language: "invalid" }));
  });

  it("should reject empty expression", () => {
    assert.throws(() => ProcessEdgeConditionSchema.parse({ expression: "", language: "expression" }));
  });

  it("should reject expression above limit", () => {
    assert.throws(() => ProcessEdgeConditionSchema.parse({ expression: "a".repeat(4001), language: "expression" }));
  });

  it("should reject unknown fields", () => {
    assert.throws(() => ProcessEdgeConditionSchema.parse({ expression: "1 == 1", language: "expression", extra: "field" }));
  });
});

describe("ProcessEdgeSchema", () => {
  const baseEdge = {
    id: VALID_ID,
    sourceNodeId: VALID_ID,
    targetNodeId: VALID_ID,
    priority: 1
  };

  it("should accept valid default edge", () => {
    assert.doesNotThrow(() => ProcessEdgeSchema.parse({ ...baseEdge, type: "default" }));
  });

  it("should accept valid conditional edge with condition", () => {
    assert.doesNotThrow(() => ProcessEdgeSchema.parse({
      ...baseEdge,
      type: "conditional",
      condition: { expression: "true", language: "expression" }
    }));
  });

  it("should reject conditional edge without condition", () => {
    assert.throws(() => ProcessEdgeSchema.parse({ ...baseEdge, type: "conditional" }));
  });

  it("should accept error and timeout edges", () => {
    assert.doesNotThrow(() => ProcessEdgeSchema.parse({ ...baseEdge, type: "error" }));
    assert.doesNotThrow(() => ProcessEdgeSchema.parse({ ...baseEdge, type: "timeout" }));
  });

  it("should accept priority zero and positive", () => {
    assert.doesNotThrow(() => ProcessEdgeSchema.parse({ ...baseEdge, type: "default", priority: 0 }));
    assert.doesNotThrow(() => ProcessEdgeSchema.parse({ ...baseEdge, type: "default", priority: 10 }));
  });

  it("should reject negative priority", () => {
    assert.throws(() => ProcessEdgeSchema.parse({ ...baseEdge, type: "default", priority: -1 }));
  });

  it("should reject fractional priority", () => {
    assert.throws(() => ProcessEdgeSchema.parse({ ...baseEdge, type: "default", priority: 1.5 }));
  });

  it("should reject invalid IDs", () => {
    assert.throws(() => ProcessEdgeSchema.parse({ ...baseEdge, type: "default", sourceNodeId: "" }));
    assert.throws(() => ProcessEdgeSchema.parse({ ...baseEdge, type: "default", targetNodeId: "" }));
  });

  it("should accept metadata", () => {
    assert.doesNotThrow(() => ProcessEdgeSchema.parse({ ...baseEdge, type: "default", metadata: { foo: "bar" } }));
  });

  it("should reject unknown fields", () => {
    assert.throws(() => ProcessEdgeSchema.parse({ ...baseEdge, type: "default", extra: "field" }));
  });

  it("should accept self-loop (this package doesn't validate graph)", () => {
    assert.doesNotThrow(() => ProcessEdgeSchema.parse({
      ...baseEdge,
      type: "default",
      sourceNodeId: VALID_ID,
      targetNodeId: VALID_ID
    }));
  });
});
