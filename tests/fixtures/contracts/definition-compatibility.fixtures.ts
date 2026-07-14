import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ProcessVersionSchema } from "../../../src/platform/workflows/contracts/process-definition";

const VALID_ID = "123e4567-e89b-12d3-a456-426614174000";
const VALID_WORKSPACE = "123e4567-e89b-12d3-a456-426614174001";
const VALID_DATE = "2023-10-27T10:00:00Z";

export const baseVersion = {
  id: "123e4567-e89b-12d3-a456-426614174002",
  workspaceId: VALID_WORKSPACE,
  processDefinitionId: VALID_ID,
  version: 1,
  status: "draft" as const,
  createdAt: VALID_DATE,
  updatedAt: VALID_DATE,
  createdById: VALID_ID,
  definition: {
    schemaVersion: "1.0.0",
    nodes: [],
    edges: [],
  }
};

export const COMPATIBLE_PROCESS_VERSION_ADDED_NODE = {
  ...baseVersion,
  definition: {
    schemaVersion: "1.0.0",
    nodes: [
      { id: "n1", key: "node-1", type: "start", name: "n1", position: { x: 0, y: 0 }, config: {} },
      { id: "n2", key: "node-2", type: "action", actionKey: "some-action", name: "n2", position: { x: 100, y: 0 }, config: {} }
    ],
    edges: [
      { id: "e1", sourceNodeId: "n1", targetNodeId: "n2", type: "default", priority: 0 }
    ]
  }
};

export const BREAKING_PROCESS_VERSION_REMOVED_NODE = {
  ...baseVersion,
  definition: {
    schemaVersion: "1.0.0",
    nodes: [],
    edges: []
  }
};

export const BREAKING_PROCESS_VERSION_CHANGED_ACTION = {
  ...baseVersion,
  definition: {
    schemaVersion: "1.0.0",
    nodes: [
      { id: "n1", key: "node-1", type: "start", name: "n1", position: { x: 0, y: 0 }, config: {} },
      { id: "n2", key: "node-2", type: "action", actionKey: "different-action", name: "n2", position: { x: 100, y: 0 }, config: {} }
    ],
    edges: [
      { id: "e1", sourceNodeId: "n1", targetNodeId: "n2", type: "default", priority: 0 }
    ]
  }
};

export const BREAKING_PROCESS_VERSION_CHANGED_PAYLOAD = {
  ...baseVersion,
  definition: {
    schemaVersion: "1.0.0",
    nodes: [
      { id: "n1", key: "node-1", type: "start", name: "n1", position: { x: 0, y: 0 }, config: { newRequiredField: true } }
    ],
    edges: []
  }
};

describe("Definition Compatibility Fixtures", () => {
  test("Compatible fixture passes", () => {
    const valid = {
      ...baseVersion,
      definition: {
        schemaVersion: "1.0.0",
        nodes: [{ id: "n1", key: "node-1", type: "start", name: "n1", position: { x: 0, y: 0 }, config: {} }],
        edges: []
      }
    };
    assert.doesNotThrow(() => ProcessVersionSchema.parse(valid));
    assert.doesNotThrow(() => ProcessVersionSchema.parse(COMPATIBLE_PROCESS_VERSION_ADDED_NODE));
    assert.doesNotThrow(() => ProcessVersionSchema.parse(BREAKING_PROCESS_VERSION_REMOVED_NODE));
    assert.doesNotThrow(() => ProcessVersionSchema.parse(BREAKING_PROCESS_VERSION_CHANGED_ACTION));
    assert.doesNotThrow(() => ProcessVersionSchema.parse(BREAKING_PROCESS_VERSION_CHANGED_PAYLOAD));
  });

  test("Incompatible fixture fails with clear assertion", () => {
    const invalid = {
      ...baseVersion,
      definition: {
        schemaVersion: "1.0.0",
        nodes: [{ id: "n1", key: "node-1", type: "INVALID_TYPE", name: "n1", position: { x: 0, y: 0 }, config: {} }],
        edges: []
      }
    };

    // We expect a Zod validation error because INVALID_TYPE is not in ProcessNodeTypeSchema
    assert.throws(
      () => ProcessVersionSchema.parse(invalid),
      (err: Error & { issues?: { path: string[] }[] }) => {
        return err.issues && err.issues.some((i) => i.path.includes("type"));
      }
    );
  });
});
