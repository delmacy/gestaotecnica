import { BuilderDraft } from "../../../src/features/builder/types/builder-draft.types";

export const VALID_MINIMAL_DRAFT: BuilderDraft = {
  name: "Minimal Draft",
  status: "draft",
  nodes: [],
  edges: []
};

export const VALID_FULL_DRAFT: BuilderDraft = {
  id: "draft-123",
  workspaceId: "workspace-456",
  name: "Full Draft",
  description: "A fully populated draft",
  status: "published",
  version: 1,
  nodes: [
    {
      id: "node-1",
      type: "start",
      label: "Start Node",
      position: { x: 0, y: 0 },
      config: {}
    }
  ],
  edges: [
    {
      id: "edge-1",
      source: "node-1",
      target: "node-2"
    }
  ],
  metadata: {
    author: "Jane Doe"
  },
  payload: {
    key: "value"
  },
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-02T00:00:00Z",
  conflictMetadata: {
    revision: 1,
    updatedAt: "2024-01-02T00:00:00Z",
    versionToken: "token-abc"
  }
};

export const INVALID_DRAFT_MISSING_NAME = {
  name: "", // Invalid because min length is 1
  status: "draft",
  nodes: [],
  edges: []
} as unknown as BuilderDraft;

export const INVALID_DRAFT_ARRAY_PAYLOAD = {
  name: "Invalid Payload Draft",
  status: "draft",
  nodes: [],
  edges: [],
  payload: [] // Invalid because payload must be an object
} as unknown as BuilderDraft;
