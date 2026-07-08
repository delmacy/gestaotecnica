import { describe, it } from "node:test";
import assert from "node:assert";
import { randomUUID } from "node:crypto";
import { startProcessInstanceInputSchema } from "../../src/features/workflow/runtime/runtime.validation";

describe("workflow-runtime-validation", () => {
  it("should accept valid arbitrary payload objects", () => {
    const validPayload = {
      workspaceId: randomUUID(),
      processVersionId: randomUUID(),
      initialPayload: {
        stringField: "test",
        numberField: 42,
        nestedObject: {
          nestedField: "nestedTest",
          arrayField: [1, 2, 3],
        },
        nullField: null,
      },
    };

    const result = startProcessInstanceInputSchema.safeParse(validPayload);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.deepStrictEqual(result.data.initialPayload, validPayload.initialPayload);
    }
  });

  it("should reject invalid UUIDs for runtime input", () => {
    const invalidPayload = {
      workspaceId: "not-a-uuid",
      processVersionId: randomUUID(),
      initialPayload: {},
    };

    const result = startProcessInstanceInputSchema.safeParse(invalidPayload);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(e => e.path.includes("workspaceId") && e.message.includes("workspaceId deve ser um UUID válido")));
    }
  });
});
