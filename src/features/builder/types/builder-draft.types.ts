export type BuilderDraftId = string;
export type BuilderOwnerId = string;

import type { BuilderId, BuilderMetadata } from "./builder.types";
import type { BuilderEdge, BuilderNode } from "./builder-block.types";

export type BuilderDraftStatus = "draft" | "published" | "archived";

export type BuilderDraft = {
  id?: BuilderDraftId;
  workspaceId?: BuilderOwnerId;
  name: string;
  description?: string;
  status: BuilderDraftStatus;
  version?: number;
  nodes: BuilderNode[];
  edges: BuilderEdge[];
  metadata?: BuilderMetadata;
  createdAt?: string;
  updatedAt?: string;
};

export type SerializedBuilderDraft = {
  schemaVersion: 1;
  draft: BuilderDraft;
};

export type BuilderDraftSummary = {
  id: BuilderDraftId;
  workspaceId?: BuilderOwnerId;
  name: string;
  description?: string;
  status: BuilderDraftStatus;
  version?: number;
  nodeCount: number;
  edgeCount: number;
  updatedAt?: string;
};
