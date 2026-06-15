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

      const result = mapToProcessInstance(minimal);
      assert.strictEqual(result.id, validId);
      assert.strictEqual(result.status, "active");
    });

    it("should map from snake_case", () => {
      const snakeRaw = {
        id: validId,
        workspace_id: validWorkspaceId,
        process_version_id: "550e8400-e29b-41d4-a716-446655440002",
        status: "active",
        created_at: validTimestamp,
        updated_at: validTimestamp,
      };
      const result = mapToProcessInstance(snakeRaw);
      assert.strictEqual(result.workspaceId, validWorkspaceId);
    });

    it("should map a valid complete payload", () => {
      const result = mapToProcessInstance(validRaw);
      assert.strictEqual(result.id, validRaw.id);
      assert.strictEqual(result.workspaceId, validRaw.workspaceId);
      assert.deepStrictEqual(result.metadata, validRaw.metadata);
    });

    it("should reject payload with missing mandatory field", () => {
      const invalid = { ...validRaw };
      delete (invalid as any).workspaceId;
      assert.throws(() => mapToProcessInstance(invalid), z.ZodError);
    });

    it("should reject payload with invalid format (UUID)", () => {
      const invalid = { ...validRaw, workspaceId: "invalid-uuid" };
      assert.throws(() => mapToProcessInstance(invalid), z.ZodError);
    });

    it("should enrich metadata if provided in context", () => {
      const context = { metadata: { extra: "data" } };
      const result = mapToProcessInstance(validRaw, context);
      assert.deepStrictEqual(result.metadata, { foo: "bar", extra: "data" });
    });

    it("should be deterministic", () => {
      const res1 = mapToProcessInstance(validRaw);
      const res2 = mapToProcessInstance(validRaw);
      assert.deepStrictEqual(res1, res2);
    });

    it("should not mutate input object", () => {
      const input = { ...validRaw, metadata: { a: 1 } };
      const inputClone = JSON.parse(JSON.stringify(input));
      mapToProcessInstance(input);
      assert.deepStrictEqual(input, inputClone);
    });

    it("should handle frozen input", () => {
      const frozen = Object.freeze({ ...validRaw });
      assert.doesNotThrow(() => mapToProcessInstance(frozen));
    });
  });

  describe("ProcessPayload Mapper", () => {
    const validRaw = {
      id: validId,
      instanceId: "550e8400-e29b-41d4-a716-446655440002",
      workspaceId: validWorkspaceId,
      schemaVersion: "1.0.0",
      data: { key: "value" },
      createdAt: validTimestamp,
      updatedAt: validTimestamp,
    };

    it("should map a valid payload", () => {
      const result = mapToProcessPayload(validRaw);
      assert.strictEqual(result.id, validId);
      assert.deepStrictEqual(result.data, { key: "value" });
    });

    it("should map from snake_case", () => {
      const snakeRaw = {
        id: validId,
        instance_id: "550e8400-e29b-41d4-a716-446655440002",
        workspace_id: validWorkspaceId,
        schema_version: "1.0.0",
        data: { key: "value" },
        created_at: validTimestamp,
        updated_at: validTimestamp,
      };
      const result = mapToProcessPayload(snakeRaw);
      assert.strictEqual(result.instanceId, snakeRaw.instance_id);
      assert.strictEqual(result.schemaVersion, "1.0.0");
    });

    it("should reject invalid schema version", () => {
      const invalid = { ...validRaw, schemaVersion: "invalid" };
      assert.throws(() => mapToProcessPayload(invalid), z.ZodError);
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

    it("should preserve correlation and causation IDs", () => {
      const result = mapToActionExecution(validRaw);
      assert.strictEqual(result.correlationId, "corr-1");
      assert.strictEqual(result.causationId, "caus-1");
    });
  });
});
