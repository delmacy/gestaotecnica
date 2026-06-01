import type { Node } from "@xyflow/react";
import type { BuilderEdge, BuilderNode } from "../types";
import type { BuilderFlowEdge, BuilderFlowNode } from "./builder-flow-types";

export function toBuilderFlowNodes(
  nodes: BuilderNode[],
  selectedNodeId?: string,
): BuilderFlowNode[] {
  return nodes.map((node) => ({
    id: node.id,
    type: "builderNode",
    position: node.position,
    data: {
      builderNode: node,
      selected: selectedNodeId === node.id,
    },
  }));
}

export function toBuilderFlowEdges(edges: BuilderEdge[]): BuilderFlowEdge[] {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    label: edge.label,
    data: {
      builderEdge: edge,
    },
  }));
}

export function applyBuilderNodePositions(
  builderNodes: BuilderNode[],
  flowNodes: Node[],
): BuilderNode[] {
  const positionMap = new Map(flowNodes.map((fn) => [fn.id, fn.position]));

  return builderNodes.map((node) => {
    const newPos = positionMap.get(node.id);
    if (!newPos) return node;

    return {
      ...node,
      position: newPos,
    };
  });
}

export function createBuilderEdgeFromConnection(input: {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}): BuilderEdge {
  if (!input.source || !input.target) {
    throw new Error("Cannot create an edge without both a source and a target node.");
  }

  return {
    id: input.id,
    source: input.source,
    target: input.target,
    sourceHandle: input.sourceHandle ?? undefined,
    targetHandle: input.targetHandle ?? undefined,
  };
}
