import type { Edge, Node } from "@xyflow/react";
import type { BuilderEdge, BuilderNode } from "../types";

export type BuilderFlowNodeData = {
  builderNode: BuilderNode;
  selected?: boolean;
};

export type BuilderFlowEdgeData = {
  builderEdge: BuilderEdge;
};

export type BuilderFlowNode = Node<BuilderFlowNodeData, "builderNode">;
export type BuilderFlowEdge = Edge<BuilderFlowEdgeData>;
