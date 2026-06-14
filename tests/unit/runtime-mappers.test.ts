import { describe, it } from "node:test";
import assert from "node:assert";
import { mapToProcessInstance, mapToProcessPayload, mapToActionExecution } from "../../src/platform/workflows/runtime/mappers";
import { z } from "zod";

describe("Runtime Mappers", () => {
  const validWorkspaceId = "550e8400-e29b-41d4-a716-446655440000";
  const validId = "550e8400-e29b-41d4-a716-446655440001";
  const validTimestamp = "2023-10-27T10:00:00Z";

  describe("ProcessInstance Mapper", () => {
    const validRaw = {
      id: validId,
      workspaceId: validWorkspaceId,
      processVersionId: "550e8400-e29b-41d4-a716-446655440002",
      definitionId: "def-123",
      definitionVersion: "1.0.0",
      status: "active",
      createdById: "550e8400-e29b-41d4-a716-446655440003",
      createdAt: validTimestamp,
      updatedAt: validTimestamp,
      metadata: { foo: "bar" },
    };

    it("should map a valid minimal payload", () => {
      const minimal = {
        ...validRaw,
        createdById: null,
      };
      delete (minimal as any).metadata;
      delete (minimal as any).definitionVersion;

      const result = mapToProcessInstance(minimal);
      assert.strictEqual(result.id, validId);
      assert.strictEqual(result.status, "active");
    });

    it("should map from snake_case", () => {
      const snakeRaw = {
        id: validId,
        workspace_id: validWorkspaceId,
        process_version_id: "550e8400-e29b-41d4-a716-446655440002",
        definition_id: "def-123",
        status: "active",
        created_at: validTimestamp,
        updated_at: validTimestamp,
      };
      const result = mapToProcessInstance(snakeRaw);
      assert.strictEqual(result.workspaceId, validWorkspaceId);
      assert.strictEqual(result.definitionId, "def-123");
    });

    it("should map a valid complete payload", () => {
      const result = mapToProcessInstance(validRaw);
      // Compare specific fields because deepStrictEqual might be sensitive to undefined vs missing keys
      assert.strictEqual(result.id, validRaw.id);
      assert.strictEqual(result.workspaceId, validRaw.workspaceId);
      assert.strictEqual(result.definitionId, validRaw.definitionId);
      assert.deepStrictEqual(result.metadata, validRaw.metadata);
    });

    it("should reject payload with missing mandatory field", () => {
      const invalid = { ...validRaw };
      delete (invalid as any).workspaceId;
      assert.throws(() => mapToProcessInstance(invalid), z.ZodError);
    });

    it("should enrich metadata if provided in context", () => {
      const context = { metadata: { extra: "data" } };
      const result = mapToProcessInstance(validRaw, context);
      assert.deepStrictEqual(result.metadata, { foo: "bar", extra: "data" });
    });
  });

  describe("ActionExecution Mapper", () => {
    const validRaw = {
      id: validId,
      workspaceId: validWorkspaceId,
      instanceId: "550e8400-e29b-41d4-a716-446655440002",
      actionKey: "node_1",
      actorId: "550e8400-e29b-41d4-a716-446655440003",
      status: "completed",
      startedAt: validTimestamp,
      finishedAt: validTimestamp,
      correlationId: "corr-1",
      causationId: "caus-1",
    };

    it("should map from snake_case and node_id", () => {
      const snakeRaw = {
        id: validId,
        workspace_id: validWorkspaceId,
        instance_id: "550e8400-e29b-41d4-a716-446655440002",
        node_id: "node_1",
        actor_id: "550e8400-e29b-41d4-a716-446655440003",
        status: "completed",
        started_at: validTimestamp,
        correlation_id: "corr-1",
        causation_id: "caus-1",
      };
      const result = mapToActionExecution(snakeRaw);
      assert.strictEqual(result.workspaceId, validWorkspaceId);
      assert.strictEqual(result.actionKey, "node_1");
    });

    it("should handle error as string or object", () => {
      const withStringError = { ...validRaw, status: "failed", error: "Something went wrong" };
      const withObjectError = { ...validRaw, status: "failed", error: { code: "ERR_1", msg: "Oops" } };

      assert.strictEqual(mapToActionExecution(withStringError).error, "Something went wrong");
      assert.deepStrictEqual(mapToActionExecution(withObjectError).error, { code: "ERR_1", msg: "Oops" });
    });
  });
});
