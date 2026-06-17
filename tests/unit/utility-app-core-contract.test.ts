import { test } from "node:test";
import assert from "node:assert/strict";
import { UtilityAppDefinitionSchema, UtilityAppCategorySchema, UtilityAppStatusSchema, UtilityAppKeySchema, CapabilityKeySchema } from "../../src/platform/utility-apps/contracts/utility-app";

const validBase = {
  id: "utility-123",
  workspaceId: "550e8400-e29b-41d4-a716-446655440000",
  key: "my-utility-app",
  name: "My Utility App",
  category: "calculation",
  status: "draft",
  version: 1,
  inputSchema: { type: "object" },
  outputSchema: { type: "object" },
  configuration: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdById: "user-123",
};

test("UtilityAppDefinitionSchema - valid minimal definition", () => {
  const result = UtilityAppDefinitionSchema.safeParse(validBase);
  assert.ok(result.success, "Should be valid");
});

test("UtilityAppDefinitionSchema - valid complete definition", () => {
  const complete = {
    ...validBase,
    description: "A useful utility app",
    capabilityKeys: ["cap-1", "cap-2"],
    tags: ["tag1", "tag2"],
  };
  const result = UtilityAppDefinitionSchema.safeParse(complete);
  assert.ok(result.success, "Should be valid");
});

test("UtilityAppCategorySchema - all valid categories", () => {
  const categories = [
    "lookup",
    "calculation",
    "decision_table",
    "mapping",
    "reference_catalog",
    "diagnostic",
    "checklist",
    "comparison",
  ];
  for (const category of categories) {
    assert.ok(UtilityAppCategorySchema.safeParse(category).success, `Category ${category} should be valid`);
  }
});

test("UtilityAppCategorySchema - invalid category", () => {
  const result = UtilityAppCategorySchema.safeParse("other");
  assert.strictEqual(result.success, false, "Category 'other' should be invalid");
});

test("UtilityAppStatusSchema - all valid statuses", () => {
  const statuses = ["draft", "published", "archived"];
  for (const status of statuses) {
    assert.ok(UtilityAppStatusSchema.safeParse(status).success, `Status ${status} should be valid`);
  }
});

test("UtilityAppStatusSchema - invalid status", () => {
  const result = UtilityAppStatusSchema.safeParse("active");
  assert.strictEqual(result.success, false, "Status 'active' should be invalid");
});

test("UtilityAppKeySchema - valid keys", () => {
  const validKeys = ["my-app", "app123", "a-b-c"];
  for (const key of validKeys) {
    assert.ok(UtilityAppKeySchema.safeParse(key).success, `Key ${key} should be valid`);
  }
});

test("UtilityAppKeySchema - invalid keys", () => {
  const invalidKeys = [
    "ab", // too short
    "a".repeat(101), // too long
    "My-App", // uppercase
    "my--app", // consecutive hyphens
    "-my-app", // starts with hyphen
    "my-app-", // ends with hyphen
    "my_app", // underscore
  ];
  for (const key of invalidKeys) {
    assert.strictEqual(UtilityAppKeySchema.safeParse(key).success, false, `Key ${key} should be invalid`);
  }
});

test("CapabilityKeySchema - valid keys", () => {
  const validKeys = ["cap-1", "my-capability", "123-abc"];
  for (const key of validKeys) {
    assert.ok(CapabilityKeySchema.safeParse(key).success, `Capability key ${key} should be valid`);
  }
});

test("CapabilityKeySchema - invalid keys", () => {
  const invalidKeys = ["My-Cap", "cap_1", "cap.1", " "];
  for (const key of invalidKeys) {
    assert.strictEqual(CapabilityKeySchema.safeParse(key).success, false, `Capability key ${key} should be invalid`);
  }
});

test("UtilityAppDefinitionSchema - name cannot be empty", () => {
  const invalid = { ...validBase, name: "" };
  assert.strictEqual(UtilityAppDefinitionSchema.safeParse(invalid).success, false);
});

test("UtilityAppDefinitionSchema - version must be positive integer", () => {
  const cases = [0, -1, 1.5];
  for (const version of cases) {
    const invalid = { ...validBase, version };
    assert.strictEqual(UtilityAppDefinitionSchema.safeParse(invalid).success, false, `Version ${version} should be invalid`);
  }
});

test("UtilityAppDefinitionSchema - required fields", () => {
  const requiredFields = ["id", "workspaceId", "key", "name", "category", "status", "version", "inputSchema", "outputSchema", "configuration", "createdAt", "updatedAt", "createdById"];
  for (const field of requiredFields) {
    const invalid = { ...validBase } as any;
    delete invalid[field];
    assert.strictEqual(UtilityAppDefinitionSchema.safeParse(invalid).success, false, `Field ${field} should be required`);
  }
});

test("UtilityAppDefinitionSchema - tags must be unique", () => {
  const invalid = { ...validBase, tags: ["tag1", "tag1"] };
  const result = UtilityAppDefinitionSchema.safeParse(invalid);
  assert.strictEqual(result.success, false, "Duplicate tags should be invalid");
});

test("UtilityAppDefinitionSchema - capabilityKeys must be unique", () => {
  const invalid = { ...validBase, capabilityKeys: ["cap-1", "cap-1"] };
  const result = UtilityAppDefinitionSchema.safeParse(invalid);
  assert.strictEqual(result.success, false, "Duplicate capabilityKeys should be invalid");
});

test("UtilityAppDefinitionSchema - rejects unknown fields", () => {
  const invalid = { ...validBase, unknownField: "val" };
  assert.strictEqual(UtilityAppDefinitionSchema.safeParse(invalid).success, false, "Unknown fields should be rejected");
});

test("UtilityAppDefinitionSchema - input is not mutated", () => {
  const input = { ...validBase };
  const inputCopy = JSON.parse(JSON.stringify(input));
  UtilityAppDefinitionSchema.parse(input);
  assert.deepStrictEqual(input, inputCopy, "Input object should not be mutated");
});
