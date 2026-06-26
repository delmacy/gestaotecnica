import { test, describe } from "node:test";
import assert from "node:assert";
import { createAssetKernelAction, updateAssetKernelAction, updateAssetStatusKernelAction } from "../../src/modules/assets/kernel-actions";

describe("Assets Module - Kernel Actions", () => {
  test("createAssetKernelAction should have correct configuration", () => {
    assert.strictEqual(createAssetKernelAction.key, "assets.create");
    assert.strictEqual(createAssetKernelAction.moduleKey, "assets");
  });

  test("updateAssetKernelAction should have correct configuration", () => {
    assert.strictEqual(updateAssetKernelAction.key, "assets.update");
    assert.strictEqual(updateAssetKernelAction.moduleKey, "assets");
  });

  test("updateAssetStatusKernelAction should have correct configuration", () => {
    assert.strictEqual(updateAssetStatusKernelAction.key, "assets.update_status");
    assert.strictEqual(updateAssetStatusKernelAction.moduleKey, "assets");
  });

  test("actions should require workspaceId in context", async () => {
    const result = await createAssetKernelAction.handler({}, { userId: "user-1" } as any);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error?.code, "MISSING_WORKSPACE");
  });
});
