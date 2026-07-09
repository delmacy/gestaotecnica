import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ProcessVersionSchema } from "../../../src/platform/workflows/contracts/process-definition";

const VALID_ID = "123e4567-e89b-12d3-a456-426614174000";
const VALID_WORKSPACE = "123e4567-e89b-12d3-a456-426614174001";
const VALID_DATE = "2023-10-27T10:00:00Z";

const baseVersion = {
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
