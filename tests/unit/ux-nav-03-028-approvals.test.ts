import { describe, it, before } from "node:test";
import assert from "node:assert";
import { initializePlatformKernel } from "@/platform/kernel";
import { getAction } from "@/platform/actions";

describe("Approvals Kernel Initialization", () => {
  before(() => {
    initializePlatformKernel();
  });

  it("should have registered the approvals actions in the kernel enabling getAction to find them", () => {
    const requestAction = getAction("approvals.request");
    assert.ok(requestAction, "Action approvals.request should be registered and retrievable");
    assert.strictEqual(requestAction.key, "approvals.request");

    const decideAction = getAction("approvals.decide");
    assert.ok(decideAction, "Action approvals.decide should be registered and retrievable");
    assert.strictEqual(decideAction.key, "approvals.decide");
  });
});
