import { describe, it, before } from "node:test";
import assert from "node:assert";
import { initializePlatformKernel } from "@/platform/kernel";
import { getModule } from "@/platform/modules";

describe("WorkIntakeModule Integration", () => {
  before(() => {
    initializePlatformKernel();
  });

  it("should have registered the work-intake module in the kernel", () => {
    const module = getModule("work-intake");
    assert.ok(module, "Module work-intake should be registered");
    assert.strictEqual(module?.key, "work-intake");
  });
});
