import { test } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import {
  resolveActionBinding,
  mapInputPayload,
  mapOutputPayload,
  DescriptorRegistry,
} from "../../src/platform/utility-apps/adapters/action-descriptor-adapter";
import { ActionDescriptor } from "../../src/platform/actions/contracts/action-descriptor";
import { UtilityAppActionBinding } from "../../src/platform/utility-apps/contracts/utility-app-action-binding";

test("resolveActionBinding - successful resolution", () => {
  const mockDescriptor: ActionDescriptor = {
    key: "sys.my_action",
    name: "My Action",
    handlerKey: "handler",
    status: "published",
    inputSchema: {},
    outputSchema: {},
  };

  const registry: DescriptorRegistry = {
    getDescriptor: (key) => (key === "sys.my_action" ? mockDescriptor : undefined),
  };

  const binding: UtilityAppActionBinding = {
    actionDescriptorKey: "sys.my_action",
    mapping: { "a": "b" },
  };

  const result = resolveActionBinding(binding, registry);
  assert.strictEqual(result.success, true);
  assert.deepStrictEqual(result.descriptor, mockDescriptor);
});

test("resolveActionBinding - duplicate target field", () => {
  const mockDescriptor: ActionDescriptor = {
    key: "sys.my_action",
    name: "My Action",
    handlerKey: "handler",
    status: "published",
    inputSchema: {},
    outputSchema: {},
  };

  const registry: DescriptorRegistry = {
    getDescriptor: (key) => (key === "sys.my_action" ? mockDescriptor : undefined),
  };

  const binding: UtilityAppActionBinding = {
    actionDescriptorKey: "sys.my_action",
    mapping: { "a": "target1", "b": "target1" },
  };

  const result = resolveActionBinding(binding, registry);
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.errors?.[0].code, "DUPLICATE_TARGET_FIELD");
});

test("mapInputPayload - nested paths not supported", () => {
  const binding: UtilityAppActionBinding = {
    actionDescriptorKey: "sys.my_action",
    mapping: { "a.b": "target1" },
  };

  const mockDescriptor: ActionDescriptor = {
    key: "sys.my_action",
    name: "My Action",
    handlerKey: "handler",
    status: "published",
    inputSchema: {},
    outputSchema: {},
  };

  const result = mapInputPayload({}, binding, mockDescriptor);
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.errors?.[0].code, "NESTED_PATHS_NOT_SUPPORTED");
});

test("mapInputPayload - validation failure on required field", () => {
  const binding: UtilityAppActionBinding = {
    actionDescriptorKey: "sys.my_action",
    mapping: { "sourceA": "targetA" },
  };

  const mockDescriptor: ActionDescriptor = {
    key: "sys.my_action",
    name: "My Action",
    handlerKey: "handler",
    status: "published",
    inputSchema: { required: ["targetB"] },
    outputSchema: {},
  };

  const result = mapInputPayload({ "sourceA": "val" }, binding, mockDescriptor);
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.errors?.[0].code, "INPUT_SCHEMA_VALIDATION_FAILED");
});

test("mapInputPayload - validation success with Zod schema", () => {
  const binding: UtilityAppActionBinding = {
    actionDescriptorKey: "sys.my_action",
    mapping: { "sourceA": "targetA" },
  };

  const mockDescriptor: ActionDescriptor = {
    key: "sys.my_action",
    name: "My Action",
    handlerKey: "handler",
    status: "published",
    inputSchema: z.object({ targetA: z.string() }),
    outputSchema: {},
  };

  const result = mapInputPayload({ "sourceA": "val" }, binding, mockDescriptor);
  assert.strictEqual(result.success, true);
  assert.deepStrictEqual(result.payload, { targetA: "val" });
});

test("mapOutputPayload - validation failure with Zod schema", () => {
  const binding: UtilityAppActionBinding = {
    actionDescriptorKey: "sys.my_action",
    mapping: { "targetA": "sourceA" },
  };

  const mockDescriptor: ActionDescriptor = {
    key: "sys.my_action",
    name: "My Action",
    handlerKey: "handler",
    status: "published",
    inputSchema: {},
    outputSchema: z.object({ targetA: z.number() }),
  };

  const result = mapOutputPayload({ "sourceA": "val" }, binding, mockDescriptor);
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.errors?.[0].code, "OUTPUT_SCHEMA_VALIDATION_FAILED");
});
