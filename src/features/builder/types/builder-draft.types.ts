import type { BuilderId, BuilderMetadata } from "./builder.types";
import type { BuilderEdge, BuilderNode } from "./builder-block.types";

export type BuilderDraftStatus = "draft" | "published" | "archived";

export type BuilderDraftId = string;
export type BuilderOwnerId = string;

/**
 * Optimistic conflict metadata used for concurrency control
 * to avoid overwriting changes when multiple actors are editing a draft.
 */
export type BuilderDraftConflictMetadata = {
  revision: number;
  updatedAt: string;
  versionToken?: string;
};

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
  payload?: unknown;
  createdAt?: string;
  updatedAt?: string;
  conflictMetadata?: BuilderDraftConflictMetadata;
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
  conflictMetadata?: BuilderDraftConflictMetadata;
};
