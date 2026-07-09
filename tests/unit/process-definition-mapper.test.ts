import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createProcessKeyFromName } from "../../src/features/workflow/definitions/process-definition.mapper";
import { ProcessDefinitionKeySchema } from "../../src/platform/workflows/contracts/process-definition-key";

describe("createProcessKeyFromName", () => {
  test("generates valid key for normal name", () => {
    const key = createProcessKeyFromName("Processo de Aprovação de Documentos");
    assert.strictEqual(key, "processo-de-aprovacao-de-documentos");
    assert.doesNotThrow(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("generates valid key for name with numbers at the start", () => {
    const key = createProcessKeyFromName("123 Process");
    assert.strictEqual(key, "p-123-process");
    assert.doesNotThrow(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("generates valid key for name consisting only of numbers", () => {
    const key = createProcessKeyFromName("123");
    assert.strictEqual(key, "p-123");
    assert.doesNotThrow(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("generates valid key for empty string", () => {
    const key = createProcessKeyFromName("");
    assert.strictEqual(key, "processo");
    assert.doesNotThrow(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("generates valid key for name with only special characters", () => {
    const key = createProcessKeyFromName("!!!");
    assert.strictEqual(key, "processo");
    assert.doesNotThrow(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("generates valid key for single character", () => {
    const key = createProcessKeyFromName("a");
    assert.strictEqual(key, "a00");
    assert.doesNotThrow(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("generates valid key for name longer than 100 characters", () => {
    const longName = "This is a very long process name that exceeds the maximum length of one hundred characters and therefore should be truncated properly without trailing hyphens";
    const key = createProcessKeyFromName(longName);
    assert.ok(key.length <= 100);
    assert.ok(!key.endsWith("-"));
    assert.doesNotThrow(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("generates valid key for name with multiple consecutive hyphens or spaces", () => {
    const key = createProcessKeyFromName("A   B---C");
    assert.strictEqual(key, "a-b-c");
    assert.doesNotThrow(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("generates valid key for name with spaces", () => {
    const key = createProcessKeyFromName("    ");
    assert.strictEqual(key, "processo");
    assert.doesNotThrow(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("generates valid key for name with leading and trailing hyphens", () => {
    const key = createProcessKeyFromName("---My---Process---");
    assert.strictEqual(key, "my-process");
    assert.doesNotThrow(() => ProcessDefinitionKeySchema.parse(key));
  });
});
