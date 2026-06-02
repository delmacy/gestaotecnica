import type { BuilderDraft, BuilderEdge, BuilderId, BuilderNode } from "../types";

export type PreviewMode = "builder" | "preview";

export type PreviewStepStatus = "not_started" | "active" | "completed" | "blocked";

export type PreviewStep = {
  node: BuilderNode;
  incomingEdges: BuilderEdge[];
  outgoingEdges: BuilderEdge[];
  status: PreviewStepStatus;
};

export type PreviewFlowModel = {
  draft: BuilderDraft;
  steps: PreviewStep[];
  startNode?: BuilderNode;
  endNodes: BuilderNode[];
  orphanNodes: BuilderNode[];
};
