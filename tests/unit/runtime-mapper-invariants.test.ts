import { describe, it } from "node:test";
import assert from "node:assert";
import { mapToProcessInstance, mapToProcessPayload, mapToActionExecution } from "../../src/platform/workflows/runtime/mappers";
import { z } from "zod";

/**
 * Deep freeze helper to ensure immutability during tests.
 */
function deepFreeze<T extends object>(obj: T): T {
  Object.freeze(obj);
  const props = Object.getOwnPropertyNames(obj);
  for (const prop of props) {
    const value = (obj as Record<string, unknown>)[prop];
    if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }
  return obj;
}

describe("Runtime Mapper Invariants", () => {
  const validUUID = "550e8400-e29b-41d4-a716-446655440000";
  const validTimestamp = "2023-10-27T10:00:00Z";

  describe("ProcessInstance Mapper Invariants", () => {
    const validRaw = {
      id: validUUID,
      workspaceId: validUUID,
      processVersionId: validUUID,
      status: "active",
      createdAt: validTimestamp,
      updatedAt: validTimestamp,
      metadata: { original: true }
    };

    it("should prioritize camelCase over snake_case", () => {
      // Note: Precedence test
      const rawWithValidUUIDs = {
        ...validRaw,
        workspaceId: validUUID,
        workspace_id: "00000000-0000-0000-0000-000000000000",
      };
      const result = mapToProcessInstance(rawWithValidUUIDs);
      assert.strictEqual(result.workspaceId, validUUID);
    });

    it("should accept snake_case when camelCase is missing", () => {
      const snakeRaw = {
        id: validUUID,
        workspace_id: validUUID,
        process_version_id: validUUID,
        status: "active",
        created_at: validTimestamp,
        updated_at: validTimestamp,
      };
      const result = mapToProcessInstance(snakeRaw);
      assert.strictEqual(result.workspaceId, validUUID);
      assert.strictEqual(result.processVersionId, validUUID);
    });

    it("should ensure workspaceId and processVersionId are mandatory", () => {
      const { workspaceId: _w, ...missingWs } = validRaw;
      assert.throws(() => mapToProcessInstance(missingWs), z.ZodError);

      const { processVersionId: _p, ...missingPv } = validRaw;
      assert.throws(() => mapToProcessInstance(missingPv), z.ZodError);
    });

    it("should not include definitionId even if present in raw data", () => {
      const rawWithDefinition = {
        ...validRaw,
        definitionId: validUUID,
      };
      const result = mapToProcessInstance(rawWithDefinition) as Record<string, unknown>;
      assert.strictEqual(result.definitionId, undefined);
    });

    it("should not mutate input or its metadata", () => {
      const metadata = { foo: "bar" };
      const raw = deepFreeze({
        ...validRaw,
        metadata
      });
      assert.doesNotThrow(() => mapToProcessInstance(raw));
    });

    it("should merge context.metadata without mutating entries", () => {
      const rawMetadata = { raw: 1 };
      const contextMetadata = { context: 2 };
      const raw = deepFreeze({ ...validRaw, metadata: rawMetadata });
      const context = deepFreeze({ metadata: contextMetadata });

      const result = mapToProcessInstance(raw, context);
      assert.deepStrictEqual(result.metadata, { raw: 1, context: 2 });
      assert.strictEqual(raw.metadata.raw, 1);
      assert.strictEqual(context.metadata.context, 2);
    });
  });

  describe("ProcessPayload Mapper Invariants", () => {
    const validRaw = {
      id: validUUID,
      instanceId: validUUID,
      workspaceId: validUUID,
      schemaVersion: "1.0.0",
      data: { content: "test" },
      createdAt: validTimestamp,
      updatedAt: validTimestamp
    };

    it("should prioritize camelCase over snake_case", () => {
      const mixedRaw = {
        ...validRaw,
        instanceId: validUUID,
        instance_id: "00000000-0000-0000-0000-000000000000",
      };
      const result = mapToProcessPayload(mixedRaw);
      assert.strictEqual(result.instanceId, validUUID);
    });

    it("should preserve data", () => {
      const result = mapToProcessPayload(validRaw);
      assert.deepStrictEqual(result.data, { content: "test" });
    });

    it("should ensure schemaVersion is mandatory", () => {
      const { schemaVersion: _s, ...missingSchema } = validRaw;
      assert.throws(() => mapToProcessPayload(missingSchema), z.ZodError);
    });

    it("should not mutate input", () => {
      const raw = deepFreeze({ ...validRaw, data: { a: 1 } });
      assert.doesNotThrow(() => mapToProcessPayload(raw));
    });
  });

  describe("ActionExecution Mapper Invariants", () => {
    const validRaw = {
      id: validUUID,
      workspaceId: validUUID,
      instanceId: validUUID,
      actionKey: "node-1",
      status: "pending",
      startedAt: validTimestamp,
      correlationId: "corr-1",
      causationId: "caus-1"
    };

    it("should follow precedence actionKey > action_key > node_id", () => {
      const raw1 = { ...validRaw, actionKey: "k1", action_key: "k2", node_id: "k3" };
      assert.strictEqual(mapToActionExecution(raw1).actionKey, "k1");

      const { actionKey: _k1, ...raw2 } = { ...validRaw, action_key: "k2", node_id: "k3" };
      assert.strictEqual(mapToActionExecution(raw2).actionKey, "k2");

      const { actionKey: _k1_2, action_key: _k2_2, ...raw3 } = { ...validRaw, node_id: "k3" };
      assert.strictEqual(mapToActionExecution(raw3).actionKey, "k3");
    });

    it("should prioritize actorId over actor_id", () => {
      const mixedRaw = {
        ...validRaw,
        actorId: validUUID,
        actor_id: "00000000-0000-0000-0000-000000000000",
      };
      const result = mapToActionExecution(mixedRaw);
      assert.strictEqual(result.actorId, validUUID);
    });

    it("should preserve explicit null for actorId", () => {
      const raw = { ...validRaw, actorId: null };
      const result = mapToActionExecution(raw);
      assert.strictEqual(result.actorId, null);

      const { actorId: _a, ...rawSnake } = { ...validRaw, actor_id: null };
      const resultSnake = mapToActionExecution(rawSnake);
      assert.strictEqual(resultSnake.actorId, null);
    });

    it("should ensure correlationId and causationId are mandatory", () => {
      const { correlationId: _corr, ...missingCorr } = validRaw;
      assert.throws(() => mapToActionExecution(missingCorr), z.ZodError);

      const { causationId: _caus, ...missingCaus } = validRaw;
      // PROMPT REQUIREMENT: causationId must be mandatory.
      // If it fails, it will be recorded in the report.
      assert.throws(() => mapToActionExecution(missingCaus), z.ZodError);
    });

    it("should not mutate input or payloads", () => {
      const raw = deepFreeze({
        ...validRaw,
        inputPayload: { in: 1 },
        outputPayload: { out: 2 }
      });
      assert.doesNotThrow(() => mapToActionExecution(raw));
    });
  });

  describe("Negative cases (General)", () => {
    it("should reject invalid status", () => {
      const invalid = {
        id: validUUID,
        workspaceId: validUUID,
        processVersionId: validUUID,
        status: "invalid-status",
        createdAt: validTimestamp,
        updatedAt: validTimestamp
      };
      assert.throws(() => mapToProcessInstance(invalid), z.ZodError);
    });

    it("should reject invalid timestamp", () => {
      const invalid = {
        id: validUUID,
        workspaceId: validUUID,
        processVersionId: validUUID,
        status: "active",
        createdAt: "not-a-date",
        updatedAt: validTimestamp
      };
      assert.throws(() => mapToProcessInstance(invalid), z.ZodError);
    });

    it("should reject payload data if not a record (ProcessPayload)", () => {
      const invalid = {
        id: validUUID,
        instanceId: validUUID,
        workspaceId: validUUID,
        schemaVersion: "1.0.0",
        data: "not-a-record",
        createdAt: validTimestamp,
        updatedAt: validTimestamp
      };
      assert.throws(() => mapToProcessPayload(invalid), z.ZodError);
    });
  });
});
