import { describe, it } from "node:test";
import assert from "node:assert";

import { EXAMPLE_CAPABILITIES } from "../../src/platform/registry/capabilities/examples";
import { CapabilitySchema } from "../../src/platform/registry/capabilities/schemas";
import { listCapabilitiesKernelAction } from "../../src/platform/registry/actions/kernel-actions";
import { checkSafeJsonValue } from "../../src/platform/contracts/safe-json";
import { checkSafety } from "../../src/platform/actions/contracts/safe-traversal";

describe("Registry Contracts", () => {
  describe("Capabilities Catalog", () => {
    it("should have unique capability IDs", () => {
      const ids = EXAMPLE_CAPABILITIES.map((c) => c.id);
      const uniqueIds = new Set(ids);
      assert.strictEqual(
        uniqueIds.size,
        ids.length,
        "Duplicate capability IDs found"
      );
    });

    it("should have unique capability keys", () => {
      const keys = EXAMPLE_CAPABILITIES.map((c) => c.key);
      const uniqueKeys = new Set(keys);
      assert.strictEqual(
        uniqueKeys.size,
        keys.length,
        "Duplicate capability keys found"
      );
    });

    it("should have valid capabilities matching schema", () => {
      for (const cap of EXAMPLE_CAPABILITIES) {
        const result = CapabilitySchema.safeParse(cap);
        assert.strictEqual(
          result.success,
          true,
          `Capability schema validation failed for ${cap.key}: ${
            !result.success ? result.error.message : ""
          }`
        );
      }
    });

    it("should have serializable safe JSON metadata", () => {
      for (const cap of EXAMPLE_CAPABILITIES) {
        const result = checkSafeJsonValue(cap.metadata);
        assert.strictEqual(
          result.isSafe,
          true,
          `Capability metadata is not safe JSON for ${cap.key}`
        );
      }
    });

    it("should ensure relatedCapabilities and dependencies reference existing capabilities", () => {
       const keys = new Set(EXAMPLE_CAPABILITIES.map(c => c.key));
       for (const cap of EXAMPLE_CAPABILITIES) {
          for (const rel of cap.relatedCapabilities) {
             assert.strictEqual(keys.has(rel), true, `Related capability ${rel} not found in catalog (from ${cap.key})`);
          }
          for (const dep of cap.dependencies) {
             assert.strictEqual(keys.has(dep), true, `Dependency ${dep} not found in catalog (from ${cap.key})`);
          }
       }
    });
  });

  describe("Actions Catalog", () => {
    it("should have safe JSON input schemas for kernel actions", () => {
      const actions = [listCapabilitiesKernelAction];

      for (const action of actions) {
        const result = checkSafety(action.inputSchema);
        assert.strictEqual(
          result.isSafe,
          true,
          `Action input schema is not safe JSON for ${action.key}`
        );
      }
    });
  });
});
// Trigger PR update
