import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ProcessDefinitionKeySchema } from "../../src/platform/workflows/contracts/process-definition-key";
import { ProcessDefinitionSchema } from "../../src/platform/workflows/contracts/process-definition";
import { ProcessNodeSchema } from "../../src/platform/workflows/contracts/process-node-edge";

describe("ProcessDefinitionKeyContract", () => {
  test("valid key: minimum length (3)", () => {
    const key = "abc";
    assert.doesNotThrow(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("valid key: common", () => {
    const key = "my-process-123";
    assert.doesNotThrow(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("valid key: with numbers", () => {
    const key = "process123";
    assert.doesNotThrow(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("invalid key: uppercase rejected", () => {
    const key = "MyProcess";
    assert.throws(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("invalid key: underscore rejected", () => {
    const key = "my_process";
    assert.throws(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("invalid key: space rejected", () => {
    const key = "my process";
    assert.throws(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("invalid key: hyphen initial rejected", () => {
    const key = "-my-process";
    assert.throws(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("invalid key: hyphen final rejected", () => {
    const key = "my-process-";
    assert.throws(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("invalid key: consecutive hyphens rejected", () => {
    const key = "my--process";
    assert.throws(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("invalid key: less than 3 characters rejected", () => {
    const key = "ab";
    assert.throws(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("invalid key: more than 100 characters rejected", () => {
    const key = "a".repeat(101);
    assert.throws(() => ProcessDefinitionKeySchema.parse(key));
  });

  test("ProcessDefinitionSchema continues using the contract", () => {
    const validData = {
      id: "def-1",
      workspaceId: "00000000-0000-0000-0000-000000000000",
      key: "valid-key",
      name: "Process Name",
      status: "draft",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
      createdById: "user-1",
    };
    assert.doesNotThrow(() => ProcessDefinitionSchema.parse(validData));

    const invalidData = { ...validData, key: "Invalid Key" };
    assert.throws(() => ProcessDefinitionSchema.parse(invalidData));
  });

  test("ProcessNodeSchema continues using the contract", () => {
    const validNode = {
      id: "node-1",
      key: "node-key",
      type: "start",
      name: "Start Node",
      position: { x: 0, y: 0 },
      config: {},
    };
    assert.doesNotThrow(() => ProcessNodeSchema.parse(validNode));

    const invalidNode = { ...validNode, key: "Invalid Key" };
    assert.throws(() => ProcessNodeSchema.parse(invalidNode));
  });

  test("subprocessDefinitionKey continues using the contract", () => {
    const validSubprocessNode = {
      id: "node-2",
      key: "subprocess-node",
      type: "subprocess",
      name: "Subprocess",
      position: { x: 100, y: 100 },
      config: {},
      subprocessDefinitionKey: "child-process",
    };
    assert.doesNotThrow(() => ProcessNodeSchema.parse(validSubprocessNode));

    const invalidSubprocessNode = {
      ...validSubprocessNode,
      subprocessDefinitionKey: "Invalid Key",
    };
    assert.throws(() => ProcessNodeSchema.parse(invalidSubprocessNode));
  });

  test("joint import does not fail (circularity check)", async () => {
    const defPromise = import("../../src/platform/workflows/contracts/process-definition");
    const nodePromise = import("../../src/platform/workflows/contracts/process-node-edge");

    await assert.doesNotReject(Promise.all([defPromise, nodePromise]));
  });

  test("exports publically available through index", async () => {
    const index = await import("../../src/platform/workflows/contracts/index");
    assert.ok(index.ProcessDefinitionKeySchema);
  });
});
