import { describe, it } from "node:test";
import assert from "node:assert";
import { extractNodesAndEdges } from "../../src/features/workflow/runtime/runtime-step.service";

describe("Runtime Step Definition Graph Types", () => {
  it("should extract root-level nodes and edges", () => {
    const definition = {
      nodes: [
        { id: "node1", type: "start" },
        { id: "node2", type: "task" }
      ],
      edges: [
        { id: "edge1", source: "node1", target: "node2" }
      ]
    };

    const result = extractNodesAndEdges(definition);
    assert.deepStrictEqual(result.nodes, definition.nodes);
    assert.deepStrictEqual(result.edges, definition.edges);
  });

  it("should extract nodes and edges from draft object if missing at root", () => {
    const definition = {
      draft: {
        nodes: [
          { id: "node3", type: "start" },
          { id: "node4", type: "end" }
        ],
        edges: [
          { id: "edge2", source: "node3", target: "node4" }
        ]
      }
    };

    const result = extractNodesAndEdges(definition);
    assert.deepStrictEqual(result.nodes, definition.draft.nodes);
    assert.deepStrictEqual(result.edges, definition.draft.edges);
  });

  it("should fallback to empty arrays if nodes and edges are missing entirely", () => {
    const definition = {};
    const result = extractNodesAndEdges(definition);
    assert.deepStrictEqual(result.nodes, []);
    assert.deepStrictEqual(result.edges, []);
  });

  it("should fallback to empty arrays if definition is null or undefined", () => {
    const resultNull = extractNodesAndEdges(null);
    assert.deepStrictEqual(resultNull.nodes, []);
    assert.deepStrictEqual(resultNull.edges, []);

    const resultUndefined = extractNodesAndEdges(undefined);
    assert.deepStrictEqual(resultUndefined.nodes, []);
    assert.deepStrictEqual(resultUndefined.edges, []);
  });
});
