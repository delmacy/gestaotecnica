import test from "node:test";
import assert from "node:assert";
import { DefinitionRuntimeReadinessResultSchema } from "@/platform/workflows/contracts/definition-runtime-readiness-result";
import {
  VALID_DEFINITION_RUNTIME_READINESS_RESULT,
  INVALID_DEFINITION_RUNTIME_READINESS_RESULT_MISSING_READY,
  INVALID_DEFINITION_RUNTIME_READINESS_RESULT_MISSING_ACTIONS,
  INVALID_DEFINITION_RUNTIME_READINESS_RESULT_MISSING_NODES,
  INVALID_DEFINITION_RUNTIME_READINESS_RESULT_MISSING_BLOCKERS
} from "../../../../fixtures/platform/workflows/definition-runtime-readiness-result.fixtures";

test("DefinitionRuntimeReadinessResultSchema", async (t) => {
  await t.test("should parse valid result", () => {
    const result = DefinitionRuntimeReadinessResultSchema.safeParse(VALID_DEFINITION_RUNTIME_READINESS_RESULT);
    assert.strictEqual(result.success, true);
  });

  await t.test("should reject missing ready flag", () => {
    const result = DefinitionRuntimeReadinessResultSchema.safeParse(INVALID_DEFINITION_RUNTIME_READINESS_RESULT_MISSING_READY);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, "MISSING_READY_FLAG");
    }
  });

  await t.test("should reject missing missingActions", () => {
    const result = DefinitionRuntimeReadinessResultSchema.safeParse(INVALID_DEFINITION_RUNTIME_READINESS_RESULT_MISSING_ACTIONS);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, "MISSING_MISSING_ACTIONS");
    }
  });

  await t.test("should reject missing invalidNodes", () => {
    const result = DefinitionRuntimeReadinessResultSchema.safeParse(INVALID_DEFINITION_RUNTIME_READINESS_RESULT_MISSING_NODES);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, "MISSING_INVALID_NODES");
    }
  });

  await t.test("should reject missing versionBlockers", () => {
    const result = DefinitionRuntimeReadinessResultSchema.safeParse(INVALID_DEFINITION_RUNTIME_READINESS_RESULT_MISSING_BLOCKERS);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].message, "MISSING_VERSION_BLOCKERS");
    }
  });
});
