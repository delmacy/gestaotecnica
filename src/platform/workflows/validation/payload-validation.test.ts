import { describe, it } from "node:test";
import assert from "node:assert";
import { validateWorkflowPayload } from "./payload-validation";
import { randomUUID } from "node:crypto";

describe("validateWorkflowPayload", () => {
  const validBasePayload = {
    id: randomUUID(),
    instanceId: randomUUID(),
    workspaceId: randomUUID(),
    schemaVersion: "1.0.0",
    data: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("should accept a valid payload with safe JSON data", () => {
    const payload = {
      ...validBasePayload,
      data: {
        string: "value",
        number: 42,
        boolean: true,
        nested: {
          array: [1, 2, 3],
          nullValue: null,
        },
      },
    };

    const result = validateWorkflowPayload(payload);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.deepStrictEqual(result.data.data, payload.data);
    }
  });

  it("should reject payload with non-JSON values in data", () => {
    const payload = {
      ...validBasePayload,
      data: {
        fn: () => {},
      },
    };

    const result = validateWorkflowPayload(payload);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      const errorStr = result.error.toString();
      assert.ok(errorStr.includes("FUNCTION"));
    }
  });

  it("should reject payload missing required fields", () => {
    const { id, ...incompletePayload } = validBasePayload;

    const result = validateWorkflowPayload(incompletePayload);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      const errorStr = result.error.toString();
      assert.ok(errorStr.includes("Required") || errorStr.includes("id"));
    }
  });

  it("should reject non-object payload", () => {
    const result = validateWorkflowPayload("not-an-object");
    assert.strictEqual(result.success, false);
  });
});
