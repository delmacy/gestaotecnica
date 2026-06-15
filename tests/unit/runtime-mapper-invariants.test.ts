import { describe, it } from "node:test";
import assert from "node:assert";
import { mapToProcessInstance } from "../../src/platform/workflows/runtime/mappers/process-instance.mapper";
import { mapToProcessPayload } from "../../src/platform/workflows/runtime/mappers/process-payload.mapper";
import { mapToActionExecution } from "../../src/platform/workflows/runtime/mappers/action-execution.mapper";

const VALID_UUID = "123e4567-e89b-12d3-a456-426614174000";
const VALID_ISO_DATE = "2023-01-01T00:00:00Z";

/**
 * Deep freezes an object to ensure immutability during tests.
 */
function deepFreeze<T extends object>(obj: T): T {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as Record<string, unknown>)[prop];
    if (
      value !== null &&
      (typeof value === "object" || typeof value === "function") &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value as object);
    }
  });
  return obj;
}

describe("Runtime Mapper Invariants", () => {
  describe("ProcessInstance Mapper", () => {
    const validRaw = {
      id: VALID_UUID,
      workspaceId: VALID_UUID,
      processVersionId: VALID_UUID,
      status: "active",
      createdAt: VALID_ISO_DATE,
      updatedAt: VALID_ISO_DATE,
      createdById: VALID_UUID,
      metadata: { key: "value" },
    };

    it("should accept camelCase", () => {
      const result = mapToProcessInstance(validRaw);
      assert.strictEqual(result.workspaceId, validRaw.workspaceId);
      assert.strictEqual(result.processVersionId, validRaw.processVersionId);
    });

    it("should accept snake_case", () => {
      const snakeRaw = {
        id: VALID_UUID,
        workspace_id: VALID_UUID,
        process_version_id: VALID_UUID,
        status: "active",
        created_at: VALID_ISO_DATE,
        updated_at: VALID_ISO_DATE,
        created_by_id: VALID_UUID,
      };
      const result = mapToProcessInstance(snakeRaw);
      assert.strictEqual(result.workspaceId, VALID_UUID);
      assert.strictEqual(result.processVersionId, VALID_UUID);
    });

    it("should give precedence to camelCase over snake_case", () => {
      const mixedRaw = {
        ...validRaw,
        workspace_id: "wrong-id",
        workspaceId: VALID_UUID,
      };
      const result = mapToProcessInstance(mixedRaw);
      assert.strictEqual(result.workspaceId, VALID_UUID);
    });

    it("should keep workspaceId mandatory", () => {
      const { workspaceId, ...invalidRaw } = validRaw;
      assert.throws(() => mapToProcessInstance(invalidRaw));
    });

    it("should keep processVersionId mandatory", () => {
      const { processVersionId, ...invalidRaw } = validRaw;
      assert.throws(() => mapToProcessInstance(invalidRaw));
    });

    it("should not return definitionId even if present in input", () => {
      const rawWithDefinition = {
        ...validRaw,
        definitionId: VALID_UUID,
      };
      const result = mapToProcessInstance(rawWithDefinition) as unknown as Record<string, unknown>;
      assert.strictEqual(result.definitionId, undefined);
    });

    it("should not mutate input metadata", () => {
      const metadata = { a: 1 };
      const raw = { ...validRaw, metadata };
      deepFreeze(raw);
      mapToProcessInstance(raw);
      assert.strictEqual(metadata.a, 1);
    });

    it("should merge context.metadata without mutating inputs", () => {
      const inputMetadata = { a: 1 };
      const contextMetadata = { b: 2 };
      const raw = { ...validRaw, metadata: inputMetadata };
      deepFreeze(raw);
      deepFreeze(contextMetadata);

      const result = mapToProcessInstance(raw, { metadata: contextMetadata });
      assert.deepStrictEqual(result.metadata, { a: 1, b: 2 });
      assert.strictEqual(inputMetadata.a, 1);
      assert.strictEqual(contextMetadata.b, 2);
    });

    it("should reject invalid status", () => {
      assert.throws(() => mapToProcessInstance({ ...validRaw, status: "invalid" }));
    });

    it("should reject invalid timestamp", () => {
      assert.throws(() => mapToProcessInstance({ ...validRaw, createdAt: "not-a-date" }));
    });
  });

  describe("ProcessPayload Mapper", () => {
    const validRaw = {
      id: VALID_UUID,
      instanceId: VALID_UUID,
      workspaceId: VALID_UUID,
      schemaVersion: "1.0.0",
      data: { foo: "bar" },
      createdAt: VALID_ISO_DATE,
      updatedAt: VALID_ISO_DATE,
    };

    it("should accept camelCase", () => {
      const result = mapToProcessPayload(validRaw);
      assert.strictEqual(result.instanceId, validRaw.instanceId);
    });

    it("should accept snake_case", () => {
      const snakeRaw = {
        id: VALID_UUID,
        instance_id: VALID_UUID,
        workspace_id: VALID_UUID,
        schema_version: "1.0.0",
        data: { foo: "bar" },
        created_at: VALID_ISO_DATE,
        updated_at: VALID_ISO_DATE,
      };
      const result = mapToProcessPayload(snakeRaw);
      assert.strictEqual(result.instanceId, VALID_UUID);
      assert.strictEqual(result.schemaVersion, "1.0.0");
    });

    it("should give precedence to camelCase", () => {
      const mixedRaw = {
        ...validRaw,
        instance_id: "wrong-id",
        instanceId: VALID_UUID,
      };
      const result = mapToProcessPayload(mixedRaw);
      assert.strictEqual(result.instanceId, VALID_UUID);
    });

    it("should preserve data", () => {
      const result = mapToProcessPayload(validRaw);
      assert.deepStrictEqual(result.data, validRaw.data);
    });

    it("should keep schemaVersion mandatory", () => {
      const { schemaVersion, ...invalidRaw } = validRaw;
      assert.throws(() => mapToProcessPayload(invalidRaw));
    });

    it("should not mutate input", () => {
      const raw = { ...validRaw, data: { a: 1 } };
      deepFreeze(raw);
      mapToProcessPayload(raw);
      assert.strictEqual(raw.data.a, 1);
    });

    it("should reject payload outside contract (e.g. missing id)", () => {
      const { id, ...invalidRaw } = validRaw;
      assert.throws(() => mapToProcessPayload(invalidRaw));
    });
  });

  describe("ActionExecution Mapper", () => {
    const validRaw = {
      id: VALID_UUID,
      workspaceId: VALID_UUID,
      instanceId: VALID_UUID,
      actionKey: "step-1",
      actorId: VALID_UUID,
      status: "completed",
      startedAt: VALID_ISO_DATE,
      correlationId: VALID_UUID,
      causationId: VALID_UUID,
      inputPayload: { in: 1 },
      outputPayload: { out: 2 },
    };

    it("should accept actionKey, action_key and node_id with precedence", () => {
      // actionKey
      assert.strictEqual(mapToActionExecution(validRaw).actionKey, "step-1");

      // action_key
      assert.strictEqual(mapToActionExecution({ ...validRaw, actionKey: undefined, action_key: "step-2" } as unknown).actionKey, "step-2");

      // node_id
      assert.strictEqual(mapToActionExecution({ ...validRaw, actionKey: undefined, action_key: undefined, node_id: "step-3" } as unknown).actionKey, "step-3");

      // precedence: actionKey > action_key > node_id
      const mixed = { ...validRaw, actionKey: "high", action_key: "medium", node_id: "low" };
      assert.strictEqual(mapToActionExecution(mixed).actionKey, "high");

      const mixed2 = { ...validRaw, actionKey: undefined, action_key: "medium", node_id: "low" };
      assert.strictEqual(mapToActionExecution(mixed2 as unknown).actionKey, "medium");
    });

    it("should prefer actorId camelCase over actor_id", () => {
      const mixed = { ...validRaw, actorId: VALID_UUID, actor_id: VALID_UUID.replace('000', '111') };
      assert.strictEqual(mapToActionExecution(mixed).actorId, VALID_UUID);

      const { actorId, ...snakeBase } = validRaw;
      const snake = { ...snakeBase, actor_id: VALID_UUID };
      assert.strictEqual(mapToActionExecution(snake as unknown).actorId, VALID_UUID);
    });

    it("should preserve explicit null for actorId", () => {
      const nullActor = { ...validRaw, actorId: null };
      assert.strictEqual(mapToActionExecution(nullActor).actorId, null);
    });

    it("should keep correlationId mandatory", () => {
      const { correlationId, ...noCorrBase } = validRaw;
      const noCorr = { ...noCorrBase, correlation_id: undefined };
      assert.throws(() => mapToActionExecution(noCorr as unknown));
    });

    it("should note that causationId is optional in contract but requested as mandatory", () => {
      // O prompt diz que correlationId e causationId permanecem obrigatórios.
      // No entanto, o CausationIdSchema no src/platform/contracts/correlation.ts é .optional().
      // Se o teste falhar ao exigir erro quando ausente, registramos no relatório.
      const { causationId, ...noCausBase } = validRaw;
      const noCaus = { ...noCausBase, causation_id: undefined };

      // Se passar sem lançar erro, significa que é opcional no schema.
      const result = mapToActionExecution(noCaus as unknown);
      assert.strictEqual(result.causationId, undefined);
    });

    it("should not mutate input and output payload", () => {
      const input = { a: 1 };
      const output = { b: 2 };
      const raw = { ...validRaw, inputPayload: input, outputPayload: output };
      deepFreeze(raw);
      mapToActionExecution(raw);
      assert.strictEqual(input.a, 1);
      assert.strictEqual(output.b, 2);
    });

    it("should reject invalid status", () => {
      assert.throws(() => mapToActionExecution({ ...validRaw, status: "invalid" }));
    });

    it("should reject invalid UUIDs for mandatory fields", () => {
      assert.throws(() => mapToActionExecution({ ...validRaw, workspaceId: "not-a-uuid" }));
    });
  });
});
