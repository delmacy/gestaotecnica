import { test } from "node:test";
import assert from "node:assert/strict";
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
    mapping: {},
  };

  const result = resolveActionBinding(binding, registry);
  assert.strictEqual(result.success, true);
  assert.deepStrictEqual(result.descriptor, mockDescriptor);
});

test("resolveActionBinding - descriptor not found", () => {
  const registry: DescriptorRegistry = {
    getDescriptor: () => undefined,
  };

  const binding: UtilityAppActionBinding = {
    actionDescriptorKey: "sys.unknown_action",
    mapping: {},
  };

  const result = resolveActionBinding(binding, registry);
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.errors?.[0].code, "DESCRIPTOR_NOT_FOUND");
});

test("resolveActionBinding - descriptor not published", () => {
  const mockDescriptor: ActionDescriptor = {
    key: "sys.draft_action",
    name: "Draft Action",
    handlerKey: "handler",
    status: "draft",
    inputSchema: {},
    outputSchema: {},
  };

  const registry: DescriptorRegistry = {
    getDescriptor: (key) => (key === "sys.draft_action" ? mockDescriptor : undefined),
  };

  const binding: UtilityAppActionBinding = {
    actionDescriptorKey: "sys.draft_action",
    mapping: {},
  };

  const result = resolveActionBinding(binding, registry);
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.errors?.[0].code, "DESCRIPTOR_NOT_PUBLISHED");
});

test("mapInputPayload - maps fields correctly", () => {
  const binding: UtilityAppActionBinding = {
    actionDescriptorKey: "sys.my_action",
    mapping: {
      sourceA: "targetA",
      sourceB: "targetB",
    },
  };

  const payload = {
    sourceA: "valueA",
    unmappedSource: "ignored",
  };

  const result = mapInputPayload(payload, binding);
  assert.deepStrictEqual(result, { targetA: "valueA" });
});

test("mapOutputPayload - maps fields correctly", () => {
  const binding: UtilityAppActionBinding = {
    actionDescriptorKey: "sys.my_action",
    mapping: {
      sourceA: "targetA",
      sourceB: "targetB",
    },
  };

  const payload = {
    targetA: "valueA",
    unmappedTarget: "ignored",
  };

  const result = mapOutputPayload(payload, binding);
  assert.deepStrictEqual(result, { sourceA: "valueA" });
});
