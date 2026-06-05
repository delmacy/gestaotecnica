import type { BuilderDraft, BuilderEdge, BuilderId, BuilderNode } from "../types";

export type BuilderEditorState = {
  draft: BuilderDraft;
  selectedNodeId?: BuilderId;
  selectedEdgeId?: BuilderId;
  dirty: boolean;
  localPersistence?: {
    restored: boolean;
    lastSavedAt?: string;
    message?: string;
  };
  officialPersistence?: {
    processDefinitionId?: string;
    latestVersionId?: string;
    lastSavedAt?: string;
    status: "idle" | "saving" | "saved" | "error";
    loadStatus?: "idle" | "loading" | "loaded" | "error";
    publicationStatus?: "idle" | "publishing" | "published" | "error";
    publishedAt?: string;
    message?: string;
  };
  mode: "builder" | "preview";
  preview?: {
    activeNodeId?: BuilderId;
    completedNodeIds: BuilderId[];
  };
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
  updateNodePositions: (nodes: BuilderNode[]) => void;
  addEdge: (edge: BuilderEdge) => void;
  renameDraft: (input: { name: string; description?: string }) => void;
  resetDraft: () => void;
  replaceDraft: (draft: BuilderDraft) => void;
  markClean: () => void;
  setLocalPersistenceStatus: (input: {
    restored?: boolean;
    lastSavedAt?: string;
    message?: string;
  }) => void;
  setOfficialPersistenceStatus: (input: {
    processDefinitionId?: string;
    latestVersionId?: string;
    lastSavedAt?: string;
    status?: "idle" | "saving" | "saved" | "error";
      loadStatus?: "idle" | "loading" | "loaded" | "error";
    publicationStatus?: "idle" | "publishing" | "published" | "error";
    publishedAt?: string;
    message?: string;
  }) => void;
  setOfficialLoadedProcess: (input: {
    draft: BuilderDraft;
    processDefinitionId: string;
    latestVersionId?: string;
    message?: string;
  }) => void;
  setMode: (mode: "builder" | "preview") => void;
  setPreviewActiveNode: (nodeId?: BuilderId) => void;
  completePreviewStep: (nodeId: BuilderId) => void;
  resetPreview: () => void;
};
