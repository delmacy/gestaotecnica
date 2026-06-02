import type { BuilderDraft, BuilderId, BuilderNode } from "../types";
import type { PreviewFlowModel, PreviewStepStatus } from "./preview-types";

export function buildPreviewFlowModel(
  draft: BuilderDraft,
  activeNodeId?: BuilderId,
  completedNodeIds: BuilderId[] = [],
): PreviewFlowModel {
  const startNode = draft.nodes.find((n) => n.type === "start");
  const endNodes = draft.nodes.filter((n) => n.type === "end");
  const orphanNodes: BuilderNode[] = [];

  const steps = draft.nodes.map((node) => {
    const incomingEdges = draft.edges.filter((e) => e.target === node.id);
    const outgoingEdges = draft.edges.filter((e) => e.source === node.id);

    let status: PreviewStepStatus = "not_started";
    if (completedNodeIds.includes(node.id)) {
      status = "completed";
    } else if (activeNodeId === node.id) {
      status = "active";
    }

    if (
      incomingEdges.length === 0 &&
      outgoingEdges.length === 0 &&
      node.type !== "start" &&
      node.type !== "end"
    ) {
      orphanNodes.push(node);
    }

    return {
      node,
      incomingEdges,
      outgoingEdges,
      status,
    };
  });

  return {
    draft,
    steps,
    startNode,
    endNodes,
    orphanNodes,
  };
}

export function getNextPreviewNodeId(
  draft: BuilderDraft,
  currentNodeId?: BuilderId,
): BuilderId | undefined {
  if (!currentNodeId) {
    const startNode = draft.nodes.find((n) => n.type === "start");
    return startNode?.id ?? draft.nodes[0]?.id;
  }

  const outgoingEdge = draft.edges.find((e) => e.source === currentNodeId);
  return outgoingEdge?.target;
}

export function getPreviousPreviewNodeId(
  draft: BuilderDraft,
  currentNodeId?: BuilderId,
): BuilderId | undefined {
  if (!currentNodeId) return undefined;

  const incomingEdge = draft.edges.find((e) => e.target === currentNodeId);
  return incomingEdge?.source;
}
