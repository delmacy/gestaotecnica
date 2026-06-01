import type { BuilderDraft, BuilderEdge, BuilderId, BuilderNode } from "../types";

export type BuilderEditorState = {
  draft: BuilderDraft;
  selectedNodeId?: BuilderId;
  selectedEdgeId?: BuilderId;
  dirty: boolean;
};

export type AddBuilderNodeInput = {
  type: BuilderNode["type"];
  label?: string;
  description?: string;
};

export type BuilderEditorActions = {
  addNode: (input: AddBuilderNodeInput) => void;
  selectNode: (nodeId: BuilderId) => void;
  clearSelection: () => void;
  updateSelectedNode: (patch: Partial<Pick<BuilderNode, "label" | "description" | "config">>) => void;
};
