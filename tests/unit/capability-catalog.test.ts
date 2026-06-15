import { test } from "node:test";
import assert from "node:assert";
import { EXAMPLE_CAPABILITIES } from "../../src/platform/registry/capabilities/examples";
import { CapabilitySchema } from "../../src/platform/registry/capabilities/schemas";
import { CAPABILITY_DOMAINS, CAPABILITY_GROUPS } from "../../src/platform/registry/capabilities/catalog";

test("capability catalog foundation", async (t) => {
  await t.test("all example capabilities should be valid according to schema", () => {
    for (const cap of EXAMPLE_CAPABILITIES) {
      const result = CapabilitySchema.safeParse(cap);
      if (!result.success) {
        console.error(`Validation failed for ${cap.key}:`, result.error.format());
      }
      assert.strictEqual(result.success, true, `Capability ${cap.key} should be valid`);
    }
  });

  await t.test("capability keys should be unique", () => {
    const keys = EXAMPLE_CAPABILITIES.map(c => c.key);
    const uniqueKeys = new Set(keys);
    assert.strictEqual(keys.length, uniqueKeys.size, "All capability keys must be unique");
  });

  await t.test("capability IDs should be unique", () => {
    const ids = EXAMPLE_CAPABILITIES.map(c => c.id);
    const uniqueIds = new Set(ids);
    assert.strictEqual(ids.length, uniqueIds.size, "All capability IDs must be unique");
  });

  await t.test("dependencies should exist in the catalog", () => {
    const allKeys = new Set(EXAMPLE_CAPABILITIES.map(c => c.key));
    for (const cap of EXAMPLE_CAPABILITIES) {
      if (cap.dependencies) {
        for (const depKey of cap.dependencies) {
          assert.strictEqual(allKeys.has(depKey), true, `Dependency ${depKey} of ${cap.key} should exist in catalog`);
        }
      }
    }
  });

  await t.test("relatedCapabilities should exist in the catalog", () => {
    const allKeys = new Set(EXAMPLE_CAPABILITIES.map(c => c.key));
    for (const cap of EXAMPLE_CAPABILITIES) {
      if (cap.relatedCapabilities) {
        for (const relKey of cap.relatedCapabilities) {
          assert.strictEqual(allKeys.has(relKey), true, `Related capability ${relKey} of ${cap.key} should exist in catalog`);
        }
      }
    }
  });

  await t.test("no capability should depend on itself", () => {
    for (const cap of EXAMPLE_CAPABILITIES) {
      if (cap.dependencies) {
        assert.strictEqual(cap.dependencies.includes(cap.key), false, `Capability ${cap.key} should not depend on itself`);
      }
    }
  });

  await t.test("no direct dependency cycles", () => {
    for (const cap of EXAMPLE_CAPABILITIES) {
      if (cap.dependencies) {
        for (const depKey of cap.dependencies) {
          const dep = EXAMPLE_CAPABILITIES.find(c => c.key === depKey);
          if (dep && dep.dependencies) {
            assert.strictEqual(dep.dependencies.includes(cap.key), false, `Direct cycle detected between ${cap.key} and ${depKey}`);
          }
        }
      }
    }
  });

  await t.test("domains and groups should be valid", () => {
    const validDomains = new Set(Object.values(CAPABILITY_DOMAINS));
    const validGroups = new Set(Object.values(CAPABILITY_GROUPS));

    for (const cap of EXAMPLE_CAPABILITIES) {
      assert.strictEqual(validDomains.has(cap.domain as any), true, `Domain ${cap.domain} of ${cap.key} should be valid`);
      assert.strictEqual(validGroups.has(cap.group as any), true, `Group ${cap.group} of ${cap.key} should be valid`);
    }
  });

  await t.test("businessActions and businessObjects should not be empty", () => {
    for (const cap of EXAMPLE_CAPABILITIES) {
      assert.ok(cap.businessActions.length > 0, `Capability ${cap.key} should have at least one business action`);
      assert.ok(cap.businessObjects.length > 0, `Capability ${cap.key} should have at least one business object`);
    }
  });

  await t.test("should be serializable to JSON", () => {
    const json = JSON.stringify(EXAMPLE_CAPABILITIES);
    const parsed = JSON.parse(json);
    assert.deepStrictEqual(parsed.length, EXAMPLE_CAPABILITIES.length);
  });
});
