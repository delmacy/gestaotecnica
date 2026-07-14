import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { WorkflowDefinitionVersionSchema } from "../workflow-definition-version";

describe("WorkflowDefinitionVersionSchema", () => {
  test("should accept valid major.minor.patch versions", () => {
    const validInputs = ["1.0.0", "0.1.0", "2.10.3", "100.200.300", "0.0.0"];

    for (const input of validInputs) {
      const result = WorkflowDefinitionVersionSchema.safeParse(input);
      assert.equal(result.success, true, `Expected ${input} to be valid`);
      if (result.success) {
        assert.equal(result.data, input);
      }
    }
  });

  test("should reject invalid versions", () => {
    const invalidInputs = [
      "1",
      "1.0",
      "v1.0.0",
      "1.0.0-beta",
      "1.a.0",
      "",
      " ",
      null,
      undefined,
      123,
    ];

    for (const input of invalidInputs) {
      const result = WorkflowDefinitionVersionSchema.safeParse(input);
      assert.equal(result.success, false, `Expected ${input} to be invalid`);
    }
  });
});
